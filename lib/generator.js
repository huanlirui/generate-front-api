import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 默认配置
const defaultConfig = {
  openApiFile: 'openApi.json',
  openApiUrl: null,
  output: {
    baseDir: 'src/api'
  },
  naming: {
    voSuffix: 'VO',
    formSuffix: 'Form',
    querySuffix: 'Query',
    // 命名策略: 'tag' | 'tagMapping' | 'path'
    // - tag: 直接使用 OpenAPI 的 tag 作为目录名(可能是中文)
    // - tagMapping: 使用 tag 映射表,将 tag 映射为自定义目录名
    // - path: 使用 URL 路径作为目录名(自动化,推荐)
    namingStrategy: 'path',
    // 路径深度: 从 URL 路径提取多少层作为目录名
    // 例如: /hr/basicManage/medicalOrg
    // pathDepth=2 -> hr/basicManage
    // pathDepth=3 -> hr/basicManage/medicalOrg
    pathDepth: 2,
    // Tag 映射配置: 当 namingStrategy='tagMapping' 时使用
    // 将 OpenAPI tag 映射到自定义目录路径
    tagMapping: {
      // '人力资源-基础管理': 'hr/basicManage',
      // '部门管理': 'deptManage/orgDept',
      // 'default': 'common'
    }
  },
  types: {
    typeMapping: {
      integer: 'number',
      string: 'string',
      boolean: 'boolean',
      array: 'any[]',
      object: 'any',
      Long: 'string | number',
      long: 'string | number'
    },
    int64AsUnion: true,
    excludeFields: []
  },
  formatting: {
    runPrettier: true
  },
  hooks: {
    beforeGenerate: (openApiData) => {
      console.log(`📦 API 标题: ${openApiData.info?.title || '未知'}`);
    },
    afterGenerate: (result) => {
      console.log(`\n✅ 共生成 ${result.moduleCount} 个模块`);
    }
  }
};

export class ApiGenerator {
  constructor(config = {}) {
    // 深度合并配置
    this.config = this.mergeConfig(defaultConfig, config);
    this.openApiData = null;
  }

  // 深度合并配置
  mergeConfig(defaultCfg, userCfg) {
    const result = { ...defaultCfg };

    for (const key in userCfg) {
      if (userCfg[key] !== undefined) {
        if (typeof userCfg[key] === 'object' && !Array.isArray(userCfg[key]) && userCfg[key] !== null) {
          result[key] = this.mergeConfig(defaultCfg[key] || {}, userCfg[key]);
        } else {
          result[key] = userCfg[key];
        }
      }
    }

    return result;
  }

  // 加载 OpenAPI 数据
  async loadOpenApi() {
    if (this.config.openApiUrl) {
      console.log(`🌐 从 URL 获取 OpenAPI: ${this.config.openApiUrl}`);
      try {
        const response = await fetch(this.config.openApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.openApiData = await response.json();
        console.log(`✅ 成功从 URL 获取 OpenAPI 数据\n`);
      } catch (error) {
        console.error(`❌ 从 URL 获取失败: ${error.message}`);
        throw error;
      }
    } else {
      const openApiPath = path.join(process.cwd(), this.config.openApiFile);
      console.log(`📁 从本地文件读取 OpenAPI: ${openApiPath}`);
      
      if (!fs.existsSync(openApiPath)) {
        throw new Error(`OpenAPI 文件不存在: ${openApiPath}`);
      }
      
      this.openApiData = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
    }
  }

  // 从 parameters 中提取参数类型
  extractParametersType(parameters) {
    if (!parameters || parameters.length === 0) return null;

    // 分别处理 path 和 query 参数
    const pathParams = parameters.filter((p) => p.in === 'path');
    const queryParams = parameters.filter((p) => p.in === 'query');

    return {
      pathParams,
      queryParams,
      hasPath: pathParams.length > 0,
      hasQuery: queryParams.length > 0
    };
  }

  // 生成参数的 TypeScript 类型
  generateParamType(param) {
    let type = this.getTypeScriptType(param.schema);

    // 对于数组类型的 path 参数,使用字符串数组
    if (param.in === 'path' && param.schema?.type === 'array') {
      type = 'string | number';
    }

    return type;
  }

  // 生成查询参数的接口定义
  generateQueryParamsInterface(queryParams, functionName) {
    if (!queryParams || queryParams.length === 0) return null;

    const interfaceName = `${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}Query`;
    let result = `export interface ${interfaceName} {\n`;

    queryParams.forEach((param) => {
      const type = this.generateParamType(param);
      const optional = param.required ? '' : '?';
      const description = param.description || '';

      if (description) {
        result += `  /** ${description} */\n`;
      }
      result += `  ${param.name}${optional}: ${type};\n\n`;
    });

    result += '}\n\n';
    return { interfaceName, definition: result };
  }

  // 生成内联 requestBody 的接口定义
  generateRequestBodyInterface(requestBody, functionName) {
    if (!requestBody) return null;

    const content = requestBody.content?.['application/json'];
    if (!content || !content.schema) return null;

    const schema = content.schema;
    
    // 只处理内联 schema
    if (schema.type !== 'object' || !schema.properties) return null;

    const interfaceName = `${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}Data`;
    const definition = this.generateInterface(schema, interfaceName);

    return { interfaceName, definition };
  }

  // 获取 TypeScript 类型
  getTypeScriptType(schema) {
    if (!schema) return 'any';

    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop();
      return refName;
    }

    if (schema.type === 'array' && schema.items) {
      const itemType = this.getTypeScriptType(schema.items);
      return `${itemType}[]`;
    }

    if (schema.type === 'integer' && schema.format === 'int64' && this.config.types.int64AsUnion) {
      return 'string | number';
    }

    return this.config.types.typeMapping[schema.type] || 'any';
  }

