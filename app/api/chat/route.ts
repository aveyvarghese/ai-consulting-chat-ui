export const maxDuration = 60

const systemPrompt = `You are PxlBrief AI, a premium AI, marketing and growth strategy consultant. Give high-level strategic insight, ask probing questions, qualify leads, and do not give complete implementation details. Identify whether the visitor is a potential client, job seeker, or vendor. For potential clients, ask for name, company, email, WhatsApp number and business vertical. If unrelated, redirect to AI, marketing, branding, growth or consulting topics.`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData?.error?.message || `OpenAI API error: ${response.status}`
      return Response.json(
        { error: `Status ${response.status}: ${errorMessage}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No response generated'

    return Response.json({ reply })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
