const jwt = require('jsonwebtoken');

// 使用与server.js中相同的密钥
const JWT_SECRET = 'test-secret-key-for-development-only-this-should-be-in-env-in-production';

// 要签名的用户数据
const userData = {
    companyId: 'TEST001',
    companyName: '测试科技有限公司',
    companyWebsite: 'https://example.com',
    contactEmail: 'test@example.com'
};

// 生成令牌，设置1小时过期
const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });

console.log('生成的测试JWT令牌：');
console.log(token);
console.log('\n请将此令牌复制到test-verify.html文件中的getTestToken函数返回值中。');