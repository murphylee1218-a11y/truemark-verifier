// 创建测试发行方账户的脚本
// 在浏览器控制台中执行此脚本以添加测试用户

// 初始化Supabase客户端
const supabaseUrl = 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// 创建测试发行方账户的函数
async function createTestIssuer() {
    if (!supabase) {
        console.error('Supabase客户端未初始化');
        alert('请先加载Supabase库');
        return;
    }

    try {
        // 检查是否已存在测试发行方
        const { data: existing, error: checkError } = await supabase
            .from('issuers')
            .select('*')
            .eq('company_id', 'TEST001');

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            console.log('测试发行方已存在，账户信息：');
            console.log('公司ID: TEST001');
            console.log('密码: test1234');
            alert('测试发行方已存在\n公司ID: TEST001\n密码: test1234');
            return;
        }

        // 创建新的测试发行方
        const { data, error } = await supabase
            .from('issuers')
            .insert([{
                company_id: 'TEST001',
                password: 'test1234', // 注意：在生产环境中应使用加密存储
                company_name: '测试科技有限公司',
                company_website: 'https://example.com',
                contact_email: 'test@example.com'
            }]);

        if (error) throw error;

        console.log('测试发行方创建成功！');
        console.log('公司ID: TEST001');
        console.log('密码: test1234');
        alert('测试发行方创建成功\n公司ID: TEST001\n密码: test1234');

    } catch (err) {
        console.error('创建测试发行方失败:', err);
        alert('创建测试发行方失败，请检查控制台错误信息');
    }
}

// 当页面加载完成后执行
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // 如果在浏览器环境中，可以添加一个按钮来触发创建操作
        const button = document.createElement('button');
        button.textContent = '创建测试发行方账户';
        button.onclick = createTestIssuer;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        document.body.appendChild(button);
    });
} else {
    // 如果在Node.js环境中，直接执行（需要先安装supabase客户端库）
    console.log('在Node.js环境中运行，需要先安装supabase客户端库');
}

// 导出函数以便在控制台或其他脚本中调用
if (typeof window !== 'undefined') {
    window.createTestIssuer = createTestIssuer;
} else if (typeof module !== 'undefined') {
    module.exports = { createTestIssuer };
}