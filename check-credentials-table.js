// 检查credentials表结构和权限的脚本

// 初始化Supabase客户端
const supabaseUrl = 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

// 检查credentials表的函数
async function checkCredentialsTable() {
    console.log('开始检查credentials表结构...');
    
    try {
        // 1. 尝试列出所有表以确认credentials表存在
        console.log('\n1. 检查数据库中的表列表:');
        try {
            // 在真实环境中，这可能需要特殊权限
            const { data: tables, error: tablesError } = await supabase
                .rpc('list_tables'); // 这可能需要在Supabase中创建相应的存储函数
            
            if (tablesError) {
                console.log('  无法直接获取表列表:', tablesError.message);
                console.log('  尝试其他方式检查...');
            } else {
                console.log('  数据库中的表:', tables);
            }
        } catch (e) {
            console.log('  获取表列表失败:', e.message);
        }
        
        // 2. 尝试查询credentials表的几行数据，确认表存在且有正确的结构
        console.log('\n2. 尝试查询credentials表数据:');
        const { data: credentials, error: credentialsError } = await supabase
            .from('credentials')
            .select('*')
            .limit(1);
        
        if (credentialsError) {
            console.error('  查询失败:', credentialsError);
            
            // 分析常见错误
            if (credentialsError.code === '42P01') {
                console.log('  错误分析: credentials表不存在');
            } else if (credentialsError.code === '42703') {
                console.log('  错误分析: 表中缺少必要的列');
            } else if (credentialsError.code === '42501') {
                console.log('  错误分析: 权限不足，无法访问表');
            }
        } else {
            console.log('  查询成功，表存在');
            if (credentials && credentials.length > 0) {
                console.log('  表结构示例:', credentials[0]);
                console.log('  表中包含的列:', Object.keys(credentials[0]));
            } else {
                console.log('  表存在但为空');
            }
        }
        
        // 3. 尝试创建一个测试凭证，检查插入权限
        console.log('\n3. 尝试插入测试凭证:');
        try {
            const testIssuerId = 'test-issuer-001'; // 与前端虚拟ID匹配
            const testVerificationCode = 'TEST' + Math.floor(Math.random() * 10000);
            
            const { data: insertedData, error: insertError } = await supabase
                .from('credentials')
                .insert([{
                    employee_name: '测试员工',
                    job_title: '测试职位',
                    employment_start_date: '2023-01-01',
                    employment_end_date: null,
                    verification_code: testVerificationCode,
                    issuer_id: testIssuerId,
                    description: '测试凭证'
                }]);
            
            if (insertError) {
                console.error('  插入失败:', insertError);
                if (insertError.code === '42703') {
                    console.log('  错误分析: 插入时列名不匹配');
                    console.log('  可能需要的列:', insertError.details);
                }
            } else {
                console.log('  插入成功！测试凭证已添加');
                
                // 清理测试数据
                await supabase
                    .from('credentials')
                    .delete()
                    .eq('verification_code', testVerificationCode);
                console.log('  测试数据已清理');
            }
        } catch (e) {
            console.error('  插入测试失败:', e);
        }
        
        console.log('\n检查完成。请根据以上信息修改前端代码以适配实际的数据库结构。');
        
    } catch (err) {
        console.error('检查过程中发生错误:', err);
    }
}

// 执行检查
checkCredentialsTable();