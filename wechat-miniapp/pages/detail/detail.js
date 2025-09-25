// detail.js - 凭证详情页面
Page({
  data: {
    verificationCode: '',
    credentialInfo: null,
    isLoading: true
  },

  onLoad: function(options) {
    const { verificationCode } = options;
    this.setData({
      verificationCode
    });
    this.loadCredentialDetail();
  },

  loadCredentialDetail: function() {
    // 模拟加载凭证详情
    setTimeout(() => {
      this.setData({
        credentialInfo: {
          isValid: true,
          credentialId: 'CRED-' + this.data.verificationCode.substring(0, 8),
          employeeName: '张三',
          companyName: '示例科技有限公司',
          position: '前端开发工程师',
          issueDate: '2023-01-01',
          expiryDate: '2024-01-01',
          verificationTime: new Date().toLocaleString()
        },
        isLoading: false
      });
    }, 1000);
  }
});