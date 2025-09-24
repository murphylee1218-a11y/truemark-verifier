// 初始化 Supabase 客户端（使用你的实际项目信息）
// 移除Supabase密钥，改为通过后端API验证凭证
console.log('凭证验证页面已加载！');// 获取页面元素
const startScannerBtn = document.getElementById('start-scanner');
const stopScannerBtn = document.getElementById('stop-scanner');
const verifyBtn = document.getElementById('verify-btn');
const verificationCodeInput = document.getElementById('verification-code');
const resultDiv = document.getElementById('result');

let html5QrCode; // 用于存储扫描器实例

// 1. 初始化二维码扫描器
function initScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");
}

// 2. 启动扫描函数
async function startScan() {
    try {
        const cameraId = await Html5Qrcode.getCameras().then(cameras => {
            if (cameras && cameras.length) {
                return cameras[0].id; // 使用第一个摄像头
            }
            throw new Error('未找到摄像头');
        });

        await html5QrCode.start(
            cameraId,
            {
                fps: 10, // 帧率
                qrbox: { width: 250, height: 250 } // 扫描框大小
            },
            onScanSuccess, // 扫描成功的回调函数
            onScanFailure // 扫描失败的回调函数
        );

        // 切换按钮显示
        startScannerBtn.style.display = 'none';
        stopScannerBtn.style.display = 'inline-block';
        console.log('二维码扫描器启动成功');

    } catch (err) {
        console.error('启动扫描器失败:', err);
        showResult('无法启动摄像头，请检查权限或尝试手动输入验证码。', 'error');
    }
}

// 3. 扫描成功回调函数
function onScanSuccess(decodedText, decodedResult) {
    console.log(`扫描结果: ${decodedText}`);
    
    // 将扫描到的代码填入输入框
    verificationCodeInput.value = decodedText;
    
    // 自动停止扫描
    stopScan();
    
    // 自动执行验证
    verifyCredential(decodedText);
}

// 4. 扫描失败回调函数
function onScanFailure(error) {
    // 可以静默失败，不需要特别处理
    // console.log('扫描失败:', error);
}

// 5. 停止扫描函数
function stopScan() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            console.log('二维码扫描器已停止');
            // 切换按钮显示
            startScannerBtn.style.display = 'inline-block';
            stopScannerBtn.style.display = 'none';
        }).catch(err => {
            console.error('停止扫描器失败:', err);
        });
    }
}

// 6. 核心功能：验证凭证函数 - 通过后端API验证
async function verifyCredential(verificationCode) {
    // 清空之前的结果
    resultDiv.innerHTML = '验证中...';
    resultDiv.className = 'result-section';
    resultDiv.style.display = 'block';

    try {
        // 通过后端API验证凭证
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ verification_code: verificationCode.trim() })
        });

        const data = await response.json();

        if (response.ok && data.valid) {
            // 验证成功
            const credential = data.data;
            const endDate = credential.employment_end_date || '至今';
            
            const successHTML = `
                <h3>✅ 验证成功！</h3>
                <p><strong>该凭证已验证有效</strong></p>
                <p><strong>姓名：</strong>${credential.employee_name}</p>
                <p><strong>职位：</strong>${credential.job_title}</p>
                <p><strong>公司：</strong>${credential.company_name}</p>
                <p><strong>在职时间：</strong>${credential.employment_start_date} 至 ${endDate}</p>
                <p><em>凭证由 <strong>${credential.company_name}</strong> 通过 TrueMark 签发</em></p>
            `;
            showResult(successHTML, 'success');
        } else if (!data.valid) {
            // 验证失败
            showResult('❌ 未找到该凭证记录，请与候选人核实验证码是否正确。', 'error');
        } else {
            // 服务器错误
            showResult('❌ 验证失败：服务器错误，请稍后重试。', 'error');
        }

    } catch (error) {
        console.error('验证过程中出错:', error);
        showResult('❌ 验证失败：网络连接错误，请检查网络后重试。', 'error');
    }
}

// 7. 显示验证结果函数
function showResult(message, type) {
    resultDiv.innerHTML = message;
    resultDiv.className = `result-section ${type}`;
}

// 8. 绑定按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后初始化扫描器
    initScanner();
    
    // 启动扫描按钮
    startScannerBtn.addEventListener('click', startScan);
    
    // 停止扫描按钮
    stopScannerBtn.addEventListener('click', stopScan);
    
    // 手动验证按钮
    verifyBtn.addEventListener('click', function() {
        const code = verificationCodeInput.value.trim();
        if (code) {
            verifyCredential(code);
        } else {
            showResult('请输入验证码', 'error');
        }
    });

    // 按回车键也可以触发验证
    verificationCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyBtn.click();
        }
    });
});