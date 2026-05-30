import { z } from "zod"

export const maxDuration = 30

const toolSchema = z.enum([
  "positioning",
  "campaign",
  "scorecard",
  "roi",
  "recommender",
])

const bodySchema = z.object({
  tool: toolSchema,
  inputs: z.record(z.unknown()),
  directionalOutput: z.record(z.unknown()),
})

const sectionSchema = z.object({
  label: z.string().min(2).max(80),
  value: z.string().min(1).max(900).optional(),
  items: z.array(z.string().min(1).max(280)).max(6).optional(),
})

const readoutSchema = z.object({
  sections: z.array(sectionSchema).min(3).max(10),
})

const toolInstructions: Record<z.infer<typeof toolSchema>, string> = {
  positioning: `Return exactly these sections:
- Refined positioning statement
- Stronger brand promise
- Sharper tagline options (items, exactly 3)
- Communication pillars (items, exactly 4)
- Website hero copy suggestion
- Campaign messaging angle
- Recommended next PxlBrief service`,
  campaign: `Return exactly these sections:
- Campaign concept
- Core audience insight
- Ad hooks (items, exactly 3)
- Recommended funnel
- Suggested content formats (items, 3 to 5)
- Landing page angle
- Retargeting idea
- CTA recommendation
- Recommended next PxlBrief service`,
  scorecard: `Return exactly these sections:
- Score interpretation
- Biggest bottleneck
- First 3 improvement priorities (items, exactly 3)
- 30-day action plan
- Recommended first system to build`,
  roi: `Return exactly these sections:
- Productivity leakage interpretation
- Highest automation priority
- Suggested workflow automation
- Implementation sequence
- Risk if ignored`,
  recommender: `Return exactly these sections:
- Why the recommended service fits
- Hidden business problem likely underneath
- What to diagnose first
- Suggested audit scope
- Next best action`,
}

const systemPrompt = `You are a senior strategist for PxlBrief.
Create concise directional strategic readouts for AI Lab tools.

PxlBrief scope only:
- AI implementation and automation
- Brand strategy and positioning
- Digital marketing and performance growth
- Website, SEO, AEO, and GEO
- Market research and business intelligence
- CRM, dashboards, and sales enablement

Rules:
- Output ONLY valid JSON: {"sections":[{"label":"...","value":"..."},{"label":"...","items":["..."]}]}.
- Keep outputs compact and business-consulting oriented.
- No hype, no guaranteed results, no fake claims.
- Do not say "as an AI".
- Make it clear through the substance that this is directional, not a full consulting diagnosis.
- If input is vague, still provide a useful directional readout and suggest running the AI Growth Diagnostic.
- Recommended services must be from PxlBrief's scope.`

function fallbackReadout(tool: z.infer<typeof toolSchema>) {
  const common = {
    sections: [
      {
        label: "Directional readout unavailable",
        value:
          "The AI readout could not be generated right now. Use the instant directional result and run the AI Growth Diagnostic for a deeper review.",
      },
      {
        label: "Recommended next step",
        value: "Run My Growth Diagnostic",
      },
      {
        label: "Recommended next PxlBrief service",
        value:
          tool === "positioning"
            ? "Brand Strategy & Positioning"
            : tool === "roi"
              ? "AI Implementation & Automation"
              : "AI Growth Audit",
      },
    ],
  }
  return common
}

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "AI readout is not configured" }, { status: 503 })
    }

    const { tool, inputs, directionalOutput } = parsed.data
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              tool,
              requiredOutput: toolInstructions[tool],
              inputs,
              directionalOutput,
            }),
          },
        ],
        temperature: 0.35,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    })

    if (!res.ok) {
      return Response.json({ error: "AI readout unavailable" }, { status: 502 })
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content
    if (typeof raw !== "string") {
      return Response.json(fallbackReadout(tool))
    }

    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return Response.json(fallbackReadout(tool))
    }

    const readout = readoutSchema.safeParse(json)
    if (!readout.success) {
      return Response.json(fallbackReadout(tool))
    }

    return Response.json(readout.data)
  } catch {
    return Response.json({ error: "Unable to generate AI readout" }, { status: 500 })
  }
}
