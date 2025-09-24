// 修复Supabase数据库中的issuers表结构
const supabaseUrl = 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';

async function fixDatabase() {
    try {
        // 使用require来导入Supabase客户端
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('连接到Supabase...');
        
        // 1. 尝试向issuers表添加缺失的列
        console.log('尝试添加缺失的列到issuers表...');
        
        try {
            // 注意：在Supabase中，我们通常使用Supabase Dashboard来管理表结构
            // 这里我们尝试使用SQL语句来修改表结构
            const { error: addCompanyIdError } = await supabase.rpc('execute_sql', {
                sql: 'ALTER TABLE issuers ADD COLUMN IF NOT EXISTS company_id TEXT UNIQUE;'
            });
            
            if (addCompanyIdError) {
                console.error('添加company_id列失败:', addCompanyIdError);
                console.log('可能需要在Supabase Dashboard手动添加列');
            }
            
            const { error: addPasswordError } = await supabase.rpc('execute_sql', {
                sql: 'ALTER TABLE issuers ADD COLUMN IF NOT EXISTS password TEXT;'
            });
            
            if (addPasswordError) {
                console.error('添加password列失败:', addPasswordError);
                console.log('可能需要在Supabase Dashboard手动添加列');
            }
            
            const { error: addWebsiteError } = await supabase.rpc('execute_sql', {
                sql: 'ALTER TABLE issuers ADD COLUMN IF NOT EXISTS company_website TEXT;'
            });
            
            if (addWebsiteError) {
                console.error('添加company_website列失败:', addWebsiteError);
            }
            
            const { error: addEmailError } = await supabase.rpc('execute_sql', {
                sql: 'ALTER TABLE issuers ADD COLUMN IF NOT EXISTS contact_email TEXT;'
            });
            
            if (addEmailError) {
                console.error('添加contact_email列失败:', addEmailError);
            }
            
        } catch (err) {
            console.error('修改表结构时出错:', err);
            console.log('可能需要在Supabase Dashboard手动添加缺失的列');
            console.log('需要添加的列: company_id (TEXT, UNIQUE), password (TEXT), company_website (TEXT), contact_email (TEXT)');
        }
        
        // 2. 直接尝试创建一个新的测试发行方账户（不依赖表结构修改）
        console.log('尝试创建一个新的测试发行方账户...');
        
        try {
            // 首先删除现有的测试账户（如果有）
            const { error: deleteError } = await supabase
                .from('issuers')
                .delete()
                .ilike('company_name', '%测试%');
            
            if (deleteError) {
                console.log('删除现有测试账户时出错:', deleteError);
            }
            
            // 创建一个新的测试发行方账户
            const { data, error: insertError } = await supabase
                .from('issuers')
                .insert([{
                    company_id: 'TEST001',
                    password: 'test1234',
                    company_name: '测试科技有限公司',
                    company_website: 'https://example.com',
                    contact_email: 'test@example.com'
                }]);
            
            if (insertError) {
                console.error('创建测试账户失败:', insertError);
                console.log('这可能是因为表结构不完整');
                console.log('请在Supabase Dashboard检查issuers表的结构，并确保包含所有必要的列');
            } else {
                console.log('测试账户创建成功！');
                console.log('公司ID: TEST001');
                console.log('密码: test1234');
            }
            
        } catch (err) {
            console.error('创建测试账户时出错:', err);
        }
        
        // 3. 检查最终的表结构
        const { data: finalData, error: finalError } = await supabase
            .from('issuers')
            .select('*')
            .limit(1);
        
        if (finalError) {
            console.error('检查最终表结构失败:', finalError);
        } else if (finalData && finalData.length > 0) {
            console.log('最终表结构中的列:', Object.keys(finalData[0]));
        }
        
    } catch (err) {
        console.error('修复过程中出错:', err);
    }
}

// 执行修复
fixDatabase();