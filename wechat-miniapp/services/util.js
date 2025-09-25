// 工具服务 - 提供通用工具函数

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期
 */
const formatDate = function(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
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
};

/**
 * 显示提示框
 * @param {string} title - 提示内容
 * @param {string} icon - 图标类型（success, loading, none, error）
 * @param {number} duration - 显示时长
 */
const showToast = function(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration,
    mask: true
  });
};

/**
 * 显示成功提示
 * @param {string} title - 提示内容
 */
const showSuccessToast = function(title) {
  showToast(title, 'success');
};

/**
 * 显示错误提示
 * @param {string} title - 提示内容
 */
const showErrorToast = function(title) {
  showToast(title, 'error');
};

/**
 * 显示确认对话框
 * @param {Object} options - 对话框选项
 * @param {string} options.title - 标题
 * @param {string} options.content - 内容
 * @param {Function} options.success - 成功回调
 * @param {Function} options.fail - 失败回调
 */
const showConfirmDialog = function(options) {
  const {
    title = '确认',
    content,
    success = () => {},
    fail = () => {}
  } = options;
  
  wx.showModal({
    title,
    content,
    success: (res) => {
      if (res.confirm) {
        success(res);
      } else if (res.cancel) {
        fail(res);
      }
    }
  });
};

/**
 * 显示加载中
 * @param {string} title - 加载提示
 */
const showLoading = function(title = '加载中') {
  wx.showLoading({
    title,
    mask: true
  });
};

/**
 * 隐藏加载中
 */
const hideLoading = function() {
  wx.hideLoading();
};

/**
 * 处理API错误
 * @param {Error|Object} error - 错误对象
 * @returns {string} 错误消息
 */
const handleApiError = function(error) {
  let errorMessage = '操作失败，请稍后重试';
  
  if (error) {
    if (error.statusCode) {
      switch (error.statusCode) {
        case 401:
          errorMessage = '登录已过期，请重新登录';
          wx.removeStorageSync('token');
          break;
        case 403:
          errorMessage = '无权限执行此操作';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    } else if (error.errMsg) {
      errorMessage = error.errMsg;
    }
  }
  
  showErrorToast(errorMessage);
  return errorMessage;
};

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
const generateUniqueId = function() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 清除缓存
 */
const clearCache = function() {
  try {
    const keys = wx.getStorageInfoSync().keys;
    keys.forEach(key => {
      if (!key.startsWith('_')) {
        wx.removeStorageSync(key);
      }
    });
    return true;
  } catch (error) {
    console.error('清除缓存失败:', error);
    return false;
  }
};

/**
 * 获取设备信息
 * @returns {Promise<Object>} 设备信息
 */
const getDeviceInfo = function() {
  return new Promise((resolve, reject) => {
    try {
      wx.getSystemInfo({
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(ms)
 * @returns {Function} 防抖后的函数
 */
const debounce = function(func, wait = 300) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制(ms)
 * @returns {Function} 节流后的函数
 */
const throttle = function(func, limit = 300) {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise} 复制结果
 */
const copyToClipboard = function(text) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: text,
      success: () => {
        resolve(true);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * 检查网络状态
 * @returns {Promise<Object>} 网络状态
 */
const checkNetworkStatus = function() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => {
        const isConnected = res.networkType !== 'none';
        resolve({
          isConnected,
          networkType: res.networkType
        });
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

// 导出所有方法
module.exports = {
  formatDate,
  showToast,
  showSuccessToast,
  showErrorToast,
  showConfirmDialog,
  showLoading,
  hideLoading,
  handleApiError,
  generateUniqueId,
  clearCache,
  getDeviceInfo,
  debounce,
  throttle,
  copyToClipboard,
  checkNetworkStatus
};