  // 从响应 schema 中提取数据类型
  extractResponseType(responses) {
    if (!responses || !responses['200']) return 'void';

    const successResponse = responses['200'];
    const content = successResponse.content?.['application/json'] || successResponse.content?.['*/*'];

    // 如果没有 content 或者 content 是空对象,返回 void
    if (!content) return 'void';

    // 如果有 content 但没有 schema,检查是否是文件下载等特殊类型
    if (!content.schema) {
      // 文件下载等场景
      return 'Blob';
    }

    const schema = content.schema;

    // 如果 schema 是空对象 {},返回 void
    if (schema.type === 'object' && !schema.properties && !schema.$ref) {
      return 'void';
    }

    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop();

      if (refName === 'RVoid') {
        return 'void';
      }

      // 处理 RLong -> string | number
      if (refName === 'RLong') {
        return 'string | number';
      }

      if (refName.startsWith('RList')) {
        const innerType = refName.replace('RList', '');
        // 处理基本类型
        if (this.config.types.typeMapping[innerType]) {
          return `${this.config.types.typeMapping[innerType]}[]`;
        }
        return `${innerType}[]`;
      }

      if (refName.startsWith('R')) {
        const innerType = refName.substring(1);
        // 处理基本类型
        if (this.config.types.typeMapping[innerType]) {
          return this.config.types.typeMapping[innerType];
        }
        return innerType;
      }

      return refName;
    }

    // 如果是 string 类型,通常是文件下载
    if (schema.type === 'string') {
      return 'string';
    }

