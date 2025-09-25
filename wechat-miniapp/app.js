// app.js
// 导入服务层
const services = require('./services/index');

App({
  globalData: {
    userInfo: null,
    token: null,
    isAuthenticated: false
  },

  // 服务实例引用，方便全局访问
  services: services,

  onLaunch: function() {
    console.log('小程序启动，开始初始化服务...');
    
    // 显示启动加载动画
    wx.showLoading({
      title: '加载中...',
    });

    // 初始化服务层
    services.init()
      .then(() => {
        console.log('服务初始化成功');
        // 检查本地存储的登录状态
        this.checkLocalLoginStatus();
      })
      .catch(error => {
        console.error('服务初始化失败:', error);
      })
      .finally(() => {
        // 隐藏加载动画
        setTimeout(() => {
          wx.hideLoading();
        }, 500);
      });
  },

  // 检查本地登录状态
  checkLocalLoginStatus: function() {
    try {
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');
      
      if (token && userInfo) {
        this.globalData.token = token;
        this.globalData.userInfo = userInfo;
        this.globalData.isAuthenticated = true;
        console.log('恢复本地登录状态成功');
      } else {
        console.log('无本地登录状态');
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    }
  },

  // 用户登录 - 使用服务层的登录方法
  login: function() {
    return new Promise((resolve, reject) => {
      services.login()
        .then(response => {
          if (response && response.token && response.userInfo) {
            // 保存登录状态到全局
            this.globalData.token = response.token;
            this.globalData.userInfo = response.userInfo;
            this.globalData.isAuthenticated = true;
            
            // 存储到本地
            wx.setStorageSync('token', response.token);
            wx.setStorageSync('userInfo', response.userInfo);
            
            services.util.showSuccessToast('登录成功');
            resolve(response.userInfo);
          } else {
            throw new Error('登录响应数据不完整');
          }
        })
        .catch(error => {
          console.error('登录失败:', error);
          services.util.showErrorToast(error.message || '登录失败，请重试');
          reject(error);
        });
    });
  },

  // 用户登出 - 使用服务层的登出方法
  logout: function() {
    try {
      // 调用服务层登出方法
      services.logout();
      
      // 清除全局状态
      this.globalData.token = null;
      this.globalData.userInfo = null;
      this.globalData.isAuthenticated = false;
      
      // 清除本地存储
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      
      services.util.showSuccessToast('已退出登录');
      
      // 跳转到登录页
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login',
        });
      }, 1500);
    } catch (error) {
      console.error('登出失败:', error);
      services.util.showErrorToast('退出登录失败');
    }
  },

  // 检查登录状态
  checkLogin: function() {
    return new Promise((resolve, reject) => {
      if (this.globalData.isAuthenticated) {
        resolve(this.globalData.userInfo);
      } else {
        // 尝试重新登录
        this.login().then(userInfo => {
          resolve(userInfo);
        }).catch(error => {
          reject(error);
        });
      }
    });
  },

  // 获取认证头信息
  getAuthHeaders: function() {
    return services.auth.getAuthHeaders();
  },

  // 检查服务可用性
  checkServices: function() {
    return services.isAvailable();
  }
});