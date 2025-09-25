// 服务层入口文件 - 统一导出所有服务模块

// 使用CommonJS语法导入服务
const authService = require('./auth');
const apiService = require('./api');
const utilService = require('./util');
const credentialService = require('./credential');
const settingsService = require('./settings');

/**
 * 初始化所有服务
 * @returns {Promise<void>}
 */
function init() {
  return new Promise((resolve, reject) => {
    try {
      // 初始化配置服务（异步）
      settingsService.init()
        .then(() => {
          console.log('TrueMark服务初始化完成');
          resolve();
        })
        .catch(error => {
          console.error('配置服务初始化失败:', error);
          // 配置初始化失败不阻止其他服务运行
          resolve();
        });
    } catch (error) {
      console.error('服务初始化失败:', error);
      reject(error);
    }
  });
}

/**
 * 获取服务版本信息
 * @returns {Object} 版本信息
 */
function getVersion() {
  return {
    version: '1.0.0',
    build: '20240101',
    name: 'TrueMark Verifier Services'
  };
}

/**
 * 检查服务可用性
 * @returns {boolean} 是否可用
 */
function isAvailable() {
  return authService && apiService && utilService && credentialService && settingsService;
}

/**
 * 获取所有服务状态
 * @returns {Object} 服务状态
 */
function getServicesStatus() {
  return {
    auth: !!authService,
    api: !!apiService,
    util: !!utilService,
    credential: !!credentialService,
    settings: !!settingsService
  };
}

/**
 * 清理所有服务资源
 */
function cleanup() {
  try {
    // 清除临时缓存
    wx.removeStorageSync('temp_verification_data');
    console.log('服务资源清理完成');
  } catch (error) {
    console.error('服务资源清理失败:', error);
  }
}

/**
 * 刷新所有服务配置
 * @returns {Promise<void>}
 */
function refresh() {
  return new Promise((resolve, reject) => {
    settingsService.init()
      .then(() => {
        console.log('服务配置刷新完成');
        resolve();
      })
      .catch(error => {
        console.error('服务配置刷新失败:', error);
        reject(error);
      });
  });
}

// 导出所有服务和方法
module.exports = {
  // 服务实例
  auth: authService,
  api: apiService,
  util: utilService,
  credential: credentialService,
  settings: settingsService,
  
  // 核心方法
  init,
  getVersion,
  isAvailable,
  getServicesStatus,
  cleanup,
  refresh,
  
  // 便捷访问 - 常用认证方法
  login: authService.wxLogin,
  logout: authService.logout,
  checkLogin: authService.checkLoginStatus,
  
  // 便捷访问 - 常用API方法
  verifyCredential: apiService.verifyCredential,
  getVerificationHistory: apiService.getVerificationHistory,
  
  // 便捷访问 - 常用工具方法
  showToast: utilService.showToast,
  showError: utilService.showErrorToast,
  formatDate: utilService.formatDate,
  
  // 便捷访问 - 常用凭证方法
  validateCredential: credentialService.validateCredentialByCode,
  parseCredential: credentialService.parseCredentialInfo,
  
  // 便捷访问 - 常用设置方法
  getSetting: settingsService.getSetting,
  setSetting: settingsService.setSetting,
  checkFeature: settingsService.checkFeature
};