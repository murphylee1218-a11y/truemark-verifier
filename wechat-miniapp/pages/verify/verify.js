// verify.js - 凭证验证页面逻辑
const auth = require('../../services/auth');
const api = require('../../services/api');
const util = require('../../utils/util');

Page({
  data: {
    verificationCode: '',
    isScanning: false,
    isVerifying: false,
    credentialInfo: null,
    showResult: false,
    errorMsg: ''
  },

  onLoad: function() {
    this.checkLogin();
  },

  onShow: function() {
    // 每次显示页面时重置状态
    this.setData({
      verificationCode: '',
      credentialInfo: null,
      showResult: false,
      errorMsg: ''
    });
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

  // 输入验证码
  onInputCode: function(e) {
    const value = e.detail.value;
    this.setData({
      verificationCode: value,
      errorMsg: ''
    });
  },

  // 扫描二维码
  scanQRCode: function() {
    // 检查是否有权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              this.startScan();
            },
            fail: () => {
              util.showToast('请在设置中授权相机权限', 'none');
              wx.openSetting();
            }
          });
        } else {
          this.startScan();
        }
      }
    });
  },

  // 开始扫描
  startScan: function() {
    this.setData({
      isScanning: true
    });

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        const scanResult = res.result;
        this.setData({
          verificationCode: scanResult,
          isScanning: false
        });
        // 自动验证
        this.verifyCredential();
      },
      fail: (err) => {
        console.error('扫描失败:', err);
        this.setData({
          isScanning: false
        });
        if (err.errMsg !== 'scanCode:fail cancel') {
          util.showToast('扫描失败，请重试', 'none');
        }
      },
      complete: () => {
        this.setData({
          isScanning: false
        });
      }
    });
  },

  // 验证凭证
  verifyCredential: async function() {
    const { verificationCode } = this.data;
    
    if (!verificationCode.trim()) {
      this.setData({
        errorMsg: '请输入验证码'
      });
      return;
    }

    if (!util.isValidVerificationCode(verificationCode)) {
      this.setData({
        errorMsg: '验证码格式不正确'
      });
      return;
    }

    this.setData({
      isVerifying: true,
      errorMsg: '',
      showResult: false
    });

    try {
      const response = await api.verifyCredential({
        verificationCode
      });

      const credentialInfo = response.data;
      this.setData({
        credentialInfo,
        showResult: true,
        isVerifying: false
      });

      // 显示成功提示
      util.showSuccess('验证成功');
    } catch (error) {
      console.error('验证失败:', error);
      this.setData({
        errorMsg: error.message || '验证失败，请检查验证码是否正确',
        isVerifying: false
      });
    }
  },

  // 清除验证码
  clearCode: function() {
    this.setData({
      verificationCode: '',
      errorMsg: '',
      showResult: false,
      credentialInfo: null
    });
  },

  // 返回重新验证
  goBackVerify: function() {
    this.setData({
      showResult: false,
      verificationCode: '',
      credentialInfo: null
    });
  },

  // 查看历史记录
  viewHistory: function() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  }
});