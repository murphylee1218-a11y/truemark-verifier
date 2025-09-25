// 只包含脚本的前几行用于测试
const API_BASE_URL = '/api';

// 全局凭证存储，用于在前端管理凭证数据
let credentialsStore = [
    {
        employee_name: "张三",
        job_title: "软件工程师",
        employment_start_date: "2022-01-15",
        employment_end_date: null,
        verification_code: "ABC12345",
        verified: true,
        company_name: "示例企业"
    }
];

console.log('Syntax test passed!');