    return 'any';
  }

  // 从请求体中提取数据类型
  extractRequestType(requestBody) {
    if (!requestBody) return null;

    const content = requestBody.content?.['application/json'];
    if (!content || !content.schema) return null;

    const schema = content.schema;

    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop();
      return refName;
    }

    // 处理内联 schema (type: 'object' 且有 properties)
    if (schema.type === 'object' && schema.properties) {
      return 'inline-schema';
    }

    return null;
  }

  // 生成接口定义
  generateInterface(schema, interfaceName) {
    if (!schema || !schema.properties) return '';

    const properties = schema.properties;
    const required = schema.required || [];

    let result = `export interface ${interfaceName} {\n`;

    Object.entries(properties).forEach(([propName, propSchema], index) => {
      if (this.config.types.excludeFields.includes(propName)) return;

      const description = propSchema.description || '';
      const type = this.getTypeScriptType(propSchema);
      const optional = required.includes(propName) ? '' : '?';

      if (description) {
        result += `  /**\n   * ${description}\n   */\n`;
      }
      result += `  ${propName}${optional}: ${type};\n`;

      if (index < Object.entries(properties).length - 1) {
        result += '\n';
      }
    });

    result += '}\n';
    return result;
  }

  // 收集所有使用的 schema(包括嵌套依赖) - 用于生成 types.ts
  collectSchemasFromApis(apis) {
    const schemas = new Set();
    const allSchemas = this.openApiData.components?.schemas || {};

    // 递归收集依赖的 schema
    const collectDependencies = (schemaName) => {
      if (schemas.has(schemaName) || !allSchemas[schemaName]) return;

      schemas.add(schemaName);

      const schema = allSchemas[schemaName];
      if (schema.properties) {
        Object.values(schema.properties).forEach((prop) => {
          if (prop.$ref) {
            const refName = prop.$ref.split('/').pop();
            collectDependencies(refName);
          } else if (prop.items && prop.items.$ref) {
            const refName = prop.items.$ref.split('/').pop();
            collectDependencies(refName);
          }
        });
      }
    };

    for (const api of apis) {
      const { details } = api;

      // 从响应中收集
      const responseType = this.extractResponseType(details.responses);
      if (responseType && responseType !== 'any' && responseType !== 'void' && responseType !== 'Blob' && responseType !== 'string') {
        const typeName = responseType.replace(/\[\]$/, '');
        // 排除基本类型
        if (!this.config.types.typeMapping[typeName] && typeName !== 'string | number') {
          collectDependencies(typeName);
        }
      }

      // 从请求体中收集
      const requestType = this.extractRequestType(details.requestBody);
      if (requestType && requestType !== 'any') {
        collectDependencies(requestType);
      }
    }

    return schemas;
  }

  // 收集直接使用的类型（用于 index.ts 的 import）- 不包括嵌套依赖
  collectDirectlyUsedTypes(apis) {
    const types = new Set();

    for (const api of apis) {
      const { details } = api;

      // 从响应中收集直接使用的类型
      const responseType = this.extractResponseType(details.responses);
      if (responseType && responseType !== 'any' && responseType !== 'void' && responseType !== 'Blob' && responseType !== 'string') {
        const typeName = responseType.replace(/\[\]$/, '');
        // 排除基本类型
        if (!this.config.types.typeMapping[typeName] && typeName !== 'string | number') {
          types.add(typeName);
        }
      }

      // 从请求体中收集直接使用的类型（只针对 $ref 引用的类型）
      const requestType = this.extractRequestType(details.requestBody);
      if (requestType && requestType !== 'any' && requestType !== 'inline-schema') {
        types.add(requestType);
      }
    }

    return types;
  }

  // 为 tag 生成 types.ts
  generateTypesForTag(apis) {
    const schemas = this.openApiData.components?.schemas || {};
    const usedSchemas = this.collectSchemasFromApis(apis);

    if (usedSchemas.size === 0) {
      return '';
    }

    let typesContent = '';

    for (const schemaName of usedSchemas) {
      const schema = schemas[schemaName];
      if (schema) {
        typesContent += this.generateInterface(schema, schemaName);
        typesContent += '\n';
      }
    }

    return typesContent;
  }

  // 生成函数名(基于 URL 和方法)
  generateFunctionName(url, method) {
    const cleanUrl = url.replace(/\{[^}]+\}/g, '');
    const parts = cleanUrl.split('/').filter((part) => part);
    const nameParts = parts.slice(-2);

    const entityName = nameParts
      .map((part, index) => {
        if (index === 0) return part;
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join('');

    const methodPrefix =
      {
        get: url.includes('/list') ? 'list' : url.includes('/tree') ? 'query' : url.includes('{') ? 'get' : 'query',
        post: url.includes('/export') ? 'export' : 'add',
        put: 'update',
        delete: 'del'
      }[method] || method;

    return `${methodPrefix}${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
  }

  // 加载模板
  loadTemplate(templateName = 'api-function.template') {
    // 优先从项目根目录的 templates 目录加载
    const userTemplatePath = path.join(process.cwd(), 'templates', templateName);
    if (fs.existsSync(userTemplatePath)) {
      return fs.readFileSync(userTemplatePath, 'utf-8');
    }

    // 否则从包内置模板加载
    const defaultTemplatePath = path.join(__dirname, '..', 'templates', templateName);
    if (fs.existsSync(defaultTemplatePath)) {
      return fs.readFileSync(defaultTemplatePath, 'utf-8');
    }

    // 如果都不存在，返回 null
    return null;
  }

  // 简单的模板渲染引擎(类似 Mustache)
  renderTemplate(template, data) {
    let result = template;

    // 处理条件块 {{#key}}...{{/key}}
    result = result.replace(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/gs, (_, key, content) => {
      return data[key] ? content : '';
    });

    // 处理变量 {{key}}
    result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return data[key] !== undefined ? data[key] : _;
    });

    return result;
  }

  // 为 tag 生成 API 函数
  generateApisForTag(apis, queryInterfaces = [], requestBodyInterfaces = []) {
    const template = this.loadTemplate();
    let functions = '';

    for (const api of apis) {
      const { url, method, details } = api;
      const summary = details.summary || details.description || '';
      const functionName = this.generateFunctionName(url, method);
      const paramInfo = this.extractParametersType(details.parameters);
      const returnType = this.extractResponseType(details.responses);

      // 处理 path 参数
      let urlExpression = `'${url}'`;
      const pathParams = [];

      if (paramInfo && paramInfo.hasPath) {
        let tempUrl = url;
        paramInfo.pathParams.forEach((param) => {
          const paramName = param.name;
          const paramType = this.generateParamType(param);
          pathParams.push({ name: paramName, type: paramType });
          tempUrl = tempUrl.replace(`{${paramName}}`, `\${${paramName}}`);
        });
        urlExpression = `\`${tempUrl}\``;
      }

      // 处理 query 参数
      let queryType = null;
      if (paramInfo && paramInfo.hasQuery) {
        const queryInterface = queryInterfaces.find((qi) => qi.functionName === functionName);
        queryType = queryInterface ? queryInterface.interfaceName : 'any';
      }

      // 处理 request body
      let requestType = this.extractRequestType(details.requestBody);
      
      // 如果是内联 schema，查找生成的接口名称
      if (requestType === 'inline-schema') {
        const bodyInterface = requestBodyInterfaces.find((bi) => bi.functionName === functionName);
        requestType = bodyInterface ? bodyInterface.interfaceName : 'any';
      }

      // 构建参数列表
      const params = [];
      const paramNames = [];

      // 添加 path 参数
      pathParams.forEach((p) => {
        params.push(`${p.name}: ${p.type}`);
        paramNames.push(p.name);
      });

      // 根据方法类型添加对应参数
      if (method === 'get' || method === 'delete') {
        if (queryType) {
          const paramName = method === 'delete' ? 'params' : 'query';
          params.push(`${paramName}?: ${queryType}`);
          paramNames.push(paramName);
        }
      } else if (method === 'post' || method === 'put') {
        // 只有当存在 requestBody 时才添加 data 参数
        if (requestType) {
          params.push(`data: ${requestType}`);
          paramNames.push('data');
        }
        // POST/PUT 也可能有 query 参数
        if (queryType) {
          params.push(`query?: ${queryType}`);
          paramNames.push('query');
        }
      }

      // 构建 @param 注释
      let paramComment = '';
      paramNames.forEach((name) => {
        paramComment += ` * @param ${name}\n`;
      });

      // 确定 data 和 params 参数
      let hasData = false;
      let dataParam = '';
      let hasParams = false;
      let paramsParam = '';

      if (method === 'get') {
        hasParams = queryType !== null;
        paramsParam = 'query';
      } else if (method === 'delete') {
        hasParams = queryType !== null;
        paramsParam = 'params';
      } else if (method === 'post' || method === 'put') {
        hasData = requestType !== null;
        dataParam = 'data';
        hasParams = queryType !== null;
        paramsParam = 'query';
      }

      // 准备模板数据
      const templateData = {
        summary: summary,
        paramName: paramComment.trim(),
        hasReturns: returnType !== 'void',
        functionName: functionName,
        params: params.join(', '),
        returnType: returnType,
        url: urlExpression,
        method: method,
        hasData: hasData,
        dataParam: dataParam,
        hasParams: hasParams,
        paramsParam: paramsParam
      };

      // 渲染模板
      const functionCode = this.renderTemplate(template, templateData);
      functions += functionCode;
    }

    return functions;
  }

  // 按 tag 分组 API
  groupApisByTag() {
    const paths = this.openApiData.paths;
    const apiGroups = new Map();
    const strategy = this.config.naming.namingStrategy;

    for (const [url, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods)) {
        let groupKey;

        if (strategy === 'path') {
          // 方式3: 使用 URL 路径作为分组键
          const urlParts = url.split('/').filter((part) => part && !part.includes('{'));
          const depth = this.config.naming.pathDepth || 3;
          groupKey = urlParts.slice(0, depth).join('/') || 'default';
        } else if (strategy === 'tagMapping') {
          // 方式2: 使用 tag 映射
          const originalTag = (details.tags && details.tags[0]) || 'default';
          const tagMapping = this.config.naming.tagMapping || {};
          groupKey = tagMapping[originalTag] || tagMapping['default'] || originalTag;
        } else {
          // 方式1: 直接使用 tag 作为分组键(默认策略)
          groupKey = (details.tags && details.tags[0]) || 'default';
        }

        if (!apiGroups.has(groupKey)) {
          apiGroups.set(groupKey, []);
        }

        apiGroups.get(groupKey).push({
          url,
          method,
          details
        });
      }
    }

    return apiGroups;
  }

  // 主生成函数
  async generate() {
    await this.loadOpenApi();

    this.config.hooks.beforeGenerate(this.openApiData);

    const apiGroups = this.groupApisByTag();

    console.log(`\n📦 发现 ${apiGroups.size} 个模块:\n`);
    const allGeneratedFiles = [];

    for (const [tag, apis] of apiGroups) {
      console.log(`\n🔨 正在生成模块: ${tag}`);

      const modulePath = tag.replace(/\//g, path.sep);
      const outputDir = path.join(process.cwd(), this.config.output.baseDir, modulePath);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 生成查询参数接口
      const queryInterfaces = [];
      for (const api of apis) {
        const paramInfo = this.extractParametersType(api.details.parameters);
        if (paramInfo && paramInfo.hasQuery) {
          const functionName = this.generateFunctionName(api.url, api.method);
          const queryInterface = this.generateQueryParamsInterface(paramInfo.queryParams, functionName);
          if (queryInterface) {
            queryInterfaces.push({
              functionName,
              ...queryInterface
            });
          }
        }
      }

      // 生成内联 requestBody 接口
      const requestBodyInterfaces = [];
      for (const api of apis) {
        const requestType = this.extractRequestType(api.details.requestBody);
        if (requestType === 'inline-schema') {
          const functionName = this.generateFunctionName(api.url, api.method);
          const bodyInterface = this.generateRequestBodyInterface(api.details.requestBody, functionName);
          if (bodyInterface) {
            requestBodyInterfaces.push({
              functionName,
              ...bodyInterface
            });
          }
        }
      }

      // 生成 types.ts
      let typesContent = this.generateTypesForTag(apis);

      // 将查询参数接口添加到 types.ts
      if (queryInterfaces.length > 0) {
        typesContent += '\n// 查询参数接口定义\n';
        queryInterfaces.forEach((qi) => {
          typesContent += qi.definition;
        });
      }

      // 将 requestBody 接口添加到 types.ts
      if (requestBodyInterfaces.length > 0) {
        typesContent += '\n// 请求体接口定义\n';
        requestBodyInterfaces.forEach((bi) => {
          typesContent += bi.definition;
        });
      }

      if (typesContent) {
        const typesPath = path.join(outputDir, 'types.ts');
        fs.writeFileSync(typesPath, typesContent, 'utf-8');
        console.log(`   ✅ 已生成: types.ts`);
        allGeneratedFiles.push(typesPath);
      }

      // 生成 index.ts - 只导入直接使用的类型
      const directlyUsedTypes = this.collectDirectlyUsedTypes(apis);
      const queryInterfaceNames = queryInterfaces.map((qi) => qi.interfaceName);
      const requestBodyInterfaceNames = requestBodyInterfaces.map((bi) => bi.interfaceName);
      const allTypeImports = [...Array.from(directlyUsedTypes), ...queryInterfaceNames, ...requestBodyInterfaceNames];

      // 使用模板生成文件头部
      const headerTemplate = this.loadTemplate('index-header.template');
      let indexContent = '';
      
      if (headerTemplate) {
        // 如果有自定义头部模板，使用模板渲染
        const headerData = {
          typeImports: allTypeImports.join(', '),
          typeImportPath: './types',
          hasTypeImports: allTypeImports.length > 0
        };
        indexContent = this.renderTemplate(headerTemplate, headerData);
      } else {
        // 否则使用默认的导入语句
        indexContent = `import request from '@/utils/request';\n`;
        indexContent += `import { AxiosPromise } from 'axios';\n`;

        if (allTypeImports.length > 0) {
          indexContent += `import { ${allTypeImports.join(', ')} } from './types';\n`;
        }

        indexContent += '\n';
      }

      indexContent += this.generateApisForTag(apis, queryInterfaces, requestBodyInterfaces);

      const indexPath = path.join(outputDir, 'index.ts');
      fs.writeFileSync(indexPath, indexContent, 'utf-8');
      console.log(`   ✅ 已生成: index.ts`);
      allGeneratedFiles.push(indexPath);
    }

    console.log('\n🎉 代码生成完成！');

    // 执行格式化
    if (this.config.formatting.runPrettier && allGeneratedFiles.length > 0) {
      console.log('\n📝 正在执行代码格式化...\n');
      try {
        const { execSync } = await import('child_process');
        const filesStr = allGeneratedFiles.map((f) => `"${f}"`).join(' ');
        execSync(`npx prettier --write ${filesStr}`, {
          stdio: 'inherit',
          cwd: process.cwd()
        });
        console.log('\n✨ 代码格式化完成！');
      } catch (error) {
        console.log('\n⚠️  格式化失败，请手动执行格式化');
      }
    }

    this.config.hooks.afterGenerate({
      generatedFiles: allGeneratedFiles,
      moduleCount: apiGroups.size
    });
  }
}

