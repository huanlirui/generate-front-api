#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiGenerator } from '../lib/generator.js';

// 获取当前工作目录
const cwd = process.cwd();

// 查找配置文件
function findConfig() {
  const configFiles = [
    'generate-front-api.config.js',
    'generate-front-api.config.mjs',
    '.generate-front-api.config.js',
    '.generate-front-api.config.mjs'
  ];

  for (const file of configFiles) {
    const configPath = path.join(cwd, file);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

async function main() {
  console.log('📋 开始生成 API 代码\n');

  // 查找用户配置文件
  const configPath = findConfig();
  let userConfig = {};

  if (configPath) {
    console.log(`📝 使用配置文件: ${path.relative(cwd, configPath)}\n`);
    try {
      const configModule = await import(configPath);
      userConfig = configModule.default || configModule;
    } catch (error) {
      console.error(`❌ 加载配置文件失败: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  未找到配置文件，使用默认配置\n');
    console.log('💡 提示: 可以在项目根目录创建 generate-front-api.config.js 来自定义配置\n');
  }

  // 检查用户是否有自定义模板
  const templatesDir = path.join(cwd, 'templates');
  const hasApiTemplate = fs.existsSync(path.join(templatesDir, 'api-function.template'));
  const hasHeaderTemplate = fs.existsSync(path.join(templatesDir, 'index-header.template'));

  if (hasApiTemplate || hasHeaderTemplate) {
    console.log('🎨 检测到自定义模板:');
    if (hasApiTemplate) console.log('   ✓ templates/api-function.template');
    if (hasHeaderTemplate) console.log('   ✓ templates/index-header.template');
    console.log('');
  }

  // 处理命令行参数
  const args = process.argv.slice(2);
  const urlArg = args.find((arg) => arg.startsWith('--url='));

  if (urlArg) {
    userConfig.openApiUrl = urlArg.replace('--url=', '');
  }

  // 创建生成器实例
  const generator = new ApiGenerator(userConfig);
  await generator.generate();
}

main().catch((error) => {
  console.error('❌ 生成失败:', error);
  process.exit(1);
});

