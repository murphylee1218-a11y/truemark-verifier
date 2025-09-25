// 微信小程序认证服务

/**
 * 微信登录
 * @returns {Promise} 登录结果
 */
const wxLogin = function() {
  return new Promise((resolve, reject) => {
    try {
      // 获取微信登录code
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送code到服务器
            wx.request({
              url: 'http://localhost:3000/api/wechat/login',
              method: 'POST',
              data: {
                code: res.code
              },
              success: (response) => {
                if (response.statusCode === 200 && response.data.token) {
                  // 存储token
                  wx.setStorageSync('token', response.data.token);
                  wx.setStorageSync('userInfo', response.data.userInfo || {});
                  resolve(response.data);
                } else {
                  reject(new Error('登录失败'));
                }
              },
              fail: (error) => {
                reject(error);
              }
            });
          } else {
            reject(new Error('获取登录code失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 检查登录状态
 * @returns {Promise} 登录状态
 */
const checkLoginStatus = function() {
  return new Promise((resolve, reject) => {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        resolve(false);
        return;
      }

      // 验证token是否有效
      wx.request({
        url: 'http://localhost:3000/api/auth/validate',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (response) => {
          resolve(response.statusCode === 200);
        },
        fail: () => {
          // 网络错误时，默认返回已登录状态，但实际可能已过期
          resolve(true);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
const getUserInfo = function() {
  return wx.getStorageSync('userInfo') || null;
};

/**
 * 退出登录
 */
const logout = function() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  // 可以添加其他清理操作
};

/**
 * 获取认证头
 * @returns {Object} 包含Authorization的请求头
 */
const getAuthHeaders = function() {
  const token = wx.getStorageSync('token');
  return token ? {
    'Authorization': `Bearer ${token}`
  } : {};
};

// 导出所有方法
module.exports = {
  wxLogin,
  checkLoginStatus,
  getUserInfo,
  logout,
  getAuthHeaders
};