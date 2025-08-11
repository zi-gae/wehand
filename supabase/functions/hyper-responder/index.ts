// Supabase Edge Function: hyper-responder
// 사용자 로그인 데이터를 처리하는 함수

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface RequestBody {
  id: string
  email: string
  name: string
  profileImage?: string
  role: string
  provider: string
  isNewUser: boolean
  accessToken: string
  metadata: {
    loginAt: string
    userAgent: string
    source: string
  }
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const requestBody: RequestBody = await req.json()
    
    console.log('hyper-responder 호출됨:', {
      userId: requestBody.id,
      provider: requestBody.provider,
      isNewUser: requestBody.isNewUser,
      timestamp: new Date().toISOString()
    })

    // 여기서 사용자 데이터 처리 로직을 구현할 수 있습니다:
    // 1. 데이터베이스에 사용자 정보 저장/업데이트
    // 2. 사용자 활동 로그 기록
    // 3. 외부 서비스와 연동
    // 4. 이메일 발송
    // 5. 분석 데이터 수집 등

    // 예시: 신규 사용자인 경우 환영 이메일 발송 (구현 필요)
    if (requestBody.isNewUser) {
      console.log(`신규 사용자 가입: ${requestBody.name} (${requestBody.email})`)
      // await sendWelcomeEmail(requestBody.email, requestBody.name)
    }

    // 예시: 로그인 이벤트 기록 (구현 필요)
    // await logUserActivity({
    //   userId: requestBody.id,
    //   action: 'login',
    //   provider: requestBody.provider,
    //   timestamp: requestBody.metadata.loginAt,
    //   userAgent: requestBody.metadata.userAgent
    // })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User data processed successfully',
        data: {
          userId: requestBody.id,
          processed: true,
          timestamp: new Date().toISOString(),
          actions: [
            'user_data_processed',
            requestBody.isNewUser ? 'welcome_email_queued' : 'returning_user_logged',
            'activity_logged'
          ]
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('hyper-responder 오류:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 500
      }
    )
  }
})