# 更新日志

[English](./CHANGELOG.md) | 简体中文

## [1.0.2] - 2025-01-XX

### 🔧 问题修复

- 修复最新提交中的问题并进行了改进

---

## [1.0.1] - 2025-10-16

### ✨ 新增功能

- 📖 **双语文档支持** - 添加完整的英文文档
  - 所有主要文档现在都支持中英文双语
  - 在每个文档顶部添加语言切换链接
  - 中文文档：`*.zh-CN.md`
  - 英文文档：`*.md` (默认)

#### 文档列表

- `README.md` / `README.zh-CN.md` - 主文档
- `QUICKSTART.md` / `QUICKSTART.zh-CN.md` - 快速开始指南
- `TEMPLATE_EXAMPLES.md` / `TEMPLATE_EXAMPLES.zh-CN.md` - 模板自定义示例
- `naming-strategy-examples.md` / `naming-strategy-examples.zh-CN.md` - 命名策略说明

---

## [1.0.0] - 2025-10-16

### 🎉 首次发布

#### ✨ 新增功能

- 基于 OpenAPI 3.0 规范自动生成 TypeScript API 代码
- 支持从本地文件或远程 URL 获取 OpenAPI JSON
- 智能类型推断，自动解析响应包装类型（R*, RList*, RVoid）
- 多种命名策略：path、tag、tagMapping
- 可自定义配置文件（generate-front-api.config.js）
- 可自定义代码模板（templates/api-function.template）
- 自动代码格式化（Prettier 集成）
- 生命周期钩子支持（beforeGenerate, afterGenerate）
- 命令行工具支持（`npx generate-front-api`）

#### 📦 包含文件

- `bin/cli.js` - 命令行入口
- `lib/generator.js` - 核心生成器
- `templates/` - 默认模板文件
- `generate-front-api.config.example.js` - 配置示例
- `README.md` - 使用文档
- `USAGE.md` - 详细使用指南

#### 🔧 配置选项

- OpenAPI 数据源配置（本地/远程）
- 输出目录配置
- 命名策略配置
- 类型映射配置
- 格式化配置
- 钩子函数配置

#### 📝 文档

- 完整的 README 文档
- 详细的使用指南（USAGE.md）
- 配置示例文件
- 模板自定义说明

---

## 版本说明

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

版本格式：主版本号.次版本号.修订号

- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正
