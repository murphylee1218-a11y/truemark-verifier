// API请求服务
const authService = require('./auth');
const utilService = require('./util');

// API基础URL
const BASE_URL = 'http://localhost:3000';

/**
 * 基础请求方法
 * @param {string} url - 请求URL
 * @param {object} options - 请求选项
 * @returns {Promise} 请求结果
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // 添加认证头
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers
      };
      
      wx.request({
        url: `${BASE_URL}${url}`,
        method: options.method || 'GET',
        data: options.data,
        header: headers,
        timeout: options.timeout || 10000,
        success: (response) => {
          // 处理响应
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(response);
          } else {
            reject({
              ...response,
              message: `请求失败: ${response.statusCode}`
            });
          }
        },
        fail: (error) => {
          console.error('API请求失败:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('API请求失败:', error);
      reject(error);
    }
  });
}

/**
 * 微信小程序登录
 * @param {object} data - 登录数据
 * @returns {Promise} 登录结果
 */
function wechatLogin(data) {
  return request('/api/wechat/login', {
    method: 'POST',
    data
  });
}

/**
 * 获取微信用户信息
 * @returns {Promise} 用户信息
 */
function getWechatUserInfo() {
  return request('/api/wechat/user', {
    method: 'GET'
  });
}

/**
 * 验证凭证
 * @param {object} data - 验证数据
 * @returns {Promise} 验证结果
 */
function verifyCredential(data) {
  return request('/api/wechat/verify-credential', {
    method: 'POST',
    data
  });
}

/**
 * 获取验证历史
 * @param {object} params - 查询参数
 * @returns {Promise} 历史记录
 */
function getVerificationHistory(params = {}) {
  // 构建查询字符串
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const url = `/api/wechat/verification-history${queryString ? `?${queryString}` : ''}`;
  
  return request(url, {
    method: 'GET'
  });
}

/**
 * 验证凭证（兼容GET请求）
 * @param {string} code - 验证码
 * @returns {Promise} 验证结果
 */
function verifyByCode(code) {
  return request(`/api/verify/${code}`, {
    method: 'GET'
  });
}

/**
 * 创建测试账户
 * @returns {Promise} 创建结果
 */
function createTestAccount() {
  return request('/api/create-test-account', {
    method: 'POST'
  });
}

/**
 * 检查测试账户是否存在
 * @returns {Promise} 检查结果
 */
function checkTestAccount() {
  return request('/api/check-test-account', {
    method: 'GET'
  });
}

/**
 * 企业注册
 * @param {object} data - 注册数据
 * @returns {Promise} 注册结果
 */
function registerCompany(data) {
  return request('/api/auth/register', {
    method: 'POST',
    data
  });
}

/**
 * 发行方登录
 * @param {object} data - 登录数据
 * @returns {Promise} 登录结果
 */
function loginIssuer(data) {
  return request('/api/auth/login', {
    method: 'POST',
    data
  });
}

/**
 * 验证JWT令牌
 * @returns {Promise} 验证结果
 */
function validateToken() {
  return request('/api/auth/validate', {
    method: 'POST'
  });
}

/**
 * 获取凭证列表
 * @returns {Promise} 凭证列表
 */
function getCredentials() {
  return request('/api/credentials', {
    method: 'GET'
  });
}

/**
 * 生成新凭证
 * @param {object} data - 凭证数据
 * @returns {Promise} 创建结果
 */
function createCredential(data) {
  return request('/api/credentials', {
    method: 'POST',
    data
  });
}

/**
 * 保存发行方设置
 * @param {object} data - 设置数据
 * @returns {Promise} 保存结果
 */
function saveSettings(data) {
  return request('/api/settings', {
    method: 'PUT',
    data
  });
}

/**
 * 管理员登录
 * @param {object} data - 登录数据
 * @returns {Promise} 登录结果
 */
function adminLogin(data) {
  return request('/api/admin/auth/login', {
    method: 'POST',
    data
  });
}

/**
 * 管理员登出
 * @returns {Promise} 登出结果
 */
function adminLogout() {
  return request('/api/admin/auth/logout', {
    method: 'POST'
  });
}

/**
 * 获取管理员信息
 * @returns {Promise} 管理员信息
 */
function getAdminInfo() {
  return request('/api/admin/auth/me', {
    method: 'GET'
  });
}

/**
 * 获取注册申请列表
 * @returns {Promise} 申请列表
 */
function getRegistrations() {
  return request('/api/admin/registrations', {
    method: 'GET'
  });
}

/**
 * 获取单个注册申请
 * @param {string} id - 申请ID
 * @returns {Promise} 申请详情
 */
function getRegistration(id) {
  return request(`/api/admin/registrations/${id}`, {
    method: 'GET'
  });
}

/**
 * 批准注册申请
 * @param {string} id - 申请ID
 * @returns {Promise} 操作结果
 */
function approveRegistration(id) {
  return request(`/api/admin/registrations/${id}/approve`, {
    method: 'PUT'
  });
}

/**
 * 拒绝注册申请
 * @param {string} id - 申请ID
 * @param {object} data - 拒绝原因
 * @returns {Promise} 操作结果
 */
function rejectRegistration(id, data) {
  return request(`/api/admin/registrations/${id}/reject`, {
    method: 'PUT',
    data
  });
}

// API测试连接
function testConnection() {
  return request({
    url: '/api/test',
    method: 'GET',
    needAuth: false
  }).then(response => {
    if (response.statusCode === 200) {
      return { success: true, message: '连接成功' };
    } else {
      throw new Error('连接失败');
    }
  });
}

// 导出所有API方法
module.exports = {
  testConnection,
  wechatLogin,
  getWechatUserInfo,
  verifyCredential,
  getVerificationHistory,
  verifyByCode,
  createTestAccount,
  checkTestAccount,
  registerCompany,
  loginIssuer,
  validateToken,
  getCredentials,
  createCredential,
  saveSettings,
  adminLogin,
  adminLogout,
  getAdminInfo,
  getRegistrations,
  getRegistration,
  approveRegistration,
  rejectRegistration
};