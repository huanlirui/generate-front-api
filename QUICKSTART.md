# ⚡ 快速开始

## 🎯 一分钟上手

### 1️⃣ 安装

```bash
npm install generate-front-api --save-dev
```

### 2️⃣ 创建配置

在项目根目录创建 `generate-front-api.config.js`：

```javascript
export default {
  // 选项1: 使用远程 URL
  openApiUrl: 'http://your-api.com/v3/api-docs',
  
  // 选项2: 使用本地文件
  // openApiFile: 'openApi.json',

  // 输出目录
  output: {
    baseDir: 'src/api'
  }
};
```

### 3️⃣ 添加脚本

在 `package.json` 添加：

```json
{
  "scripts": {
    "api:gen": "generate-front-api"
  }
}
```

### 4️⃣ 运行生成

```bash
npm run api:gen
```

🎉 完成！生成的代码在 `src/api` 目录中。

---

## 📖 更多配置

### 使用 URL 路径策略（推荐）

```javascript
export default {
  openApiUrl: 'http://your-api.com/v3/api-docs',
  output: { baseDir: 'src/api' },
  naming: {
    namingStrategy: 'path',  // 基于 URL 路径
    pathDepth: 2             // 路径深度
  }
};
```

**效果：**

- `/hr/basicManage/medicalOrg` → `src/api/hr/basicManage/`
- `/staffManage/orgStaff` → `src/api/staffManage/orgStaff/`

### 使用 Tag 策略

```javascript
export default {
  openApiUrl: 'http://your-api.com/v3/api-docs',
  output: { baseDir: 'src/api' },
  naming: {
    namingStrategy: 'tag'  // 使用 OpenAPI tag
  }
};
```

### 自定义类型映射

```javascript
export default {
  openApiUrl: 'http://your-api.com/v3/api-docs',
  output: { baseDir: 'src/api' },
  types: {
    typeMapping: {
      Long: 'string | number',
      TreeLong: 'TreeNode[]'
    }
  }
};
```

---

## 🎨 自定义模板

### API 函数模板

在项目根目录创建 `templates/api-function.template`：

```typescript
/**
 * {{summary}}
 */
export const {{functionName}} = ({{params}}) => {
  return http.request<{{returnType}}>({
    url: {{url}},
    method: '{{method}}'{{#hasData}},
    data: {{dataParam}}{{/hasData}}
  });
};
```

### 文件头部模板

在项目根目录创建 `templates/index-header.template`：

```typescript
import http from '@/utils/http';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

---

## 💡 常用命令

```bash
# 从远程 URL 生成
npx generate-front-api --url=http://api.example.com/v3/api-docs

# 查看将要发布的文件
npm pack --dry-run

# 本地链接测试
npm link
```

---

## 📚 完整文档

- [README.md](./README.md) - 完整功能说明
- [USAGE.md](./USAGE.md) - 详细使用指南
- [配置示例](./generate-front-api.config.example.js) - 完整配置参考

---

## ❓ 遇到问题？

查看 [常见问题](./README.md#-常见问题) 或提交 [Issue](https://github.com/huanlirui/generate-front-api/issues)
