# 微信小程序示例项目

这个目录包含了与truemark-verifier系统集成的微信小程序示例代码。

## 项目结构

```
wechat-miniapp/
├── app.js               // 小程序入口文件
├── app.json             // 全局配置
├── app.wxss             // 全局样式
├── components/          // 公共组件
│   ├── auth-modal/      // 登录弹窗组件
│   └── credential-card/ // 凭证卡片组件
├── pages/               // 页面
│   ├── index/           // 首页
│   ├── login/           // 登录页
│   ├── verify/          // 验证页
│   ├── history/         // 验证历史页
│   └── user/            // 用户中心页
├── services/            // API服务
│   ├── api.js           // API请求封装
│   └── auth.js          // 认证相关服务
└── utils/               // 工具函数
    ├── request.js       // 网络请求
    └── util.js          // 通用工具
```

## 如何使用

1. 使用微信开发者工具导入此项目
2. 确保后端服务正在运行（端口3000）
3. 修改 `services/api.js` 中的API_BASE_URL为实际后端地址
4. 在微信开发者工具中编译运行

## 主要功能

1. **微信登录** - 使用微信账号快速登录
2. **凭证验证** - 通过验证码或扫描二维码验证凭证
3. **验证历史** - 查看历史验证记录
4. **用户中心** - 管理用户信息

## 注意事项

1. 实际项目中需要在`app.js`中配置合法的小程序appid
2. 生产环境中需要配置正确的request合法域名
3. 微信登录功能在实际使用时需要调用官方的`wx.login()`获取code
4. 数据库表结构需要按照`init-database.js`中的设计在Supabase中创建