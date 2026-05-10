import { generateExecutiveSignals } from "@/lib/executive-signals"
import { z } from "zod"

export const maxDuration = 30

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(8000),
})

const bodySchema = z.object({
  messages: z.array(messageSchema).max(250),
  visitorType: z.enum(["unknown", "potential_client", "job_seeker", "vendor"]),
})

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }
    const signals = await generateExecutiveSignals(
      parsed.data.messages,
      parsed.data.visitorType
    )
    return Response.json({ ok: true, signals })
  } catch {
    return Response.json({ error: "Could not load signals" }, { status: 500 })
  }
}
