// util.js - 通用工具函数

/**
 * 格式化日期
 * @param {string|Date} date - 日期对象或日期字符串
 * @param {string} format - 格式化模板，默认为 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 验证是否为有效的验证码格式
 * @param {string} code - 验证码
 * @returns {boolean} 是否有效
 */
function isValidVerificationCode(code) {
  if (!code || typeof code !== 'string') return false;
  // 验证码格式：字母数字组合，长度6-10位
  const regex = /^[A-Za-z0-9]{6,10}$/;
  return regex.test(code);
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
function isValidPhone(phone) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 * @param {string} title - 提示文字
 * @param {Function} success - 成功回调
 */
function showSuccess(title, success) {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000,
    success
  });
}

/**
 * 显示错误提示
 * @param {string} title - 提示文字
 * @param {Function} success - 成功回调
 */
function showError(title, success) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000,
    success
  });
}

/**
 * 显示确认对话框
 * @param {Object} options - 配置项
 * @param {string} options.title - 标题
 * @param {string} options.content - 内容
 * @param {Function} options.confirm - 确认回调
 * @param {Function} options.cancel - 取消回调
 */
function showConfirm({ title = '提示', content, confirm, cancel }) {
  wx.showModal({
    title,
    content,
    success(res) {
      if (res.confirm && confirm) {
        confirm();
      } else if (res.cancel && cancel) {
        cancel();
      }
    }
  });
}

/**
 * 跳转到指定页面
 * @param {string} url - 页面路径
 * @param {Object} options - 配置项
 */
function navigateTo(url, options = {}) {
  const { replace = false, params = {} } = options;
  
  // 构建带参数的URL
  let fullUrl = url;
  if (Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }
  
  if (replace) {
    wx.redirectTo({ url: fullUrl });
  } else {
    wx.navigateTo({ url: fullUrl });
  }
}

/**
 * 获取相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间
 */
function getRelativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now - d;
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < month) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

module.exports = {
  formatDate,
  isValidVerificationCode,
  isValidEmail,
  isValidPhone,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  navigateTo,
  getRelativeTime
};