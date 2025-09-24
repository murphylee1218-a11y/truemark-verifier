// 这个脚本需要先安装@supabase/supabase-js包
// 运行命令: npm install @supabase/supabase-js

// 检查Supabase数据库中的测试发行方账户信息
const supabaseUrl = 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';

async function checkIssuerAccount() {
    try {
        // 使用require来导入Supabase客户端
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('连接到Supabase...');
        
        // 1. 首先尝试获取issuers表的结构信息
        // 注意：这需要在Supabase Dashboard中启用pg_stat_user_tables等系统表的访问权限
        console.log('尝试获取issuers表的列信息...');
        
        // 2. 如果无法直接获取表结构，尝试查询前几行数据来了解列名
        console.log('尝试查询issuers表的前5行数据...');
        const { data: issuerData, error: issuerError } = await supabase
            .from('issuers')
            .select('*')
            .limit(5);
        
        console.log('issuers表查询结果:', { issuerData, issuerError });
        
        if (issuerError) {
            console.error('查询issuers表失败:', issuerError);
            
            // 尝试获取数据库中所有表的信息
            console.log('尝试获取数据库中所有表的信息...');
            const { data: tablesData, error: tablesError } = await supabase
                .rpc('list_tables');
            
            console.log('数据库表列表:', { tablesData, tablesError });
            
            // 如果list_tables函数不可用，尝试直接查询系统表
            if (tablesError) {
                console.log('尝试直接查询系统表...');
                try {
                    const { data: systemTablesData } = await supabase
                        .from('pg_catalog.pg_tables')
                        .select('tablename')
                        .eq('schemaname', 'public');
                    
                    console.log('公共模式下的表:', systemTablesData);
                } catch (err) {
                    console.error('查询系统表失败:', err);
                }
            }
            
            return;
        }
        
        if (issuerData && issuerData.length > 0) {
            console.log('issuers表存在，前1条记录:', issuerData[0]);
            console.log('表中的列名:', Object.keys(issuerData[0]));
        } else {
            console.log('issuers表为空或不存在');
        }
        
    } catch (err) {
        console.error('检查过程中出错:', err);
        console.log('请先运行: npm install @supabase/supabase-js');
    }
}

// 执行检查
checkIssuerAccount();