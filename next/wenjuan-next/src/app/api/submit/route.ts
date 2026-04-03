import { NextResponse } from 'next/server'
import { createServerApiUrl } from '@/lib/server-api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(createServerApiUrl('/h5/submitAnswer'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: '提交失败' },
      { status: 500 }
    )
  }
} 
