import { z } from "zod"

export const maxDuration = 30

const toolSchema = z.enum([
  "positioning",
  "campaign",
  "scorecard",
  "roi",
  "recommender",
  "instagram-audit",
  "linkedin-audit",
  "youtube-audit",
  "seo-audit",
  "aeo-audit",
  "geo-audit",
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
  "instagram-audit": `Return exactly these sections:
- Brief Instagram audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested content / profile improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Digital Marketing & Performance Growth or Brand Strategy & Positioning)`,
  "linkedin-audit": `Return exactly these sections:
- Brief LinkedIn audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested authority / content / profile improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Brand Strategy & Positioning or Digital Marketing & Performance Growth)`,
  "youtube-audit": `Return exactly these sections:
- Brief YouTube audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested content / channel / conversion improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Digital Marketing & Performance Growth or Brand Strategy & Positioning)`,
  "seo-audit": `Return exactly these sections:
- Brief SEO audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested SEO improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Website, SEO, AEO & GEO)`,
  "aeo-audit": `Return exactly these sections:
- Brief AEO audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested answer-engine readiness improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Website, SEO, AEO & GEO)

Focus on FAQ readiness, clear service explanations, structured answers, entity clarity, problem/solution content, and snippet-friendly copy.`,
  "geo-audit": `Return exactly these sections:
- Brief GEO audit summary
- Good points (items, exactly 2)
- Points that need work (items, exactly 2)
- Suggested generative search readiness improvement direction
- Recommended next step
- Recommended PxlBrief service (must be Website, SEO, AEO & GEO)

Focus on brand/entity clarity, topical authority, expert content, structured service pages, citations/testimonials/proof, and AI-search discoverability.`,
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
- Do not claim to have crawled, scraped, inspected, or accessed live website or platform data.
- If only a handle or URL is provided, say the audit is directional based on the provided input and category/goal context only.
- Do not infer actual posting frequency, engagement quality, visual consistency, rankings, traffic, follower counts, comments, shares, website structure, page content, or channel performance unless the user explicitly provided those details.
- Frame "Good points" as likely strategic advantages or useful starting signals from the provided category/goal, not as observed live facts.
- Frame "Points that need work" as areas to verify or improve in a deeper audit, not as confirmed defects.
- Avoid fake metrics, rankings, traffic estimates, follower assumptions, or performance guarantees.
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
        value: "Discuss With PxlBrief AI",
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
