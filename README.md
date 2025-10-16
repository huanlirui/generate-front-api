# generate-front-api

基于 OpenAPI 规范自动生成 TypeScript API 请求代码和类型定义的工具。

## ✨ 功能特性

- ✅ 根据 OpenAPI JSON 自动生成 TypeScript 类型定义
- ✅ 自动生成 API 请求函数
- ✅ **智能类型推断** - 自动从响应中提取准确类型,避免 `any`
- ✅ **可配置** - 支持自定义配置文件
- ✅ **单一模板系统** - 使用统一模板文件,易于自定义
- ✅ 智能类型映射,只导入使用到的类型
- ✅ 自动代码格式化(Prettier)
- ✅ **响应包装类型解析** - 自动解析 `RVoid`、`RList*`、`R*` 等包装类型
- ✅ **多模块生成** - 根据 OpenAPI tag 自动分组,生成独立模块文件夹
- ✅ **唯一函数名** - 基于 URL 路径和 HTTP 方法生成唯一函数名
- ✅ **支持远程获取** - 可从 URL 直接获取 OpenAPI JSON

## 📦 安装

```bash
npm install generate-front-api --save-dev
```

## 🚀 快速开始

### 1. 初始化配置

在项目根目录创建配置文件 `generate-front-api.config.js`:

```javascript
export default {
  // OpenAPI 数据源 - 选择其中一种方式
  openApiFile: 'openApi.json',  // 方式1: 本地文件
  // openApiUrl: 'https://api.example.com/v3/api-docs',  // 方式2: 远程URL

  // 输出配置
  output: {
    baseDir: 'src/api'  // 生成代码的目录
  },

  // 命名策略: 'path' | 'tag' | 'tagMapping'
  naming: {
    namingStrategy: 'path',  // 推荐使用 path 策略
    pathDepth: 2  // URL 路径深度
  }
};
```

### 2. 准备 OpenAPI 数据源

**方式 1: 使用本地文件**

将 OpenAPI JSON 文件放到项目根目录，命名为 `openApi.json`

**方式 2: 从 URL 获取**

在配置文件中设置 `openApiUrl`，或通过命令行参数指定：

```bash
npx generate-front-api --url=https://api.example.com/v3/api-docs
```

### 3. 添加 npm 脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "generate:api": "generate-front-api"
  }
}
```

### 4. 运行生成器

```bash
npm run generate:api
```

生成的文件会输出到配置的 `baseDir` 目录中。

## 📁 生成结果示例

```
src/api/
├── hr/
│   ├── basicManage/
│   │   ├── index.ts
│   │   └── types.ts
│   └── medicalOrgItem/
│       ├── index.ts
│       └── types.ts
├── staffManage/
│   └── orgStaff/
│       ├── index.ts
│       └── types.ts
```

### types.ts 示例

```typescript
export interface OrgDeptVO {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 科室编码
   */
  deptCode?: string;
}

export interface OrgDeptQuery {
  /** 科室编码 */
  deptCode?: string;
}
```

### index.ts 示例

```typescript
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrgDeptVO, OrgDeptQuery } from './types';

/**
 * 查询列表
 * @param query
 * @returns {*}
 */
export const listOrgDept = (query?: OrgDeptQuery): AxiosPromise<OrgDeptVO[]> => {
  return request({
    url: '/deptManage/orgDept/list',
    method: 'get',
    params: query
  });
};
```

## ⚙️ 配置说明

### 完整配置示例

```javascript
export default {
  // OpenAPI 数据源配置
  openApiFile: 'openApi.json',  // 本地文件路径
  openApiUrl: null,  // 远程 URL（优先级高于 openApiFile）

  // 输出配置
  output: {
    baseDir: 'src/api'  // 生成代码的基础目录
  },

  // 命名配置
  naming: {
    voSuffix: 'VO',        // 视图对象后缀
    formSuffix: 'Form',    // 表单对象后缀
    querySuffix: 'Query',  // 查询对象后缀

    // 命名策略
    // - 'path': 使用 URL 路径作为目录名（推荐）
    // - 'tag': 使用 OpenAPI tag 作为目录名
    // - 'tagMapping': 使用自定义映射表
    namingStrategy: 'path',

    // 路径深度（namingStrategy='path' 时生效）
    pathDepth: 2,

    // Tag 映射表（namingStrategy='tagMapping' 时生效）
    tagMapping: {
      '人力资源-基础管理': 'hr/basicManage',
      '部门管理': 'deptManage/orgDept',
      'default': 'common'
    }
  },

  // 类型配置
  types: {
    // 基础类型映射
    typeMapping: {
      integer: 'number',
      string: 'string',
      boolean: 'boolean',
      array: 'any[]',
      object: 'any',
      Long: 'string | number',
      long: 'string | number'
    },

    // 是否将 int64 转换为 string | number
    int64AsUnion: true,

    // 排除的字段
    excludeFields: []
  },

  // 格式化配置
  formatting: {
    runPrettier: true  // 是否运行 Prettier 格式化
  },

  // 生命周期钩子
  hooks: {
    beforeGenerate: (openApiData) => {
      console.log(`开始生成 API: ${openApiData.info?.title}`);
    },
    afterGenerate: (result) => {
      console.log(`生成完成，共 ${result.moduleCount} 个模块`);
    }
  }
};
```

### 命名策略说明

#### 1. path 策略（推荐）

直接使用 URL 路径作为目录名，自动化且生成英文目录：

```javascript
naming: {
  namingStrategy: 'path',
  pathDepth: 2  // URL 深度
}
```

示例：

- `/hr/basicManage/medicalOrg` → `src/api/hr/basicManage/`
- `/staffManage/orgStaff` → `src/api/staffManage/orgStaff/`

#### 2. tag 策略

使用 OpenAPI 的 `tags` 字段作为目录名：

```javascript
naming: {
  namingStrategy: 'tag'
}
```

示例：

- `tags: ["医疗机构"]` → `src/api/医疗机构/`

#### 3. tagMapping 策略

使用自定义映射表：

```javascript
naming: {
  namingStrategy: 'tagMapping',
  tagMapping: {
    '人力资源-基础管理': 'hr/basicManage',
    'default': 'common'
  }
}
```

## 🎨 自定义模板

生成器支持两个可自定义的模板文件，你可以在项目根目录创建 `templates/` 目录并放置自定义模板。

### API 函数模板

在项目根目录创建 `templates/api-function.template` 来自定义生成的 API 函数格式：

```typescript
/**
 * {{summary}}
 * @param {{paramName}}
 {{#hasReturns}}* @returns {*}{{/hasReturns}}
 */
