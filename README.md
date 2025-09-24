# TrueMark 验证器

TrueMark 是一个简单而强大的职业凭证验证系统，允许用户通过扫描二维码或输入验证码来快速验证职业凭证的真伪。

## 功能特点

### 验证器端（Verifier）
- 📱 二维码扫描验证
- 🔢 手动输入验证码验证
- ✅ 即时显示验证结果，包括员工姓名、职位、公司和在职时间
- 🔄 响应式设计，适配各种设备

### 发行方端（Issuer）
- 🔐 发行方登录认证
- 📊 仪表板概览，显示凭证统计信息
- 📝 便捷的凭证发行功能
- 📋 完整的凭证管理，包括查看、搜索和删除
- ⚙️ 公司设置管理

## 技术栈

- **前端**：HTML, CSS, JavaScript
- **后端服务**：[Supabase](https://supabase.io/)（提供数据库和认证服务）
- **二维码处理**：[html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **部署**：可部署到任何静态网站托管服务

## 快速开始

### 安装要求
- 现代浏览器（支持HTML5和WebRTC）
- 用于扫描二维码的摄像头（可选）

### 本地开发

1. 克隆或下载本项目

2. 使用Python启动简单的HTTP服务器：
   ```bash
   python3 -m http.server 8000
   ```

3. 打开浏览器，访问：
   - 验证器页面：`http://localhost:8000/index.html`
   - 发行方页面：`http://localhost:8000/issuer.html`

## 使用说明

### 验证凭证
1. 访问验证器页面
2. 选择以下方式之一：
   - 点击"启动扫描仪"，使用摄像头扫描凭证上的二维码
   - 在输入框中手动输入凭证上的验证码，然后点击"验证"
3. 系统会立即显示验证结果

### 发行凭证（发行方专用）
1. 访问发行方页面
2. 使用您的公司ID和密码登录
3. 在"发行凭证"标签页中，填写员工信息和职位详情
4. 点击"生成凭证"按钮
5. 系统会生成一个唯一的验证码，您可以将其提供给员工

## 项目结构

```
truemark-verifier/
├── index.html           # 验证器主页面
├── issuer.html          # 发行方管理页面
├── script.js            # 主要JavaScript功能（备用）
├── style.css            # 样式表（备用）
├── backup/              # 备份文件目录
├── README.md            # 项目文档
└── .gitignore           # Git忽略规则
```

## 安全性考虑

- 本项目使用Supabase提供的服务进行数据存储和身份验证
- 发行方密码在实际应用中应该进行加密存储
- 凭证数据通过唯一的验证码进行保护
- 建议在生产环境中使用HTTPS协议

## 部署指南

### 静态网站部署
TrueMark 验证器是一个纯静态网站，可以部署到任何支持静态网站托管的平台，如：
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

只需将项目文件上传到您选择的托管平台即可完成部署。

### 配置Supabase
1. 前往[Supabase官网](https://supabase.io/)创建账户
2. 创建新的项目和数据库
3. 导入必要的表结构（`credentials`和`issuers`）
4. 更新代码中的Supabase URL和API密钥

## 未来功能规划

- [ ] 凭证模板定制
- [ ] 多语言支持
- [ ] 更强大的发行方权限管理
- [ ] 批量导入员工信息
- [ ] 凭证过期提醒功能
- [ ] 数据分析和报表功能

## 许可证

本项目采用MIT许可证。详情请查看LICENSE文件。

## 联系我们

如有任何问题或建议，请联系项目维护者。