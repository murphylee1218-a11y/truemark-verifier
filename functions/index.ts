// Supabase Edge Function 入口文件
// 这是一个兼容Deno的函数，用于在Supabase上部署TrueMark验证系统

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0';

// 初始化Supabase客户端
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ryvpfeidqdsrukfzwbmf.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dnBmZWlkcWRzcnVrZnp3Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODEwNzAsImV4cCI6MjA3NDI1NzA3MH0.dRw-hjqnNfKpYwzmfX3JkTGUl__w82jApdkU-Pyy6ZE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (...args) => fetch(...args)
  }
});

// 处理CORS请求
function handleOptions(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new Response(null, { headers });
}

// 解析JSON请求体
async function parseJsonBody(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch (error) {
    return null;
  }
}

// 生成随机验证码
function generateVerificationCode(length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除0, O, I, L等容易混淆的字符
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

// 处理登录请求
async function handleLogin(req: Request) {
  const body = await parseJsonBody(req);
  const { companyId, password } = body;
  
  // 硬编码的测试账户验证（与原server.js保持一致）
  if (companyId === 'TEST001' && password === 'test1234') {
    // 在实际Deno环境中，应使用JWT库生成令牌
    // 这里为了演示返回一个模拟的令牌
    const mockToken = 'mock-jwt-token-for-testing';
    return new Response(
      JSON.stringify({
        success: true,
        accessToken: mockToken,
        user: {
          companyId: 'TEST001',
          companyName: '测试科技有限公司',
          role: 'issuer'
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );
  }
  
  return new Response(
    JSON.stringify({ success: false, message: '企业ID或密码错误' }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 401
    }
  );
}

// 处理验证凭证请求
async function handleVerifyCredential(req: Request, code: string) {
  // 模拟验证过程
  if (code && code.length > 0) {
    return new Response(
      JSON.stringify({
        valid: true,
        data: {
          credential_id: 'test-credential-001',
          verification_code: code,
          employee_id: 'EMP001',
          employee_name: '张三',
          department: '技术部',
          position: '高级工程师',
          employment_start_date: '2020-01-01',
          employment_end_date: '2025-12-31',
          company_name: '测试科技有限公司'
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );
  }
  
  return new Response(
    JSON.stringify({ valid: false, message: '无效的验证码' }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 400
    }
  );
}

// 处理创建测试账户请求
async function handleCreateTestAccount() {
  return new Response(
    JSON.stringify({ success: true, message: '测试账户创建成功' }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    }
  );
}

// 处理检查测试账户请求
async function handleCheckTestAccount() {
  return new Response(
    JSON.stringify({ exists: true }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    }
  );
}

// 辅助函数: 验证JWT（简化版）
function verifyJWT(token: string): boolean {
  // 实际环境中应该使用JWT库和正确的密钥进行验证
  return token === 'valid-token';
}

// 主处理函数
async function handler(req: Request): Promise<Response> {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  const url = new URL(req.url);
  const path = url.pathname;
  const origin = req.headers.get('Origin') || '*';

  // 基础响应选项
  const baseResponseOptions = {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    }
  };

  try {
    // API 端点路由
    if (path === '/api/auth/login') {
      // 登录端点
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          ...baseResponseOptions,
          status: 405
        });
      }

      const body = await parseJsonBody(req);
      const { companyId, password } = body;

      // 验证用户凭据
      if (companyId === 'TEST001' && password === 'test1234') {
        // 在实际Deno环境中，应使用JWT库生成令牌
        // 这里为了演示返回一个模拟的令牌
        const mockToken = 'mock-jwt-token-for-testing';
        return new Response(
          JSON.stringify({
            success: true,
            accessToken: mockToken,
            user: {
              companyId: 'TEST001',
              companyName: '测试科技有限公司',
              role: 'issuer'
            }
          }),
          baseResponseOptions
        );
      }

      return new Response(
        JSON.stringify({ error: '企业ID或密码错误' }),
        {
          ...baseResponseOptions,
          status: 401
        }
      );
    }

    else if (path === '/api/verify') {
      // 验证凭证端点
      if (req.method === 'GET') {
        const code = url.searchParams.get('code');
        if (!code) {
          return new Response(JSON.stringify({ error: '验证码是必需的' }), {
            ...baseResponseOptions,
            status: 400
          });
        }
        return handleVerifyCredential(req, code);
      } else if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        return handleVerifyCredential(req, body?.code || '');
      } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          ...baseResponseOptions,
          status: 405
        });
      }
    }

    else if (path === '/api/create-test-account') {
      // 创建测试账户端点
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          ...baseResponseOptions,
          status: 405
        });
      }

      return handleCreateTestAccount();
    }

    else if (path === '/api/check-test-account') {
      // 检查测试账户端点
      if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          ...baseResponseOptions,
          status: 405
        });
      }

      return handleCheckTestAccount();
    }

    // 静态文件服务 - 仅在本地开发环境使用
    // 注意: 在生产环境中，静态文件应该通过Supabase Storage或其他CDN提供
    else if (path === '/') {
      return new Response("TrueMark Verifier API is running", baseResponseOptions);
    }

    // 未找到路由
    return new Response(JSON.stringify({ error: 'Not found' }), {
      ...baseResponseOptions,
      status: 404
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      ...baseResponseOptions,
      status: 500
    });
  }
}

// 启动服务器
serve(handler);

// 导出handler用于Supabase Edge Functions
export default handler;