export const {{functionName}} = ({{params}}): AxiosPromise<{{returnType}}> => {
  return request({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });
};
```

### 可用模板变量

| 变量名 | 说明 | 示例值 |
|-------|------|-------|
| `{{summary}}` | API 描述 | "查询列表" |
| `{{functionName}}` | 函数名 | "listOrgDept" |
| `{{params}}` | 函数参数 | "query?: OrgDeptQuery" |
| `{{returnType}}` | 返回类型 | "OrgDeptVO[]" |
| `{{url}}` | 请求 URL | "'/api/list'" |
| `{{method}}` | HTTP 方法 | "get", "post" |
| `{{hasData}}` | 是否有 data 参数 | true/false |
| `{{hasParams}}` | 是否有 params 参数 | true/false |

### 文件头部模板

在项目根目录创建 `templates/index-header.template` 来自定义生成文件的导入语句：

**默认模板内容**:

```typescript
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
{{#hasTypeImports}}import { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

**可用变量**:

| 变量名 | 说明 | 示例值 |
|-------|------|-------|
| `{{typeImports}}` | 类型导入列表 | "UserVO, UserQuery" |
| `{{typeImportPath}}` | 类型文件路径 | "./types" |
| `{{hasTypeImports}}` | 是否有类型导入 | true/false |

**自定义示例** - 使用自定义 HTTP 客户端：

```typescript
import http from '@/utils/http';
import type { ResponsePromise } from '@/types';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

## 🔧 函数命名规则

生成器会基于 URL 路径和 HTTP 方法自动生成函数名：

| URL 示例 | HTTP 方法 | 生成函数名 |
|---------|---------|-----------|
| `/hr/medicalOrg/list` | GET | `listMedicalOrgList` |
| `/hr/medicalOrg/{id}` | GET | `getMedicalOrg` |
| `/deptManage/orgDept` | POST | `addDeptManageOrgDept` |
| `/deptManage/orgDept` | PUT | `updateDeptManageOrgDept` |
| `/deptManage/orgDept/{id}` | DELETE | `delDeptManageOrgDept` |

命名规则：

- GET + `/list` → `list{Entity}List`
- GET + `/{param}` → `get{Entity}`
- GET (其他) → `query{Entity}`
- POST → `add{Entity}`
- PUT → `update{Entity}`
- DELETE → `del{Entity}`

## 📝 使用场景

### 场景 1: 本地开发

```bash
# 1. 创建配置文件
echo "export default { openApiFile: 'openApi.json', output: { baseDir: 'src/api' } };" > generate-front-api.config.js

# 2. 运行生成
npm run generate:api
```

### 场景 2: 从远程获取

```bash
# 通过命令行参数
npx generate-front-api --url=https://api.example.com/v3/api-docs

# 或在配置文件中设置
# openApiUrl: 'https://api.example.com/v3/api-docs'
```

### 场景 3: 集成到 CI/CD

```json
{
  "scripts": {
    "generate:api": "generate-front-api",
    "prebuild": "npm run generate:api"
  }
}
```

## 🤔 常见问题

### Q: 如何修改生成的目录结构?

A: 修改配置文件中的 `naming.namingStrategy` 和 `naming.pathDepth`。

### Q: 如何自定义类型映射?

A: 在配置文件的 `types.typeMapping` 中添加自定义映射。

### Q: 如何禁用 Prettier 格式化?

A: 设置 `formatting.runPrettier: false`。

### Q: 生成的代码中有不需要的字段?

A: 在 `types.excludeFields` 数组中添加字段名。

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [GitHub](https://github.com/huanlirui/generate-front-api)
- [Issues](https://github.com/huanlirui/generate-front-api/issues)
