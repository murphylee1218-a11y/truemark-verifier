// history.js - 验证历史页面逻辑
const auth = require('../../services/auth');
const api = require('../../services/api');
const util = require('../../utils/util');

Page({
  data: {
    historyList: [],
    isLoading: true,
    hasMore: true,
    page: 1,
    pageSize: 10,
    isRefreshing: false
  },

  onLoad: function() {
    this.checkLogin();
    this.loadHistoryList();
  },

  onShow: function() {
    // 如果从验证页面回来，刷新历史记录
    if (this.data.isFromVerify) {
      this.resetList();
      this.loadHistoryList();
      this.setData({
        isFromVerify: false
      });
    }
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

  // 重置列表状态
  resetList: function() {
    this.setData({
      historyList: [],
      page: 1,
      hasMore: true
    });
  },

  // 加载历史记录
  loadHistoryList: async function() {
    const { page, pageSize, historyList, hasMore } = this.data;

    if (!hasMore || this.data.isLoading) {
      this.setData({ isRefreshing: false });
      return;
    }

    this.setData({
      isLoading: true
    });

    try {
      const response = await api.getVerificationHistory({
        page,
        pageSize
      });

      const newList = response.data.list || [];
      const total = response.data.total || 0;
      const updatedList = page === 1 ? newList : [...historyList, ...newList];

      this.setData({
        historyList: updatedList,
        hasMore: updatedList.length < total,
        page: page + 1,
        isLoading: false,
        isRefreshing: false
      });
    } catch (error) {
      console.error('获取历史记录失败:', error);
      this.setData({
        isLoading: false,
        isRefreshing: false
      });
      util.showToast('获取历史记录失败，请重试', 'none');
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    });
    this.resetList();
    this.loadHistoryList();
  },

  // 上拉加载更多
  onReachBottom: function() {
    this.loadHistoryList();
  },

  // 查看凭证详情
  viewCredentialDetail: function(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?verificationCode=${item.verificationCode}`
    });
  },

  // 去验证
  goToVerify: function() {
    this.setData({
      isFromVerify: true
    });
    wx.switchTab({
      url: '/pages/verify/verify'
    });
  },

  // 清除所有历史记录（可选功能）
  clearAllHistory: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有验证历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          // 这里可以调用API清除历史记录
          util.showToast('清除历史记录功能暂未开放', 'none');
        }
      }
    });
  }
});