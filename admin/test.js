// 管理后台功能测试脚本
console.log('开始测试管理后台功能...');

// 测试管理员登录
async function testAdminLogin() {
    console.log('\n1. 测试管理员登录...');
    
    try {
        const response = await fetch('http://localhost:3000/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 管理员登录成功！');
              console.log('获取到的Token:', data.accessToken ? data.accessToken.substring(0, 30) + '...' : 'Token存在');
              console.log('管理员信息:', data.admin);
              return data.accessToken;
        } else {
            const error = await response.json();
            console.log('❌ 管理员登录失败:', error.error || '未知错误');
            return null;
        }
    } catch (error) {
        console.log('❌ 登录请求失败:', error.message);
        return null;
    }
}

// 测试获取注册申请列表
async function testGetRegistrations(token) {
    if (!token) {
        console.log('❌ 跳过获取注册列表测试（需要登录Token）');
        return [];
    }
    
    console.log('\n2. 测试获取注册申请列表...');
    
    try {
        const response = await fetch('http://localhost:3000/api/admin/registrations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ 获取注册申请列表成功！共 ${data.length} 条记录`);
            
            // 显示每条记录的基本信息
            data.forEach(item => {
                console.log(`  - ID: ${item.id}, 企业: ${item.company_name}, 状态: ${item.status}`);
            });
            
            return data;
        } else {
            const error = await response.json();
            console.log('❌ 获取注册申请列表失败:', error.error || '未知错误');
            return [];
        }
    } catch (error) {
        console.log('❌ 获取注册列表请求失败:', error.message);
        return [];
    }
}

// 测试批准注册申请
async function testApproveRegistration(token, registrationId) {
    if (!token || !registrationId) {
        console.log('❌ 跳过批准注册测试（需要登录Token和待审批ID）');
        return false;
    }
    
    console.log(`\n3. 测试批准注册申请 (ID: ${registrationId})...`);
    
    try {
        const response = await fetch(`http://localhost:3000/api/admin/registrations/${registrationId}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 批准注册申请成功！');
            console.log('更新后的状态:', data.registration.status);
            console.log('审核时间:', data.registration.reviewed_at);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ 批准注册申请失败:', error.error || '未知错误');
            return false;
        }
    } catch (error) {
        console.log('❌ 批准请求失败:', error.message);
        return false;
    }
}

// 测试拒绝注册申请
async function testRejectRegistration(token, registrationId) {
    if (!token || !registrationId) {
        console.log('❌ 跳过拒绝注册测试（需要登录Token和待审批ID）');
        return false;
    }
    
    console.log(`\n4. 测试拒绝注册申请 (ID: ${registrationId})...`);
    
    try {
        const response = await fetch(`http://localhost:3000/api/admin/registrations/${registrationId}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: '测试拒绝理由'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 拒绝注册申请成功！');
            console.log('更新后的状态:', data.registration.status);
            console.log('拒绝理由:', data.registration.rejection_reason);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ 拒绝注册申请失败:', error.error || '未知错误');
            return false;
        }
    } catch (error) {
        console.log('❌ 拒绝请求失败:', error.message);
        return false;
    }
}

// 测试获取单个注册申请详情
async function testGetSingleRegistration(token, registrationId) {
    if (!token || !registrationId) {
        console.log('❌ 跳过获取单个注册详情测试（需要登录Token和ID）');
        return;
    }
    
    console.log(`\n5. 测试获取单个注册申请详情 (ID: ${registrationId})...`);
    
    try {
        const response = await fetch(`http://localhost:3000/api/admin/registrations/${registrationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 获取单个注册申请详情成功！');
            console.log('详细信息:', JSON.stringify(data, null, 2));
        } else {
            const error = await response.json();
            console.log('❌ 获取单个注册申请详情失败:', error.error || '未知错误');
        }
    } catch (error) {
        console.log('❌ 获取详情请求失败:', error.message);
    }
}

// 执行所有测试
async function runAllTests() {
    // 1. 管理员登录
    const token = await testAdminLogin();
    
    // 2. 获取注册申请列表
    const registrations = await testGetRegistrations(token);
    
    // 找到一个待审批的申请用于测试
    const pendingRegistration = registrations.find(r => r.status === 'pending');
    
    // 3. 测试批准功能（如果有待审批的申请）
    if (pendingRegistration) {
        await testApproveRegistration(token, pendingRegistration.id);
    }
    
    // 重新获取列表，找到另一个待审批的申请用于拒绝测试
    const updatedRegistrations = await testGetRegistrations(token);
    const anotherPendingRegistration = updatedRegistrations.find(r => r.status === 'pending');
    
    // 4. 测试拒绝功能（如果有另一个待审批的申请）
    if (anotherPendingRegistration) {
        await testRejectRegistration(token, anotherPendingRegistration.id);
    }
    
    // 5. 测试获取单个详情
    if (registrations.length > 0) {
        await testGetSingleRegistration(token, registrations[0].id);
    }
    
    console.log('\n========================================');
    console.log('测试完成！请在浏览器中访问 http://localhost:3000/admin 体验管理后台');
    console.log('管理员账号: admin');
    console.log('管理员密码: admin123');
    console.log('========================================');
}

// 运行测试
if (typeof window === 'undefined') {
    // Node.js环境
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    global.fetch = fetch;
    runAllTests();
} else {
    // 浏览器环境
    runAllTests();
}