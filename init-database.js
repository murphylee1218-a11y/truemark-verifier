// 数据库初始化脚本 - 为微信小程序与Web站共享数据库创建所需的表结构
const supabaseUrl = 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';

async function initializeDatabase() {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('连接到Supabase...');
        
        // 1. 检查表是否存在并创建必要的表
        
        // 首先，尝试检查表是否存在
        console.log('检查数据库表结构...');
        
        // 尝试创建issuers表（发行方表）
        console.log('尝试创建issuers表...');
        try {
            // 使用Supabase的API方式插入数据来验证表结构
            // 如果表不存在或结构不正确，将失败
            const { data, error } = await supabase
                .from('issuers')
                .select('*')
                .limit(1);
                
            if (!error) {
                console.log('issuers表已存在');
            }
        } catch (err) {
            console.error('检查issuers表时出错:', err);
            console.log('注意：可能需要在Supabase Dashboard中手动创建表');
        }
        
        // 尝试创建credentials表（凭证表）
        console.log('尝试创建credentials表...');
        try {
            const { data, error } = await supabase
                .from('credentials')
                .select('*')
                .limit(1);
                
            if (!error) {
                console.log('credentials表已存在');
            }
        } catch (err) {
            console.error('检查credentials表时出错:', err);
            console.log('注意：可能需要在Supabase Dashboard中手动创建表');
        }
        
        // 尝试创建registrations表（注册申请表）
        console.log('尝试创建registrations表...');
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .limit(1);
                
            if (!error) {
                console.log('registrations表已存在');
            }
        } catch (err) {
            console.error('检查registrations表时出错:', err);
            console.log('注意：可能需要在Supabase Dashboard中手动创建表');
        }
        
        // 2. 为微信小程序添加必要的新表：wechat_users表
        console.log('尝试创建wechat_users表（用于微信小程序用户）...');
        try {
            const { data, error } = await supabase
                .from('wechat_users')
                .select('*')
                .limit(1);
                
            if (!error) {
                console.log('wechat_users表已存在');
            }
        } catch (err) {
            console.error('检查wechat_users表时出错:', err);
            console.log('注意：需要在Supabase Dashboard中手动创建wechat_users表');
        }
        
        // 3. 输出所有表的信息
        console.log('\n数据库表结构检查完成！');
        console.log('以下是推荐的表结构设计：\n');
        
        console.log('1. issuers表（发行方表）：');
        console.log('   - id: UUID (主键)');
        console.log('   - company_id: VARCHAR (企业标识)');
        console.log('   - company_name: VARCHAR (企业名称)');
        console.log('   - company_website: VARCHAR (企业网站)');
        console.log('   - contact_email: VARCHAR (联系邮箱)');
        console.log('   - username: VARCHAR (登录用户名)');
        console.log('   - password: VARCHAR (加密后的密码)');
        console.log('   - created_at: TIMESTAMP (创建时间)');
        console.log('   - updated_at: TIMESTAMP (更新时间)');
        
        console.log('\n2. credentials表（凭证表）：');
        console.log('   - id: UUID (主键)');
        console.log('   - issuer_id: UUID (关联issuers表的外键)');
        console.log('   - employee_name: VARCHAR (员工姓名)');
        console.log('   - job_title: VARCHAR (职位)');
        console.log('   - employment_start_date: DATE (入职日期)');
        console.log('   - employment_end_date: DATE (离职日期，可为空)');
        console.log('   - verification_code: VARCHAR (验证码)');
        console.log('   - verified: BOOLEAN (是否已验证)');
        console.log('   - created_at: TIMESTAMP (创建时间)');
        console.log('   - updated_at: TIMESTAMP (更新时间)');
        
        console.log('\n3. registrations表（注册申请表）：');
        console.log('   - id: UUID (主键)');
        console.log('   - company_name: VARCHAR (企业名称)');
        console.log('   - contact_email: VARCHAR (联系邮箱)');
        console.log('   - contact_phone: VARCHAR (联系电话)');
        console.log('   - status: VARCHAR (状态：pending, approved, rejected)');
        console.log('   - created_at: TIMESTAMP (申请时间)');
        console.log('   - processed_at: TIMESTAMP (处理时间)');
        
        console.log('\n4. wechat_users表（微信小程序用户表）：');
        console.log('   - id: UUID (主键)');
        console.log('   - openid: VARCHAR (微信用户唯一标识)');
        console.log('   - unionid: VARCHAR (微信开放平台唯一标识，可选)');
        console.log('   - nickname: VARCHAR (微信昵称)');
        console.log('   - avatar_url: VARCHAR (头像URL)');
        console.log('   - gender: INTEGER (性别)');
        console.log('   - created_at: TIMESTAMP (首次登录时间)');
        console.log('   - last_login_at: TIMESTAMP (最后登录时间)');
        
        console.log('\n5. wechat_verifications表（微信小程序验证记录表）：');
        console.log('   - id: UUID (主键)');
        console.log('   - wechat_user_id: UUID (关联wechat_users表的外键)');
        console.log('   - credential_id: UUID (关联credentials表的外键)');
        console.log('   - verification_time: TIMESTAMP (验证时间)');
        console.log('   - ip_address: VARCHAR (IP地址)');
        console.log('   - device_info: VARCHAR (设备信息)');
        
        console.log('\n请在Supabase Dashboard中创建或修改这些表，确保它们具有正确的结构。');
        console.log('完成后，可以继续开发微信小程序与这些表的集成。');
        
    } catch (err) {
        console.error('数据库初始化过程中出错:', err);
        console.log('请确保已安装@supabase/supabase-js包：npm install @supabase/supabase-js');
    }
}

// 执行初始化
initializeDatabase();