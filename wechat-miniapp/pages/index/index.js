// index.js - 首页逻辑
const auth = require('../../services/auth');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    isLoading: true,
    features: [
      {
        id: 'verify',
        title: '凭证验证',
        desc: '快速验证员工凭证',
        icon: '/images/verify_icon.png',
        url: '/pages/verify/verify'
      },
      {
        id: 'history',
        title: '验证历史',
        desc: '查看历史验证记录',
        icon: '/images/history_icon.png',
        url: '/pages/history/history'
      },
      {
        id: 'about',
        title: '关于我们',
        desc: '了解印绩凭证系统',
        icon: '/images/about_icon.png',
        url: '/pages/about/about'
      }
    ]
  },

  onLoad: function() {
    this.initPage();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },

  // 初始化页面
  initPage: function() {
    this.setData({
      isLoading: true
    });

    // 检查登录状态
    this.checkLoginStatus().then(() => {
      this.setData({
        isLoading: false
      });
    });
  },

  // 检查登录状态
  checkLoginStatus: function() {
    return new Promise((resolve) => {
      if (auth.checkLogin()) {
        // 已登录，获取用户信息
        const userInfo = auth.getUserInfo();
        this.setData({
          userInfo
        });
        resolve(true);
      } else {
        // 未登录，跳转到登录页
        wx.redirectTo({
          url: '/pages/login/login',
          complete: () => {
            resolve(false);
          }
        });
      }
    });
  },

  // 点击功能入口
  onFeatureTap: function(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    });
  },

  // 去验证
  goToVerify: function() {
    wx.switchTab({
      url: '/pages/verify/verify'
    });
  },

  // 去历史记录
  goToHistory: function() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  },

  // 去个人中心
  goToUserCenter: function() {
    wx.switchTab({
      url: '/pages/user/user'
    });
  },

  // 刷新页面
  onPullDownRefresh: function() {
    this.initPage();
    wx.stopPullDownRefresh();
  }
});