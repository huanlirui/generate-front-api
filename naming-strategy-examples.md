# API 代码生成器 - 命名策略说明

## 三种文件夹命名方式

### 方式1: 直接使用 Tag (namingStrategy: 'tag')

直接使用 OpenAPI 规范中的 tag 作为文件夹名称。

**配置示例:**

```javascript
const config = {
  naming: {
    namingStrategy: 'tag'
  }
};
```

**生成结果:**

- 如果 API 的 tag 是 `"部门管理"`, 生成路径: `src/api/部门管理/`
- 如果 API 的 tag 是 `"User Management"`, 生成路径: `src/api/User Management/`

**优点:**

- 与 OpenAPI 文档的 tag 完全一致，方便对应查看
- 配置简单，无需额外设置

**缺点:**

- 可能包含中文或特殊字符
- 可能不符合项目命名规范

---

### 方式2: Tag 映射 (namingStrategy: 'tagMapping')

使用自定义映射表，将 OpenAPI 的 tag 映射到你想要的文件夹路径。

**配置示例:**

```javascript
const config = {
  naming: {
    namingStrategy: 'tagMapping',
    tagMapping: {
      '部门管理': 'deptManage/orgDept',
      '人力资源-基础管理': 'hr/basicManage',
      '人力资源-员工管理': 'hr/staffManage',
      'User Management': 'user/manage',
      'default': 'common' // 未配置映射的 tag 会使用此默认值
    }
  }
};
```

**生成结果:**

- API tag 是 `"部门管理"` → 生成路径: `src/api/deptManage/orgDept/`
- API tag 是 `"人力资源-基础管理"` → 生成路径: `src/api/hr/basicManage/`
- API tag 是 `"其他模块"` (未配置) → 生成路径: `src/api/common/`

**优点:**

- 完全自定义文件夹结构
- 可以将相关模块组织到同一目录下
- 符合项目命名规范
- 与文档 tag 有明确对应关系

**推荐场景:**

- 当你需要精确控制文件夹结构时
- 当你需要将多个 tag 合并到同一目录时
- 当你的团队有严格的目录命名规范时

---

### 方式3: URL 路径 (namingStrategy: 'path')

根据 API 的 URL 路径自动生成文件夹结构。

**配置示例:**

```javascript
const config = {
  naming: {
    namingStrategy: 'path',
    pathDepth: 3 // 提取 URL 路径的前几层
  }
};
```

**生成规则:**

假设有以下 API:

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

**优点:**

- 完全自动化，无需手动配置映射
- 文件夹结构与 URL 路径一致
- 适合 RESTful API

**缺点:**

- 与文档 tag 可能不一致
- 无法自定义文件夹名称

---

## 使用建议

### 选择哪种方式?

1. **如果你希望完全按照 OpenAPI 文档的 tag 来组织代码:**

   - 使用方式1 (`namingStrategy: 'tag'`)

2. **如果你需要自定义文件夹结构，但又想与文档 tag 保持对应关系:**

   - 使用方式2 (`namingStrategy: 'tagMapping'`)
   - 推荐! 这是最灵活的方式

3. **如果你的 API 遵循 RESTful 规范，且 URL 路径已经很规范:**
   - 使用方式3 (`namingStrategy: 'path'`)

### 实际项目配置示例

```javascript
// script/generate-v2.js 中修改 defaultConfig

const defaultConfig = {
  openApiFile: 'openApi.json',
  openApiUrl: 'http://127.0.0.1:4523/export/openapi/23?version=3.0',
  output: {
    baseDir: '../src/api'
  },
  naming: {
    // 方式1: 直接使用 tag
    // namingStrategy: 'tag',

    // 方式2: tag 映射 (推荐)
    namingStrategy: 'tagMapping',
    tagMapping: {
      '部门管理': 'deptManage/orgDept',
      '人力资源-基础管理': 'hr/basicManage',
      '人力资源-员工管理': 'hr/staffManage',
      'default': 'common'
    },

    // 方式3: URL 路径
    // namingStrategy: 'path',
    // pathDepth: 3,

    voSuffix: 'VO',
    formSuffix: 'Form',
    querySuffix: 'Query'
  }
  // ... 其他配置
};
```

### 如何快速配置 tagMapping?

1. 先运行一次代码生成，使用 `namingStrategy: 'tag'`
2. 查看生成的文件夹名称（就是原始的 tag）
3. 根据需要配置映射关系
4. 修改为 `namingStrategy: 'tagMapping'` 并添加映射配置
5. 重新运行代码生成

### 命令行使用

```bash
# 使用默认配置
npm run api:gen

# 使用自定义 URL
npm run api:gen -- --url=http://your-api.com/openapi.json
```

---

## 常见问题

**Q: 我能混合使用多种策略吗?**
A: 不能，每次生成只能使用一种策略。但你可以修改配置后重新生成。

**Q: 如果某个 tag 没有配置映射怎么办?**
A: 在 `tagMapping` 中配置 `'default'` 作为默认映射，或者会使用原始 tag 名。

**Q: 可以在运行时切换策略吗?**
A: 可以通过修改配置文件或传入自定义配置对象来切换。

**Q: 生成的文件夹名称包含特殊字符怎么办?**
A: 使用方式2 (tagMapping) 或方式3 (path)，可以避免特殊字符问题。
