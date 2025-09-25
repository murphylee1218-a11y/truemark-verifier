// 配置管理服务

/**
 * 配置管理服务
 * 使用单例模式实现全局配置管理
 */
function SettingsService() {
  // 私有配置对象
  let _config = null;
  
  // 默认配置
  const DEFAULT_CONFIG = {
    // 接口配置
    api: {
      baseUrl: 'https://api.truemark.com/v1',
      timeout: 10000,
      retryCount: 2
    },
    
    // 功能开关
    features: {
      enableScan: true,
      enableHistory: true,
      enableShare: true,
      enableOfflineMode: false
    },
    
    // UI配置
    ui: {
      theme: 'light',
      language: 'zh-CN',
      animation: true,
      fontSize: 'normal'
    },
    
    // 缓存配置
    cache: {
      maxSize: 50 * 1024 * 1024, // 50MB
      expireTime: 7 * 24 * 60 * 60 * 1000 // 7天
    }
  };
  
  /**
   * 初始化配置
   * @returns {Promise<Object>} 配置对象
   */
  function init() {
    return new Promise((resolve, reject) => {
      try {
        // 从本地存储读取配置
        const savedConfig = wx.getStorageSync('_truemark_settings');
        
        if (savedConfig) {
          _config = { ...DEFAULT_CONFIG, ...savedConfig };
        } else {
          _config = { ...DEFAULT_CONFIG };
          // 保存默认配置到本地
          wx.setStorageSync('_truemark_settings', _config);
        }
        
        resolve(_config);
      } catch (error) {
        console.error('初始化配置失败:', error);
        // 出错时使用默认配置
        _config = { ...DEFAULT_CONFIG };
        resolve(_config);
      }
    });
  }
  
  /**
   * 获取完整配置
   * @returns {Object} 当前配置
   */
  function getConfig() {
    if (!_config) {
      console.warn('配置未初始化，使用默认配置');
      _config = { ...DEFAULT_CONFIG };
    }
    return { ..._config }; // 返回副本避免直接修改
  }
  
  /**
   * 获取配置项
   * @param {string} key - 配置键名，支持点表示法（如 'api.baseUrl'）
   * @param {*} defaultValue - 默认值
   * @returns {*} 配置值
   */
  function get(key, defaultValue = null) {
    if (!_config) {
      _config = { ...DEFAULT_CONFIG };
    }
    
    if (!key) return _config;
    
    const keys = key.split('.');
    let value = _config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }
  
  /**
   * 设置配置项
   * @param {string|Object} key - 配置键名或配置对象
   * @param {*} value - 配置值（当key为字符串时）
   * @returns {Promise<boolean>} 是否成功
   */
  function set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        if (!_config) {
          _config = { ...DEFAULT_CONFIG };
        }
        
        if (typeof key === 'object') {
          // 批量设置
          _config = { ..._config, ...key };
        } else {
          // 单个设置，支持点表示法
          const keys = key.split('.');
          let obj = _config;
          
          for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!obj[k] || typeof obj[k] !== 'object') {
              obj[k] = {};
            }
            obj = obj[k];
          }
          
          obj[keys[keys.length - 1]] = value;
        }
        
        // 保存到本地存储
        wx.setStorageSync('_truemark_settings', _config);
        resolve(true);
      } catch (error) {
        console.error('保存配置失败:', error);
        reject(error);
      }
    });
  }
  
  /**
   * 重置配置到默认值
   * @returns {Promise<Object>} 重置后的配置
   */
  function reset() {
    return new Promise((resolve, reject) => {
      try {
        _config = { ...DEFAULT_CONFIG };
        wx.setStorageSync('_truemark_settings', _config);
        resolve(_config);
      } catch (error) {
        console.error('重置配置失败:', error);
        reject(error);
      }
    });
  }
  
  /**
   * 检查功能是否启用
   * @param {string} featureName - 功能名称
   * @returns {boolean} 是否启用
   */
  function isFeatureEnabled(featureName) {
    return get(`features.${featureName}`, false);
  }
  
  /**
   * 设置功能开关
   * @param {string} featureName - 功能名称
   * @param {boolean} enabled - 是否启用
   * @returns {Promise<boolean>} 是否成功
   */
  function setFeature(featureName, enabled) {
    return set(`features.${featureName}`, !!enabled);
  }
  
  /**
   * 更新API配置
   * @param {Object} apiConfig - API配置对象
   * @returns {Promise<boolean>} 是否成功
   */
  function updateApiConfig(apiConfig) {
    return set('api', {
      ...get('api', {}),
      ...apiConfig
    });
  }
  
  /**
   * 更新UI配置
   * @param {Object} uiConfig - UI配置对象
   * @returns {Promise<boolean>} 是否成功
   */
  function updateUiConfig(uiConfig) {
    return set('ui', {
      ...get('ui', {}),
      ...uiConfig
    });
  }
  
  /**
   * 获取缓存配置
   * @returns {Object} 缓存配置
   */
  function getCacheConfig() {
    return get('cache', {});
  }
  
  /**
   * 导出配置到文件
   * @returns {Promise<Object>} 导出的配置
   */
  function exportConfig() {
    return new Promise((resolve, reject) => {
      try {
        const configToExport = {
          version: '1.0',
          exportTime: new Date().toISOString(),
          config: getConfig()
        };
        
        resolve(configToExport);
      } catch (error) {
        console.error('导出配置失败:', error);
        reject(error);
      }
    });
  }
  
  /**
   * 从导入数据恢复配置
   * @param {Object} importedData - 导入的配置数据
   * @returns {Promise<Object>} 恢复后的配置
   */
  function importConfig(importedData) {
    return new Promise((resolve, reject) => {
      try {
        if (importedData && importedData.config) {
          _config = { ...DEFAULT_CONFIG, ...importedData.config };
          wx.setStorageSync('_truemark_settings', _config);
          resolve(_config);
        } else {
          throw new Error('无效的导入数据');
        }
      } catch (error) {
        console.error('导入配置失败:', error);
        reject(error);
      }
    });
  }
  
  // 暴露公共方法
  return {
    init,
    getConfig,
    get,
    set,
    reset,
    isFeatureEnabled,
    setFeature,
    updateApiConfig,
    updateUiConfig,
    getCacheConfig,
    exportConfig,
    importConfig
  };
}

