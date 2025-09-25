Page({
  data: {
    feedbackText: '',
    contact: ''
  },
  
  onInputFeedback(e) {
    this.setData({
      feedbackText: e.detail.value
    });
  },
  
  onInputContact(e) {
    this.setData({
      contact: e.detail.value
    });
  },
  
  submitFeedback() {
    if (!this.data.feedbackText) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return;
    }
    
    wx.showToast({
      title: '提交成功',
      icon: 'success'
    });
    
    this.setData({
      feedbackText: '',
      contact: ''
    });
  }
})