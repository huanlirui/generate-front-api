# generate-front-api

English | [简体中文](./README.zh-CN.md)

A tool to automatically generate TypeScript API request code and type definitions based on OpenAPI specifications.

## ✨ Features

- ✅ Automatically generate TypeScript type definitions from OpenAPI JSON
- ✅ Automatically generate API request functions
- ✅ **Smart Type Inference** - Automatically extract accurate types from responses, avoiding `any`
- ✅ **Configurable** - Support custom configuration files
- ✅ **Unified Template System** - Use unified template files for easy customization
- ✅ Smart type mapping, only import used types
- ✅ Automatic code formatting (Prettier)
- ✅ **Response Wrapper Type Parsing** - Automatically parse wrapper types like `RVoid`, `RList*`, `R*`
- ✅ **Multi-Module Generation** - Automatically group by OpenAPI tags, generate separate module folders
- ✅ **Unique Function Names** - Generate unique function names based on URL path and HTTP method
- ✅ **Remote Fetching Support** - Fetch OpenAPI JSON directly from URLs

## 📦 Installation

```bash
npm install generate-front-api --save-dev
```

## 🚀 Quick Start

### 1. Initialize Configuration

Create a configuration file `generate-front-api.config.js` in your project root:

```javascript
export default {
  // OpenAPI data source - choose one method
  openApiFile: 'openApi.json',  // Method 1: Local file
  // openApiUrl: 'https://api.example.com/v3/api-docs',  // Method 2: Remote URL

  // Output configuration
  output: {
    baseDir: 'src/api'  // Directory for generated code
  },

  // Naming strategy: 'path' | 'tag' | 'tagMapping'
  naming: {
    namingStrategy: 'path',  // Recommended: use path strategy
    pathDepth: 2  // URL path depth
  }
};
```

### 2. Prepare OpenAPI Data Source

**Method 1: Use Local File**

Place the OpenAPI JSON file in your project root, named `openApi.json`

**Method 2: Fetch from URL**

Set `openApiUrl` in the configuration file, or specify via command line:

```bash
npx generate-front-api --url=https://api.example.com/v3/api-docs
```

### 3. Add npm Script

Add to `package.json`:

```json
{
  "scripts": {
    "generate:api": "generate-front-api"
  }
}
```

### 4. Run Generator

```bash
npm run generate:api
```

The generated files will be output to the configured `baseDir` directory.

## 📁 Generated Output Example

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

### types.ts Example

```typescript
export interface OrgDeptVO {
  /**
   * Primary key
   */
  id?: string | number;

  /**
   * Department code
   */
  deptCode?: string;
}

export interface OrgDeptQuery {
  /** Department code */
  deptCode?: string;
}
```

### index.ts Example

```typescript
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrgDeptVO, OrgDeptQuery } from './types';

/**
 * Query list
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

## ⚙️ Configuration

### Complete Configuration Example

```javascript
export default {
  // OpenAPI data source configuration
  openApiFile: 'openApi.json',  // Local file path
  openApiUrl: null,  // Remote URL (higher priority than openApiFile)

  // Output configuration
  output: {
    baseDir: 'src/api'  // Base directory for generated code
  },

  // Naming configuration
  naming: {
    voSuffix: 'VO',        // View object suffix
    formSuffix: 'Form',    // Form object suffix
    querySuffix: 'Query',  // Query object suffix

    // Naming strategy
    // - 'path': Use URL path as directory name (recommended)
    // - 'tag': Use OpenAPI tag as directory name
    // - 'tagMapping': Use custom mapping table
    namingStrategy: 'path',

    // Path depth (effective when namingStrategy='path')
    pathDepth: 2,

    // Tag mapping table (effective when namingStrategy='tagMapping')
    tagMapping: {
      'Human Resources-Basic Management': 'hr/basicManage',
      'Department Management': 'deptManage/orgDept',
      'default': 'common'
    }
  },

  // Type configuration
  types: {
    // Basic type mapping
    typeMapping: {
      integer: 'number',
      string: 'string',
      boolean: 'boolean',
      array: 'any[]',
      object: 'any',
      Long: 'string | number',
      long: 'string | number'
    },

    // Convert int64 to string | number
    int64AsUnion: true,

    // Excluded fields
    excludeFields: []
  },

  // Formatting configuration
  formatting: {
    runPrettier: true  // Run Prettier formatting
  },

  // Lifecycle hooks
  hooks: {
    beforeGenerate: (openApiData) => {
      console.log(`Starting API generation: ${openApiData.info?.title}`);
    },
    afterGenerate: (result) => {
      console.log(`Generation complete, ${result.moduleCount} modules created`);
    }
  }
};
```

### Naming Strategy Explanation

#### 1. path Strategy (Recommended)

Use URL path directly as directory name, automated with English directories:

```javascript
naming: {
  namingStrategy: 'path',
  pathDepth: 2  // URL depth
}
```

Examples:

- `/hr/basicManage/medicalOrg` → `src/api/hr/basicManage/`
- `/staffManage/orgStaff` → `src/api/staffManage/orgStaff/`

#### 2. tag Strategy

Use OpenAPI `tags` field as directory name:

```javascript
naming: {
  namingStrategy: 'tag'
}
```

Examples:

- `tags: ["Medical Organization"]` → `src/api/Medical Organization/`

#### 3. tagMapping Strategy

Use custom mapping table:

```javascript
naming: {
  namingStrategy: 'tagMapping',
  tagMapping: {
    'Human Resources-Basic Management': 'hr/basicManage',
    'default': 'common'
  }
}
```

## 🎨 Custom Templates

The generator supports two customizable template files. You can create a `templates/` directory in your project root and place custom templates.

### API Function Template

Create `templates/api-function.template` in your project root to customize the generated API function format:

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

### Available Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{summary}}` | API description | "Query list" |
| `{{functionName}}` | Function name | "listOrgDept" |
| `{{params}}` | Function parameters | "query?: OrgDeptQuery" |
| `{{returnType}}` | Return type | "OrgDeptVO[]" |
| `{{url}}` | Request URL | "'/api/list'" |
| `{{method}}` | HTTP method | "get", "post" |
| `{{hasData}}` | Has data parameter | true/false |
| `{{hasParams}}` | Has params parameter | true/false |

