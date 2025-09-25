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

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('API端点列表:');
  console.log('- GET /api/test - 测试服务器连接');
});