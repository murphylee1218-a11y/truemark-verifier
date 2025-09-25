const fs = require('fs');
const path = require('path');

try {
    // 读取整个HTML文件
    const htmlContent = fs.readFileSync('./issuer.html', 'utf8');
    
    // 提取所有JavaScript代码块
    const scriptBlocks = htmlContent.match(/<script\b[^>]*>([\s\S]*?)<\/script>/g) || [];
    
    console.log(`找到 ${scriptBlocks.length} 个脚本块`);
    
    // 检查每个脚本块
    scriptBlocks.forEach((block, index) => {
        // 去掉script标签
        const jsCode = block.replace(/<script\b[^>]*>|<\/script>/g, '').trim();
        
        if (jsCode) {
            console.log(`\n检查脚本块 #${index + 1}:`);
            
            // 按行分割代码
            const lines = jsCode.split('\n');
            console.log(`  脚本包含 ${lines.length} 行代码`);
            
            // 尝试逐块检查代码
            let currentCode = '';
            let errorFound = false;
            
            for (let i = 0; i < lines.length; i++) {
                // 添加当前行
                currentCode += lines[i] + '\n';
                
                try {
                    // 尝试解析当前累积的代码
                    new Function(currentCode);
                } catch (e) {
                    // 只报告第一个错误
                    if (!errorFound) {
                        console.error(`  语法错误在第 ${i + 1} 行附近`);
                        console.error(`  错误信息: ${e.message}`);
                        
                        // 显示错误行附近的代码
                        const start = Math.max(0, i - 5);
                        const end = Math.min(lines.length, i + 6);
                        
                        console.log('\n  错误行附近的代码:');
                        for (let j = start; j < end; j++) {
                            const prefix = j === i ? '>>> ' : '    ';
                            console.log(`${prefix}${j + 1}: ${lines[j]}`);
                        }
                        
                        // 尝试检查特定的问题模式
                        console.log('\n  检查特殊问题模式:');
                        if (lines[i].includes(';;')) {
                            console.log(`  发现重复分号在第 ${i + 1} 行: ${lines[i]}`);
                        }
                        if (lines[i].includes('; }') || lines[i].includes(';}')) {
                            console.log(`  发现可疑的分号+大括号在第 ${i + 1} 行: ${lines[i]}`);
                        }
                        if (lines[i].match(/function\s+\w+\s*\(.*\)\s*\{?\s*;/)) {
                            console.log(`  发现函数声明后有分号在第 ${i + 1} 行: ${lines[i]}`);
                        }
                        
                        errorFound = true;
                        // 不退出循环，继续检查
                    }
                }
            }
            
            // 输出整体结果
            if (!errorFound) {
                console.log('  所有代码行语法检查通过');
            }
        }
    });
    
} catch (err) {
    console.error('读取文件时出错:', err);
}