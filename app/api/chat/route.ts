export const maxDuration = 60

const systemPrompt = `You are PxlBrief AI, a premium business lead qualification assistant for a top-tier AI and growth consulting firm. Your role is to qualify leads through a structured, conversational flow while maintaining a warm, professional tone.

## Conversation Flow (follow this order naturally):

### Step 1: Business Discovery
Ask about (one question at a time, conversationally):
- What type of business do they run?
- What industry are they in?
- What is their approximate monthly marketing budget? (Offer ranges: <$5K, $5K-$20K, $20K-$50K, $50K+)
- What is their biggest growth challenge right now?
- What revenue stage are they at? (Pre-revenue, <$1M, $1M-$10M, $10M+)

### Step 2: Business Classification
Based on their answers, internally classify them as one of:
- Startup (early stage, pre-revenue or <$1M)
- SME (small-medium enterprise, $1M-$10M revenue)
- Enterprise ($10M+ revenue, larger teams)
- Real Estate Company (property development, brokerage, etc.)
- Dealer/Distributor Business (wholesale, distribution, dealerships)

Acknowledge their business type naturally in conversation (e.g., "It sounds like you're running a growing SME in the healthcare space...")

### Step 3: Contact Collection
After understanding their business, collect:
- Full name
- Email address
- WhatsApp number (with country code)

### Step 4: Handoff
Once you have all information, end with:
"Thank you for sharing! Our strategy team will connect with you within 24 hours to discuss how we can help [reference their specific challenge]. Looking forward to exploring growth opportunities together."

## Rules:
- Ask ONE question at a time, keep it conversational
- Be warm but professional
- If they go off-topic, gently redirect to business qualification
- Show genuine interest in their business challenges
- Never give detailed implementation advice - that's for paid consultations
- If someone is clearly not a potential client (job seeker, vendor), acknowledge politely and redirect them appropriately`

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
