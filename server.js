// 后端服务器入口文件
// TrueMark 凭证验证系统服务端

// 导入依赖模块
const express = require('express');
const cors = require('cors');
const path = require('path');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 简单的测试API端点
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器运行正常' });
});

// 管理员登录API端点 - 简单实现
app.post('/api/admin/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('收到管理员登录请求:', { username });
  
  // 简单的测试账户验证（实际项目中应该连接数据库）
  if (username === 'admin' && password === 'admin123') {
    // 模拟返回访问令牌和管理员信息
    const mockAccessToken = 'mock_admin_token_' + Date.now();
    const mockAdminInfo = {
      id: 1,
      username: 'admin',
      name: '系统管理员',
      role: 'super_admin',
      permissions: ['all']
    };
    
    return res.status(200).json({
      accessToken: mockAccessToken,
      admin: mockAdminInfo,
      message: '登录成功'
    });
  } else {
    // 登录失败
    return res.status(401).json({
      message: '用户名或密码错误'
    });
  }
});

// 普通用户登录API端点 - 简单实现
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('收到用户登录请求:', { username });
  
  // 简单的测试账户验证
  if (username === 'user' && password === 'user123') {
    // 模拟返回访问令牌和用户信息
    const mockAccessToken = 'mock_user_token_' + Date.now();
    const mockUserInfo = {
      id: 1001,
      username: 'user',
      name: '测试用户',
      role: 'user'
    };
    
    return res.status(200).json({
      accessToken: mockAccessToken,
      user: mockUserInfo,
      message: '登录成功'
    });
  } else {
    // 登录失败
    return res.status(401).json({
      message: '用户名或密码错误'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('API端点列表:');
  console.log('- GET /api/test - 测试服务器连接');
  console.log('- POST /api/admin/auth/login - 管理员登录');
  console.log('- POST /api/auth/login - 普通用户登录');
});