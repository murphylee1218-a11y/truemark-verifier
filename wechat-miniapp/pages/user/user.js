// user.js - 用户中心页面逻辑
const auth = require('../../services/auth');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    appVersion: '1.0.0',
    menuItems: [
      {
        id: 'about',
        title: '关于我们',
        icon: '/images/about_icon.png',
        url: '/pages/about/about'
      },
      {
        id: 'feedback',
        title: '意见反馈',
        icon: '/images/feedback_icon.png',
        url: '/pages/feedback/feedback'
      },
      {
        id: 'settings',
        title: '设置',
        icon: '/images/settings_icon.png',
        url: '/pages/settings/settings'
      }
    ]
  },

  onLoad: function() {
    this.checkLogin();
  },

  onShow: function() {
    // 每次显示页面时更新用户信息
    this.updateUserInfo();
  },

  // 检查登录状态
  checkLogin: async function() {
    const isLoggedIn = await auth.ensureLogin();
    if (!isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },

  // 更新用户信息
  updateUserInfo: function() {
    const userInfo = auth.getUserInfo();
    this.setData({
      userInfo
    });
  },

  // 点击菜单项
  onMenuItemTap: function(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    });
  },

  // 查看用户信息详情
  viewUserInfoDetail: function() {
    wx.navigateTo({
      url: '/pages/user-detail/user-detail'
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout();
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 清除缓存
  clearCache: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          util.showSuccess('缓存清除成功');
        }
      }
    });
  },

  // 检查更新
  checkUpdate: function() {
    util.showToast('当前已是最新版本', 'none');
  },

  // 关于我们
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  }
});