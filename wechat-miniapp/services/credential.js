// 凭证验证服务
const apiService = require('./api');
const utilService = require('./util');

/**
 * 验证凭证（验证码方式）
 * @param {string} code - 验证码
 * @returns {Promise<Object>} 验证结果
 */
function validateCredentialByCode(code) {
  return new Promise((resolve, reject) => {
    apiService.verifyByCode(code)
      .then(response => {
        if (response.statusCode === 200 && response.data) {
          utilService.showSuccessToast('验证成功');
          resolve(response.data);
        } else {
          utilService.showErrorToast('验证失败，请检查验证码');
          reject(new Error('验证失败'));
        }
      })
      .catch(error => {
        console.error('凭证验证失败:', error);
        utilService.showErrorToast(error.message || '验证过程出错');
        reject(error);
      });
  });
}

/**
 * 验证凭证（详情方式）
 * @param {Object} data - 验证数据
 * @param {string} data.verificationCode - 验证码
 * @param {string} data.userId - 用户ID
 * @returns {Promise<Object>} 验证结果
 */
function validateCredentialDetails(data) {
  return new Promise((resolve, reject) => {
    apiService.verifyCredential(data)
      .then(response => {
        if (response.statusCode === 200 && response.data) {
          utilService.showSuccessToast('验证成功');
          resolve(response.data);
        } else {
          utilService.showErrorToast('验证失败，凭证可能已过期或无效');
          reject(new Error('验证失败'));
        }
      })
      .catch(error => {
        console.error('凭证验证失败:', error);
        utilService.showErrorToast(error.message || '验证过程出错');
        reject(error);
      });
  });
}

/**
 * 获取凭证验证历史
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @returns {Promise<Array>} 历史记录列表
 */
function fetchVerificationHistory(params = {}) {
  return new Promise((resolve, reject) => {
    apiService.getVerificationHistory({
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    })
    .then(response => {
      if (response.statusCode === 200 && response.data) {
        resolve(response.data);
      } else {
        reject(new Error('获取历史记录失败'));
      }
    })
    .catch(error => {
      console.error('获取验证历史失败:', error);
      reject(error);
    });
  });
}

/**
 * 解析凭证信息
 * @param {Object} credential - 凭证数据
 * @returns {Object} 解析后的凭证信息
 */
function parseCredentialInfo(credential) {
  if (!credential) return null;
  
  return {
    id: credential.id,
    verificationCode: credential.verificationCode || credential.code,
    companyName: credential.companyName || credential.issuer,
    issueDate: credential.issueDate,
    expireDate: credential.expireDate,
    status: credential.status,
    isValid: credential.status === 'valid' || credential.status === 'active',
    isExpired: credential.expireDate && new Date(credential.expireDate) < new Date(),
    details: credential.details || credential.info,
    qrCodeUrl: credential.qrCodeUrl,
    lastVerified: credential.lastVerified
  };
}

/**
 * 格式化凭证日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
function formatCredentialDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

/**
 * 验证凭证状态
 * @param {Object} credential - 凭证数据
 * @returns {Object} 状态信息
 */
function checkCredentialStatus(credential) {
  if (!credential) {
    return {
      status: 'invalid',
      message: '凭证不存在',
      isValid: false
    };
  }
  
  // 检查状态
  if (credential.status === 'invalid' || credential.status === 'revoked') {
    return {
      status: credential.status,
      message: credential.status === 'revoked' ? '凭证已被撤销' : '凭证无效',
      isValid: false
    };
  }
  
  // 检查过期
  if (credential.expireDate) {
    const expireDate = new Date(credential.expireDate);
    const now = new Date();
    
    if (expireDate < now) {
      return {
        status: 'expired',
        message: '凭证已过期',
        isValid: false
      };
    }
    
    // 检查即将过期（7天内）
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (expireDate < sevenDaysLater) {
      return {
        status: 'warning',
        message: '凭证即将过期',
        isValid: true
      };
    }
  }
  
  return {
    status: 'valid',
    message: '凭证有效',
    isValid: true
  };
}

/**
 * 生成分享内容
 * @param {Object} credential - 凭证数据
 * @returns {Object} 分享配置
 */
function generateShareContent(credential) {
  const parsedInfo = parseCredentialInfo(credential);
  
  if (!parsedInfo) return null;
  
  return {
    title: `TrueMark验证: ${parsedInfo.companyName}`,
    desc: `验证码: ${parsedInfo.verificationCode}\n状态: ${parsedInfo.isValid ? '有效' : '无效'}`,
    path: `/pages/verify/result?code=${parsedInfo.verificationCode}`,
    imageUrl: parsedInfo.qrCodeUrl || '/images/share-icon.png'
  };
}

/**
 * 保存验证记录到本地
 * @param {Object} credential - 验证结果
 */
function saveVerificationToLocal(credential) {
  try {
    // 获取现有记录
    const history = wx.getStorageSync('local_verification_history') || [];
    
    // 添加新记录
    const record = {
      ...parseCredentialInfo(credential),
      verifyTime: new Date().toISOString()
    };
    
    // 限制本地记录数量
    const updatedHistory = [record, ...history].slice(0, 50);
    
    wx.setStorageSync('local_verification_history', updatedHistory);
  } catch (error) {
    console.error('保存本地验证记录失败:', error);
  }
}

/**
 * 获取本地验证历史
 * @returns {Array} 本地历史记录
 */
function getLocalVerificationHistory() {
  try {
    return wx.getStorageSync('local_verification_history') || [];
  } catch (error) {
    console.error('获取本地验证历史失败:', error);
    return [];
  }
}

/**
 * 清除本地验证历史
 */
function clearLocalVerificationHistory() {
  try {
    wx.removeStorageSync('local_verification_history');
  } catch (error) {
    console.error('清除本地验证历史失败:', error);
  }
}

/**
 * 导出验证报告
 * @param {Object} credential - 凭证数据
 * @returns {Object} 报告数据
 */
function generateVerificationReport(credential) {
  const parsedInfo = parseCredentialInfo(credential);
  const statusInfo = checkCredentialStatus(credential);
  
  return {
    reportId: `report_${Date.now()}`,
    generateTime: new Date().toISOString(),
    verificationCode: parsedInfo.verificationCode,
    companyName: parsedInfo.companyName,
    issueDate: parsedInfo.issueDate,
    expireDate: parsedInfo.expireDate,
    currentStatus: statusInfo.status,
    statusMessage: statusInfo.message,
    isValid: statusInfo.isValid,
    details: parsedInfo.details,
    reportVersion: '1.0'
  };
}

// 导出所有方法
module.exports = {
  validateCredentialByCode,
  validateCredentialDetails,
  fetchVerificationHistory,
  parseCredentialInfo,
  formatCredentialDate,
  checkCredentialStatus,
  generateShareContent,
  saveVerificationToLocal,
  getLocalVerificationHistory,
  clearLocalVerificationHistory,
  generateVerificationReport
};