import {
  computeLeadIntelligence,
  snapshotToLeadPartial,
} from "@/lib/lead-intelligence"
import { normalizeConversationPayload } from "@/lib/conversation-state"
import { z } from "zod"

export const maxDuration = 60

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(8000),
})

const bodySchema = z.object({
  messages: z.array(chatMessageSchema).max(250).optional().default([]),
  snapshot: z.record(z.unknown()),
})

function transcriptFromMessages(
  messages: z.infer<typeof chatMessageSchema>[]
): string {
  return messages
    .map((m) =>
      m.role === "user"
        ? `Visitor: ${m.content}`
        : `PxlBrief AI: ${m.content}`
    )
    .join("\n\n")
    .slice(0, 12000)
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid JSON body", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const normalized = normalizeConversationPayload(parsed.data.snapshot)

    const transcript =
      normalized.conversationSummary.trim() ||
      transcriptFromMessages(parsed.data.messages ?? [])

    if (!transcript.trim()) {
      return Response.json(
        { error: "No conversation transcript available yet" },
        { status: 400 }
      )
    }

    if (normalized.visitorType === "unknown") {
      return Response.json({
        skipped: true,
        reason: "visitor_type_unknown",
      })
    }

    try {
      const partial = snapshotToLeadPartial(
        normalized,
        transcript,
        normalized.uploadedFileName
      )
      const intelligence = await computeLeadIntelligence(transcript, partial)
      return Response.json({ ok: true, intelligence })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lead analyse failed"
      return Response.json({ error: msg }, { status: 400 })
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return Response.json({ error: message }, { status: 500 })
  }
}