// 创建单例实例
const settingsInstance = SettingsService();

// 便捷访问函数
function getSetting(key, defaultValue) {
  return settingsInstance.get(key, defaultValue);
}

function setSetting(key, value) {
  return settingsInstance.set(key, value);
}

function checkFeature(featureName) {
  return settingsInstance.isFeatureEnabled(featureName);
}

// 导出
module.exports = {
  // 单例实例
  instance: settingsInstance,
  
  // 便捷访问函数
  getSetting,
  setSetting,
  checkFeature,
  
  // 直接暴露核心方法
  init: settingsInstance.init.bind(settingsInstance),
  getConfig: settingsInstance.getConfig.bind(settingsInstance),
  get: settingsInstance.get.bind(settingsInstance),
  set: settingsInstance.set.bind(settingsInstance),
  reset: settingsInstance.reset.bind(settingsInstance),
  isFeatureEnabled: settingsInstance.isFeatureEnabled.bind(settingsInstance),
  setFeature: settingsInstance.setFeature.bind(settingsInstance),
  updateApiConfig: settingsInstance.updateApiConfig.bind(settingsInstance),
  updateUiConfig: settingsInstance.updateUiConfig.bind(settingsInstance),
  getCacheConfig: settingsInstance.getCacheConfig.bind(settingsInstance),
  exportConfig: settingsInstance.exportConfig.bind(settingsInstance),
  importConfig: settingsInstance.importConfig.bind(settingsInstance)
};