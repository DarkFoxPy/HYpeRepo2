import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { eventId, registrationId, responses } = await request.json()

    const db = getDb()
    const user = await getUserFromRequest(request)

    // Insert form response
    const responseId = nanoid()
    db.prepare(
      `INSERT INTO form_responses (id, event_id, registration_id, user_id, responses, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      responseId,
      eventId,
      registrationId || null,
      user?.id || null,
      JSON.stringify(responses),
      new Date().toISOString(),
    )

    console.log("[v0] Form response saved successfully")

    return NextResponse.json({ success: true, id: responseId })
  } catch (error) {
    console.error("[v0] Error submitting form response:", error)
    return NextResponse.json({ error: "Failed to submit form response" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 })
    }

    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is the event organizer
    const event = db.prepare("SELECT organizer_id FROM events WHERE id = ?").get(eventId) as any

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all responses for this event with registration data
    const responses = db
      .prepare(`
      SELECT 
        fr.id,
        fr.event_id,
        fr.registration_id,
        fr.user_id,
        fr.responses,
        fr.submitted_at,
        r.user_name,
        r.user_email,
        r.phone
      FROM form_responses fr
      LEFT JOIN registrations r ON fr.registration_id = r.id
      WHERE fr.event_id = ?
      ORDER BY fr.submitted_at DESC
    `)
      .all(eventId)

    // Parse JSON responses
    const parsedResponses = responses.map((r: any) => ({
      ...r,
      responses: JSON.parse(r.responses),
    }))

    return NextResponse.json({ responses: parsedResponses })
  } catch (error) {
    console.error("[v0] Error fetching form responses:", error)
    return NextResponse.json({ error: "Failed to fetch form responses" }, { status: 500 })
  }
}
