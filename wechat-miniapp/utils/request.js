// request.js - 网络请求封装
const API_BASE_URL = 'http://localhost:3000'; // 开发环境地址

class Request {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.timeout = 10000; // 10秒超时
  }

  /**
   * 发起请求
   * @param {string} url - 请求地址
   * @param {Object} options - 请求配置
   * @returns {Promise}
   */
  request(url, options = {}) {
    return new Promise((resolve, reject) => {
      // 获取全局token
      const app = getApp();
      const token = app.globalData.token;

      // 构建请求配置
      const config = {
        url: this.baseUrl + url,
        method: options.method || 'GET',
        timeout: this.timeout,
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        success: (res) => {
          // 处理响应
          if (res.statusCode === 200) {
            resolve(res);
          } else if (res.statusCode === 401) {
            // 未授权，清除token并重定向到登录页
            app.logout();
            wx.showToast({
              title: '请先登录',
              icon: 'none'
            });
            reject(new Error('未授权，请重新登录'));
          } else {
            wx.showToast({
              title: res.data?.error || '请求失败',
              icon: 'none'
            });
            reject(new Error(res.data?.error || `请求失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
          wx.showToast({
            title: '网络连接失败，请检查网络设置',
            icon: 'none'
          });
          reject(err);
        }
      };

      // 如果有token，添加到请求头
      if (token) {
        config.header['Authorization'] = `Bearer ${token}`;
      }

      // 添加请求数据
      if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
        config.data = options.data || {};
      } else if (options.params) {
        config.data = options.params;
      }

      // 发起请求
      wx.request(config);
    });
  }

  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {Object} params - 查询参数
   * @param {Object} options - 其他配置
   * @returns {Promise}
   */
  get(url, params = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'GET',
      params
    });
  }

  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他配置
   * @returns {Promise}
   */
  post(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      data
    });
  }

  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他配置
   * @returns {Promise}
   */
  put(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      data
    });
  }

  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {Object} options - 其他配置
   * @returns {Promise}
   */
  delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    });
  }
}

module.exports = new Request();