"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEventsStore } from "@/lib/stores/events-store"

export default function FormResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { events } = useEventsStore()
  const [responses, setResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const event = events.find((e) => e.id === params.id)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`/api/form-responses?eventId=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setResponses(data.responses || [])
          console.log("[v0] Loaded form responses:", data.responses)
        }
      } catch (error) {
        console.error("[v0] Error loading form responses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchResponses()
    }
  }, [params.id])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csvContent = generateCSV()
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `respuestas-${event?.title || "evento"}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: "Las respuestas se han descargado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const generateCSV = () => {
    if (responses.length === 0) return ""

    // Get all unique field keys from responses
    const allKeys = new Set<string>()
    responses.forEach((response) => {
      const parsedResponses =
        typeof response.responses === "string" ? JSON.parse(response.responses) : response.responses
      Object.keys(parsedResponses).forEach((key) => allKeys.add(key))
    })

    const headers = ["Fecha de Envío", "Nombre", "Email", "Teléfono", ...Array.from(allKeys)]
    const rows = responses.map((response) => {
      const parsedResponses =
        typeof response.responses === "string" ? JSON.parse(response.responses) : response.responses
      const row = [
        new Date(response.submitted_at).toLocaleString("es-ES"),
        response.user_name || "-",
        response.user_email || "-",
        response.phone || "-",
      ]
      allKeys.forEach((key) => {
        const value = parsedResponses[key]
        row.push(value ? String(value) : "-")
      })
      return row
    })

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center text-white/60 bg-surface/50 border-border/50">
          <p>Evento no encontrado</p>
        </Card>
      </div>
    )
  }

  const formFields = event.customFormFields || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/events/${params.slug}/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al evento
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Respuestas del formulario</h1>
            <p className="text-white/60">{event.title}</p>
          </div>
        </div>
        <Button onClick={handleExport} disabled={isExporting || responses.length === 0}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Exportar CSV
        </Button>
      </div>

      {responses.length === 0 ? (
        <Card className="p-8 text-center text-white/60 bg-surface/50 border-border/50">
          <p>No hay respuestas aún.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-white/60">Total de respuestas: {responses.length}</p>
          {responses.map((response, index) => {
            const parsedResponses =
              typeof response.responses === "string" ? JSON.parse(response.responses) : response.responses

            return (
              <Card key={response.id} className="p-6 bg-surface/50 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Respuesta #{index + 1}</h3>
                  <p className="text-sm text-white/60">
                    {new Date(response.submitted_at).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="space-y-3">
                  {response.user_name && (
                    <div>
                      <p className="text-sm font-medium text-white/60">Nombre</p>
                      <p className="mt-1 text-white">{response.user_name}</p>
                    </div>
                  )}
                  {response.user_email && (
                    <div>
                      <p className="text-sm font-medium text-white/60">Email</p>
                      <p className="mt-1 text-white">{response.user_email}</p>
                    </div>
                  )}
                  {response.phone && (
                    <div>
                      <p className="text-sm font-medium text-white/60">Teléfono</p>
                      <p className="mt-1 text-white">{response.phone}</p>
                    </div>
                  )}
                  {Object.entries(parsedResponses).map(([key, value]) => {
                    // Skip basic fields already shown
                    if (key === "nombre_completo" || key === "email" || key === "telefono") return null

                    // Find the field label from customFormFields
                    const field = formFields.find((f) => f.id === key)
                    const label = field?.label || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

                    return (
                      <div key={key}>
                        <p className="text-sm font-medium text-white/60">{label}</p>
                        <p className="mt-1 text-white">{Array.isArray(value) ? value.join(", ") : value || "-"}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
