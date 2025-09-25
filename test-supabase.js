// Supabase Edge Function 测试脚本
// 这个脚本用于测试部署到Supabase的Edge Function是否正常工作

// 替换为您的Supabase Edge Function URL
supabaseFunctionUrl = "https://<您的项目引用ID>.functions.supabase.co/index";

// 测试函数
async function runTests() {
    console.log("=== TrueMark 验证器 Supabase Edge Function 测试 ===");
    
    // 1. 测试检查测试账户端点
    await testEndpoint("检查测试账户", "GET", `${supabaseFunctionUrl}/api/check-test-account`, null);
    
    // 2. 测试登录端点
    await testEndpoint("登录测试", "POST", `${supabaseFunctionUrl}/api/auth/login`, {
        companyId: "TEST001",
        password: "test1234"
    });
    
    // 3. 测试创建测试账户端点
    await testEndpoint("创建测试账户", "POST", `${supabaseFunctionUrl}/api/create-test-account`, null);
    
    console.log("\n=== 测试完成 ===");
    console.log("如果所有测试都失败，可能是因为：");
    console.log("1. Supabase Edge Function尚未正确部署");
    console.log("2. 环境变量配置不正确");
    console.log("3. CORS配置问题");
    console.log("请参考README_SUPABASE.md文件中的故障排除指南");
}

// 通用的端点测试函数
async function testEndpoint(name, method, url, data) {
    console.log(`\n[测试] ${name}`);
    console.log(`URL: ${url}`);
    console.log(`方法: ${method}`);
    
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
            console.log(`请求数据:`, data);
        }
        
        const startTime = Date.now();
        const response = await fetch(url, options);
        const endTime = Date.now();
        
        console.log(`响应状态: ${response.status} ${response.statusText}`);
        console.log(`响应时间: ${endTime - startTime}ms`);
        
        // 检查响应头
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        console.log(`响应头:`, headers);
        
        // 尝试解析响应数据
        try {
            const responseData = await response.json();
            console.log(`响应数据:`, responseData);
            
            // 检查是否成功
            if (response.ok) {
                console.log(`✅ ${name} 测试成功!`);
            } else {
                console.log(`❌ ${name} 测试失败: ${responseData.message || '未知错误'}`);
            }
        } catch (jsonError) {
            console.log(`❌ 解析响应JSON时出错: ${jsonError.message}`);
            // 尝试获取原始响应文本
            try {
                const text = await response.text();
                console.log(`原始响应文本: ${text}`);
            } catch (textError) {
                console.log('无法获取原始响应文本');
            }
        }
    } catch (error) {
        console.log(`❌ ${name} 测试失败: ${error.message}`);
        console.log(`错误详情:`, error);
    }
}

// 运行测试
if (typeof window !== 'undefined') {
    // 浏览器环境
    window.addEventListener('load', runTests);
} else {
    // Node.js环境
    runTests();
}

console.log("注意：请将脚本中的'supabaseFunctionUrl'替换为您实际的Supabase Edge Function URL");
console.log("在浏览器中，您可以直接在控制台运行runTests()函数重新运行测试");