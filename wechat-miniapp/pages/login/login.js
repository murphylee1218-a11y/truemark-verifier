// login.js - 登录页面逻辑
// 导入服务层
const app = getApp();
const services = app.services;

Page({
  data: {
    isLoading: false,
    errorMsg: ''
  },

  onLoad: function() {
    console.log('登录页面加载');
    // 检查是否已经登录
    if (app.globalData.isAuthenticated) {
      // 已登录，直接跳转到首页
      console.log('用户已登录，跳转到首页');
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onShow: function() {
    // 页面显示时清除错误信息
    this.setData({
      errorMsg: ''
    });
  },

  // 微信登录
  handleWechatLogin: function() {
    this.setData({
      isLoading: true,
      errorMsg: ''
    });

    // 调用应用实例的登录方法
    app.login()
      .then(() => {
        console.log('登录成功');
        this.setData({ isLoading: false });
        
        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      })
      .catch((error) => {
        console.error('登录失败:', error);
        this.setData({
          isLoading: false,
          errorMsg: error.message || '登录失败，请稍后重试'
        });
        
        // 显示错误提示
        services.util.showErrorToast(error.message || '登录失败，请稍后重试');
      });
  },

  // 清除错误信息
  clearError: function() {
    this.setData({
      errorMsg: ''
    });
  },

  // 测试网络连接
  testNetwork: function() {
    services.api.testConnection()
      .then(() => {
        services.util.showSuccessToast('网络连接正常');
      })
      .catch(() => {
        services.util.showErrorToast('网络连接异常，请检查网络设置');
      });
  }
});