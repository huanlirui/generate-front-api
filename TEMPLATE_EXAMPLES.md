# 模板自定义示例

本文档提供了各种实际使用场景的模板自定义示例。

## 📁 模板文件位置

在项目根目录创建 `templates/` 目录：

```
your-project/
├── templates/
│   ├── api-function.template      # API 函数模板
│   └── index-header.template      # 文件头部模板
├── generate-front-api.config.js
└── package.json
```

## 🎯 使用场景示例

### 场景 1: 使用自定义的 HTTP 客户端

#### templates/index-header.template

```typescript
import http from '@/utils/http';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 * @param {{paramName}}
 {{#hasReturns}}* @returns {Promise<{{returnType}}>}{{/hasReturns}}
 */
export const {{functionName}} = ({{params}}) => {
  return http.request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });
};

```

### 场景 2: 使用 fetch API

#### templates/index-header.template

```typescript
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 */
export const {{functionName}} = async ({{params}}): Promise<{{returnType}}> => {
  const response = await fetch({{url}}, {
    method: '{{method}}'.toUpperCase(){{#hasData}},
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({{dataParam}}){{/hasData}}
  });
  return response.json();
};

```

### 场景 3: 使用 React Query

#### templates/index-header.template

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import request from '@/utils/request';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 */
export const {{functionName}} = ({{params}}) => {
  return request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });
};

/**
 * {{summary}} - React Query Hook
 */
export const use{{functionName}} = ({{params}}) => {
  return useQuery({
    queryKey: ['{{functionName}}', {{params}}],
    queryFn: () => {{functionName}}({{params}})
  });
};

```

### 场景 4: 添加请求拦截和错误处理

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 * @param {{paramName}}
 {{#hasReturns}}* @returns {Promise<{{returnType}}>}{{/hasReturns}}
 */
export const {{functionName}} = async ({{params}}): Promise<{{returnType}}> => {
  try {
    const response = await request({
      url: {{url}},
      method: '{{method}}'{{#hasData}},
      data: {{dataParam}}{{/hasData}}{{#hasParams}},
      params: {{paramsParam}}{{/hasParams}}
    });
    return response.data;
  } catch (error) {
    console.error('API Error [{{functionName}}]:', error);
    throw error;
  }
};

```

### 场景 5: 使用 SWR

#### templates/index-header.template

```typescript
import useSWR from 'swr';
import request from '@/utils/request';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 */
export const {{functionName}} = ({{params}}) => {
  return request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });
};

/**
 * {{summary}} - SWR Hook
 */
export const use{{functionName}} = ({{params}}) => {
  return useSWR(
    ['{{functionName}}', {{params}}],
    () => {{functionName}}({{params}})
  );
};

```

### 场景 6: 使用 TypeScript 严格模式

#### templates/index-header.template

```typescript
import type { AxiosPromise } from 'axios';
import request from '@/utils/request';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 * @param {{paramName}}
 {{#hasReturns}}* @returns {AxiosPromise<{{returnType}}>}{{/hasReturns}}
 */
export function {{functionName}}({{params}}): AxiosPromise<{{returnType}}> {
  return request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });
}

```

### 场景 7: 添加请求日志

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 * @param {{paramName}}
 */
export const {{functionName}} = ({{params}}) => {
  console.log('[API] {{functionName}}', { url: {{url}}, method: '{{method}}' });

  return request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  }).then(response => {
    console.log('[API] {{functionName}} success', response);
    return response;
  }).catch(error => {
    console.error('[API] {{functionName}} error', error);
    throw error;
  });
};

```

### 场景 8: 使用更简洁的导入（只导入类型）

#### templates/index-header.template

```typescript
import request from '@/utils/request';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

#### templates/api-function.template

```typescript
/**
 * {{summary}}
 */
export const {{functionName}} = ({{params}}) =>
  request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}{{#hasParams}},
    params: {{paramsParam}}{{/hasParams}}
  });

```

## 📝 模板变量说明

### api-function.template 可用变量

| 变量               | 类型    | 说明              | 示例                |
| ------------------ | ------- | ----------------- | ------------------- |
| `{{summary}}`      | string  | API 描述          | "查询用户列表"      |
| `{{functionName}}` | string  | 函数名            | "listUsers"         |
| `{{params}}`       | string  | 函数参数          | "query?: UserQuery" |
| `{{paramName}}`    | string  | 参数注释          | "\* @param query"   |
| `{{returnType}}`   | string  | 返回类型          | "UserVO[]"          |
| `{{url}}`          | string  | 请求 URL          | "'/api/users'"      |
| `{{method}}`       | string  | HTTP 方法         | "get"               |
| `{{hasReturns}}`   | boolean | 是否有返回值      | true/false          |
| `{{hasData}}`      | boolean | 是否有 body 数据  | true/false          |
| `{{dataParam}}`    | string  | body 参数名       | "data"              |
| `{{hasParams}}`    | boolean | 是否有 query 参数 | true/false          |
| `{{paramsParam}}`  | string  | query 参数名      | "query"             |

### index-header.template 可用变量

| 变量                 | 类型    | 说明           | 示例                |
| -------------------- | ------- | -------------- | ------------------- |
| `{{typeImports}}`    | string  | 类型导入列表   | "UserVO, UserQuery" |
| `{{typeImportPath}}` | string  | 类型文件路径   | "./types"           |
| `{{hasTypeImports}}` | boolean | 是否有类型导入 | true/false          |

## 🔧 模板语法

### 变量插值

```
{{variableName}}
```

### 条件渲染

```
{{#condition}}
  这里的内容只在 condition 为 true 时显示
{{/condition}}
```

### 示例

```typescript
{{#hasData}}
data: {{dataParam}},
{{/hasData}}
```

如果 `hasData` 为 `true`，生成：

```typescript
data: data,
```

如果 `hasData` 为 `false`，生成：

```typescript

```

## 💡 最佳实践

1. **保持模板简洁** - 不要在模板中添加过多的业务逻辑
2. **使用类型注解** - 充分利用 TypeScript 的类型系统
3. **考虑团队规范** - 模板应该符合团队的代码规范
4. **版本控制** - 将模板文件加入版本控制，保持团队一致
5. **测试生成结果** - 修改模板后，及时测试生成的代码是否正确

## 🚀 快速切换模板

如果你需要在不同的项目中使用不同的模板风格，可以：

1. **方案 1**: 将模板放在项目根目录的 `templates/` 中
2. **方案 2**: 创建多个模板预设，根据项目需要复制使用
3. **方案 3**: 使用不同的配置文件管理不同的模板路径

## 📚 相关文档

- [README.md](./README.md) - 完整功能说明
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [配置示例](./generate-front-api.config.example.js) - 完整配置参考
