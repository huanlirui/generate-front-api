/**
 * generate-front-api 配置文件示例
 *
 * 将此文件复制为 generate-front-api.config.js 并根据需要修改配置
 */

export default {
  // OpenAPI 数据源配置
  // 选项1: 使用本地文件
  openApiFile: "openApi.json",

  // 选项2: 使用远程 URL (优先级高于 openApiFile)
  // openApiUrl: 'http://127.0.0.1:4523/export/openapi/23?version=3.0',

  // 输出配置
  output: {
    // 生成代码的基础目录（相对于项目根目录）
    baseDir: "src/api"
  },

  // 命名配置
  naming: {
    // 类型后缀
    voSuffix: "VO", // 视图对象后缀
    formSuffix: "Form", // 表单对象后缀
    querySuffix: "Query", // 查询对象后缀

    /**
     * 命名策略
     * - 'tag': 使用 OpenAPI 的 tag 作为目录名（可能是中文）
     * - 'tagMapping': 使用 tag 映射表，手动映射 tag 到目录名
     * - 'path': 使用 URL 路径作为目录名（推荐，自动化）
     */
    namingStrategy: "path",

    /**
     * 路径深度（当 namingStrategy='path' 时生效）
     * 例如: /hr/basicManage/medicalOrg
     * - pathDepth=2 -> hr/basicManage
     * - pathDepth=3 -> hr/basicManage/medicalOrg
     */
    pathDepth: 2,

    /**
     * Tag 映射表（当 namingStrategy='tagMapping' 时生效）
     * 将 OpenAPI tag 映射到自定义目录路径
     */
    tagMapping: {
      // '人力资源-基础管理': 'hr/basicManage',
      // '部门管理': 'deptManage/orgDept',
      // 'default': 'common'
    }
  },

  // 类型配置
  types: {
    // 基础类型映射
    typeMapping: {
      integer: "number",
      string: "string",
      boolean: "boolean",
      array: "any[]",
      object: "any",
      Long: "string | number",
      long: "string | number"
    },

    // 是否将 int64 类型转换为 string | number 联合类型
    int64AsUnion: true,

    // 排除的字段（这些字段不会出现在生成的类型中）
    excludeFields: []
  },

  // 格式化配置
  formatting: {
    // 是否在生成后运行 Prettier 格式化
    runPrettier: true
  },

  // 生命周期钩子
  hooks: {
    // 生成前钩子
    beforeGenerate: openApiData => {
      console.log(`📦 API 标题: ${openApiData.info?.title || "未知"}`);
      console.log(`📦 API 版本: ${openApiData.info?.version || "未知"}`);
    },

    // 生成后钩子
    afterGenerate: result => {
      console.log(`\n✅ 共生成 ${result.moduleCount} 个模块`);
      console.log(`✅ 生成文件数: ${result.generatedFiles.length}`);
    }
  }
};