### File Header Template

Create `templates/index-header.template` in your project root to customize import statements in generated files:

**Default Template Content**:

```typescript
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
{{#hasTypeImports}}import { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

**Available Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{typeImports}}` | Type import list | "UserVO, UserQuery" |
| `{{typeImportPath}}` | Type file path | "./types" |
| `{{hasTypeImports}}` | Has type imports | true/false |

**Custom Example** - Using custom HTTP client:

```typescript
import http from '@/utils/http';
import type { ResponsePromise } from '@/types';
{{#hasTypeImports}}import type { {{typeImports}} } from '{{typeImportPath}}';
{{/hasTypeImports}}

```

## 🔧 Function Naming Rules

The generator automatically generates function names based on URL path and HTTP method:

| URL Example | HTTP Method | Generated Function Name |
|------------|-------------|------------------------|
| `/hr/medicalOrg/list` | GET | `listMedicalOrgList` |
| `/hr/medicalOrg/{id}` | GET | `getMedicalOrg` |
| `/deptManage/orgDept` | POST | `addDeptManageOrgDept` |
| `/deptManage/orgDept` | PUT | `updateDeptManageOrgDept` |
| `/deptManage/orgDept/{id}` | DELETE | `delDeptManageOrgDept` |

Naming Rules:

- GET + `/list` → `list{Entity}List`
- GET + `/{param}` → `get{Entity}`
- GET (others) → `query{Entity}`
- POST → `add{Entity}`
- PUT → `update{Entity}`
- DELETE → `del{Entity}`

## 📝 Use Cases

### Case 1: Local Development

```bash
# 1. Create configuration file
echo "export default { openApiFile: 'openApi.json', output: { baseDir: 'src/api' } };" > generate-front-api.config.js

# 2. Run generation
npm run generate:api
```

### Case 2: Fetch from Remote

```bash
# Via command line parameter
npx generate-front-api --url=https://api.example.com/v3/api-docs

# Or set in configuration file
# openApiUrl: 'https://api.example.com/v3/api-docs'
```

### Case 3: Integrate into CI/CD

```json
{
  "scripts": {
    "generate:api": "generate-front-api",
    "prebuild": "npm run generate:api"
  }
}
```

## 🤔 FAQ

### Q: How to modify the generated directory structure?

A: Modify `naming.namingStrategy` and `naming.pathDepth` in the configuration file.

### Q: How to customize type mapping?

A: Add custom mappings in `types.typeMapping` in the configuration file.

### Q: How to disable Prettier formatting?

A: Set `formatting.runPrettier: false`.

### Q: There are unwanted fields in the generated code?

A: Add field names to the `types.excludeFields` array.

## 📄 License

MIT

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🔗 Related Links

- [GitHub](https://github.com/huanlirui/generate-front-api)
- [Issues](https://github.com/huanlirui/generate-front-api/issues)
