# Changelog

English | [简体中文](./CHANGELOG.zh-CN.md)

## [1.0.2] - 2025-01-XX

### 🔧 Bug Fixes

- Fixed issues and improvements from the latest commit

---

## [1.0.1] - 2025-10-16

### ✨ New Features

- 📖 **Bilingual Documentation Support** - Added complete English documentation
  - All major documents now support both Chinese and English
  - Added language switch links at the top of each document
  - Chinese documentation: `*.zh-CN.md`
  - English documentation: `*.md` (default)

#### Documentation List

- `README.md` / `README.zh-CN.md` - Main documentation
- `QUICKSTART.md` / `QUICKSTART.zh-CN.md` - Quick start guide
- `TEMPLATE_EXAMPLES.md` / `TEMPLATE_EXAMPLES.zh-CN.md` - Template customization examples
- `naming-strategy-examples.md` / `naming-strategy-examples.zh-CN.md` - Naming strategy guide

---

## [1.0.0] - 2025-10-16

### 🎉 Initial Release

#### ✨ New Features

- Automatically generate TypeScript API code based on OpenAPI 3.0 specification
- Support fetching OpenAPI JSON from local files or remote URLs
- Smart type inference, automatically parse response wrapper types (R*, RList*, RVoid)
- Multiple naming strategies: path, tag, tagMapping
- Customizable configuration file (generate-front-api.config.js)
- Customizable code templates (templates/api-function.template)
- Automatic code formatting (Prettier integration)
- Lifecycle hooks support (beforeGenerate, afterGenerate)
- Command-line tool support (`npx generate-front-api`)

#### 📦 Included Files

- `bin/cli.js` - Command-line entry point
- `lib/generator.js` - Core generator
- `templates/` - Default template files
- `generate-front-api.config.example.js` - Configuration example
- `README.md` - Documentation
- `USAGE.md` - Detailed usage guide

#### 🔧 Configuration Options

- OpenAPI data source configuration (local/remote)
- Output directory configuration
- Naming strategy configuration
- Type mapping configuration
- Formatting configuration
- Hook function configuration

#### 📝 Documentation

- Complete README documentation
- Detailed usage guide (USAGE.md)
- Configuration example file
- Template customization instructions

---

## Version Specification

This project follows [Semantic Versioning](https://semver.org/) specification.

Version format: MAJOR.MINOR.PATCH

- MAJOR: Incompatible API changes
- MINOR: Backward-compatible feature additions
- PATCH: Backward-compatible bug fixes
