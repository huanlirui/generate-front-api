# API Code Generator - Naming Strategy Guide

English | [简体中文](./naming-strategy-examples.zh-CN.md)

## Three Folder Naming Methods

### Method 1: Direct Tag Usage (namingStrategy: 'tag')

Directly use the tag from the OpenAPI specification as the folder name.

**Configuration Example:**

```javascript
const config = {
  naming: {
    namingStrategy: 'tag'
  }
};
```

**Generated Result:**

- If the API tag is `"Department Management"`, generates path: `src/api/Department Management/`
- If the API tag is `"User Management"`, generates path: `src/api/User Management/`

**Advantages:**

- Completely consistent with OpenAPI document tags, easy to reference
- Simple configuration, no additional setup needed

**Disadvantages:**

- May contain Chinese or special characters
- May not comply with project naming conventions

---

### Method 2: Tag Mapping (namingStrategy: 'tagMapping')

Use a custom mapping table to map OpenAPI tags to your desired folder paths.

**Configuration Example:**

```javascript
const config = {
  naming: {
    namingStrategy: 'tagMapping',
    tagMapping: {
      'Department Management': 'deptManage/orgDept',
      'Human Resources-Basic Management': 'hr/basicManage',
      'Human Resources-Staff Management': 'hr/staffManage',
      'User Management': 'user/manage',
      'default': 'common' // Tags without mapping will use this default value
    }
  }
};
```

**Generated Result:**

- API tag is `"Department Management"` → generates path: `src/api/deptManage/orgDept/`
- API tag is `"Human Resources-Basic Management"` → generates path: `src/api/hr/basicManage/`
- API tag is `"Other Module"` (not configured) → generates path: `src/api/common/`

**Advantages:**

- Complete control over folder structure
- Can organize related modules into the same directory
- Complies with project naming conventions
- Clear correspondence with document tags

**Recommended Scenarios:**

- When you need precise control over folder structure
- When you need to merge multiple tags into the same directory
- When your team has strict directory naming conventions

---

### Method 3: URL Path (namingStrategy: 'path')

Automatically generate folder structure based on API URL paths.

**Configuration Example:**

```javascript
const config = {
  naming: {
    namingStrategy: 'path',
    pathDepth: 3 // Extract the first N levels of URL path
  }
};
```

**Generation Rules:**

Assume the following APIs:

- `/hr/basicManage/medicalOrg/list`
- `/hr/basicManage/medicalOrg/{id}`
- `/hr/staffManage/employee/list`
- `/dept/org/tree`

**pathDepth = 2:**

- `/hr/basicManage/...` → `src/api/hr/basicManage/`
- `/hr/staffManage/...` → `src/api/hr/staffManage/`
- `/dept/org/...` → `src/api/dept/org/`

**pathDepth = 3:**

- `/hr/basicManage/medicalOrg/...` → `src/api/hr/basicManage/medicalOrg/`
- `/hr/staffManage/employee/...` → `src/api/hr/staffManage/employee/`
- `/dept/org/tree` → `src/api/dept/org/tree/`

**Advantages:**

- Fully automated, no manual mapping configuration needed
- Folder structure matches URL paths
- Suitable for RESTful APIs

**Disadvantages:**

- May not match document tags
- Cannot customize folder names

---

## Usage Recommendations

### Which Method to Choose?

1. **If you want to organize code entirely based on OpenAPI document tags:**

   - Use Method 1 (`namingStrategy: 'tag'`)

2. **If you need to customize folder structure but maintain correspondence with document tags:**

   - Use Method 2 (`namingStrategy: 'tagMapping'`)
   - Recommended! This is the most flexible method

3. **If your API follows RESTful conventions and URL paths are already well-structured:**
   - Use Method 3 (`namingStrategy: 'path'`)

### Real Project Configuration Example

```javascript
// Modify defaultConfig in script/generate-v2.js

const defaultConfig = {
  openApiFile: 'openApi.json',
  openApiUrl: 'http://127.0.0.1:4523/export/openapi/23?version=3.0',
  output: {
    baseDir: '../src/api'
  },
  naming: {
    // Method 1: Direct tag usage
    // namingStrategy: 'tag',

    // Method 2: Tag mapping (Recommended)
    namingStrategy: 'tagMapping',
    tagMapping: {
      'Department Management': 'deptManage/orgDept',
      'Human Resources-Basic Management': 'hr/basicManage',
      'Human Resources-Staff Management': 'hr/staffManage',
      'default': 'common'
    },

    // Method 3: URL path
    // namingStrategy: 'path',
    // pathDepth: 3,

    voSuffix: 'VO',
    formSuffix: 'Form',
    querySuffix: 'Query'
  }
  // ... other configuration
};
```

### How to Quickly Configure tagMapping?

1. First run code generation once using `namingStrategy: 'tag'`
2. Check the generated folder names (these are the original tags)
3. Configure mapping relationships as needed
4. Change to `namingStrategy: 'tagMapping'` and add mapping configuration
5. Run code generation again

### Command Line Usage

```bash
# Use default configuration
npm run api:gen

# Use custom URL
npm run api:gen -- --url=http://your-api.com/openapi.json
```

---

## FAQ

**Q: Can I mix multiple strategies?**
A: No, each generation can only use one strategy. However, you can change the configuration and regenerate.

**Q: What happens if a tag doesn't have a mapping?**
A: Configure `'default'` in `tagMapping` as the default mapping, or the original tag name will be used.

**Q: Can I switch strategies at runtime?**
A: Yes, by modifying the configuration file or passing a custom configuration object.

**Q: What if generated folder names contain special characters?**
A: Use Method 2 (tagMapping) or Method 3 (path) to avoid special character issues.
