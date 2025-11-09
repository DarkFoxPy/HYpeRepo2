import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// POST /api/events/[id]/register - Register for event
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDb()

    const user = await getUserFromRequest(request)

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id) as any

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const body = await request.json()
    const { userName, userEmail, phone, customFormData } = body

    // Check if already registered by email
    const existingRegistration = db
      .prepare("SELECT * FROM registrations WHERE event_id = ? AND user_email = ?")
      .get(id, userEmail)

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered" }, { status: 400 })
    }

    // Check capacity
    if (!event.unlimited_capacity) {
      const registrationCount = db
        .prepare("SELECT COUNT(*) as count FROM registrations WHERE event_id = ?")
        .get(id) as any

      if (registrationCount.count >= event.capacity) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 })
      }
    }

    // Create registration
    const registrationId = nanoid()
    const stmt = db.prepare(`
      INSERT INTO registrations (id, event_id, user_id, user_name, user_email, phone, status, custom_answers, registered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      registrationId,
      id,
      user?.id || null,
      userName,
      userEmail,
      phone || null,
      event.requires_approval ? "pending" : "approved",
      customFormData ? JSON.stringify(customFormData) : null,
      new Date().toISOString(),
    )

    console.log("[v0] User registered for event successfully")

    return NextResponse.json({ success: true, registrationId })
  } catch (error) {
    console.error("[v0] Error registering for event:", error)
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 })
  }
}
