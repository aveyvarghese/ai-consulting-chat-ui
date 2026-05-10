import { normalizeConversationPayload } from "@/lib/conversation-state"
import type { LeadData } from "@/lib/lead-data"
import {
  generateProfessionalLeadSummary,
  generateSalesIntakeSummary,
} from "@/lib/lead-submit"
import { z } from "zod"

export const maxDuration = 30

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(8000),
})

const leadDataSchema = z.object({
  visitorType: z.enum(["unknown", "potential_client", "job_seeker", "vendor"]),
  name: z.string().max(500),
  company: z.string().max(500),
  website: z.string().max(2000),
  instagram: z.string().max(500),
  service: z.string().max(1000),
  email: z.string().max(320),
  phone: z.string().max(120),
  notes: z.string().max(4000),
})

const bodySchema = z.object({
  messages: z.array(chatMessageSchema).max(250),
  leadData: leadDataSchema,
  snapshot: z.record(z.unknown()),
  summaryFormat: z.enum(["professional", "sales_intake"]).optional().default("professional"),
  recommendedService: z.string().max(1000).optional().default(""),
})

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const snap = normalizeConversationPayload(parsed.data.snapshot)
    const leadData = parsed.data.leadData as LeadData
    const ctx = {
      businessVertical: snap.businessVertical,
      businessStage: snap.businessStage,
      conversationStage: snap.conversationStage,
      potentialClientStage: snap.potentialClientStage,
    }

    const professionalSummary =
      parsed.data.summaryFormat === "sales_intake"
        ? await generateSalesIntakeSummary(
            parsed.data.messages,
            leadData,
            ctx,
            parsed.data.recommendedService
          )
        : await generateProfessionalLeadSummary(parsed.data.messages, leadData, ctx)

    return Response.json({ ok: true, professionalSummary })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return Response.json({ error: message }, { status: 500 })
  }
}
