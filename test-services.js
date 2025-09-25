// 测试服务文件语法是否正确

console.log('开始验证服务文件语法...');

try {
  console.log('验证 auth.js...');
  const authService = require('./wechat-miniapp/services/auth');
  console.log('✓ auth.js 语法正确');
} catch (error) {
  console.error('✗ auth.js 语法错误:', error.message);
}

try {
  console.log('验证 api.js...');
  const apiService = require('./wechat-miniapp/services/api');
  console.log('✓ api.js 语法正确');
} catch (error) {
  console.error('✗ api.js 语法错误:', error.message);
}

try {
  console.log('验证 util.js...');
  const utilService = require('./wechat-miniapp/services/util');
  console.log('✓ util.js 语法正确');
} catch (error) {
  console.error('✗ util.js 语法错误:', error.message);
}

try {
  console.log('验证 credential.js...');
  const credentialService = require('./wechat-miniapp/services/credential');
  console.log('✓ credential.js 语法正确');
} catch (error) {
  console.error('✗ credential.js 语法错误:', error.message);
}

try {
  console.log('验证 settings.js...');
  const settingsService = require('./wechat-miniapp/services/settings');
  console.log('✓ settings.js 语法正确');
} catch (error) {
  console.error('✗ settings.js 语法错误:', error.message);
}

try {
  console.log('验证 index.js...');
  const services = require('./wechat-miniapp/services/index');
  console.log('✓ index.js 语法正确');
  console.log('服务版本:', services.getVersion());
  console.log('服务可用性:', services.isAvailable() ? '可用' : '不可用');
} catch (error) {
  console.error('✗ index.js 语法错误:', error.message);
}

console.log('\n语法验证完成！');