# TrueMark 验证器项目 - Supabase部署指南

本指南将帮助您将TrueMark验证器项目部署到Supabase平台。

## 前提条件

在开始部署之前，请确保您已安装以下工具：

1. [Node.js](https://nodejs.org/)
2. [Git](https://git-scm.com/)
3. [Supabase CLI](https://supabase.com/docs/guides/cli)

## 安装Supabase CLI

```bash
# 使用npm安装
npm install -g supabase

# 或者使用Homebrew (macOS)
brew install supabase/tap/supabase
```

## 登录Supabase

```bash
supabase login
```

## 项目结构说明

本项目包含以下关键组件：

- `functions/index.ts`: Supabase Edge Functions入口文件，包含所有API端点
- `supabase.json`: Supabase项目配置文件
- `index.html`, `register.html`, `issuer.html`等：前端页面
- `server.js`: Node.js服务器版本（本地开发使用）

## 部署步骤

### 1. 克隆仓库

如果您还没有克隆此仓库，请先克隆：

```bash
git clone <仓库URL>
cd truemark-verifier
```

### 2. 链接到Supabase项目

```bash
supabase link --project-ref <您的项目引用ID>
```

您可以在Supabase控制台的项目设置中找到项目引用ID。

### 3. 设置环境变量

在部署之前，您需要在Supabase控制台设置以下环境变量：

1. 登录到[Supabase控制台](https://app.supabase.com/)
2. 选择您的项目
3. 点击"Settings" > "API"
4. 在"Environment Variables"部分添加：
   - `SUPABASE_URL`: 您的Supabase项目URL
   - `SUPABASE_KEY`: 您的Supabase服务角色密钥
   - `JWT_SECRET`: 用于JWT令牌签名的安全密钥

### 4. 部署Edge Functions

```bash
supabase functions deploy index
```

### 5. 配置静态文件托管

Supabase目前不直接支持静态文件托管。为了完整部署前端页面，您可以：

#### 选项A：使用Supabase Storage存储静态文件

```bash
# 首先创建存储桶
supabase storage buckets create public

# 上传所有HTML、CSS、JS文件
supabase storage objects upload --bucket public *.html .
supabase storage objects upload --bucket public *.css .
supabase storage objects upload --bucket public *.js .
```

#### 选项B：使用其他静态托管服务

您可以使用Vercel、Netlify、GitHub Pages等服务托管静态文件，然后配置它们的API请求指向Supabase Edge Functions URL。

## 本地开发

### 启动Supabase本地开发环境

```bash
supabase start
```

### 运行Edge Functions本地开发服务器

```bash
supabase functions serve index
```

这将在`http://localhost:54321/functions/v1/index`启动本地开发服务器。

### 运行Node.js版本（可选）

如果您更习惯使用Node.js开发，也可以运行原始的Node.js服务器：

```bash
npm install
npm start
```

## 测试账户

为了方便测试，本项目包含以下测试账户：

- 企业ID: TEST001
- 密码: test1234

## API端点列表

部署到Supabase后，您可以访问以下API端点：

- POST `/api/auth/login`: 发行方登录
- GET `/api/credentials`: 获取凭证列表
- POST `/api/credentials`: 生成新凭证
- GET `/api/credentials/verify/:code`: 验证凭证
- POST `/api/verify`: 验证凭证（兼容前端）
- PUT `/api/settings`: 保存发行方设置
- POST `/api/create-test-account`: 创建测试账户
- GET `/api/check-test-account`: 检查测试账户是否存在

## 故障排除

### CORS问题

如果遇到跨域资源共享(CORS)问题，请确保您的Supabase项目已正确配置CORS规则。

### 部署失败

如果部署失败，请检查：
- `functions/index.ts`文件是否有语法错误
- 环境变量是否正确设置
- 您的Supabase账户是否有足够的权限

### API请求失败

如果API请求失败，请检查：
- 请求URL是否正确
- 请求方法是否与API端点匹配
- 认证令牌是否有效（如果需要认证）

## 注意事项

- 本项目使用的是简化版本的实现，适用于演示和测试目的
- 在生产环境中，您应该：
  - 使用真正的数据库存储用户信息
  - 增强安全性措施
  - 实现更完善的错误处理
  - 使用环境变量存储所有敏感信息