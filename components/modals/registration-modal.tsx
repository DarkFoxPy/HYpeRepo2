"use client"

import type React from "react"
import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { X, User, Mail, Phone, Check } from "lucide-react"
import toast from "react-hot-toast"
import type { Event, FormField } from "@/lib/types"

interface RegistrationModalProps {
  event: Event
  onClose: () => void
  onSuccess: () => void
}

export function RegistrationModal({ event, onClose, onSuccess }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const registrationResponse = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.name,
          userEmail: formData.email,
          phone: formData.phone,
          customFormData: customAnswers,
        }),
      })

      if (!registrationResponse.ok) {
        const error = await registrationResponse.json()
        throw new Error(error.error || "Error al registrarse")
      }

      const { registrationId } = await registrationResponse.json()

      const responseData: Record<string, any> = {
        nombre_completo: formData.name,
        email: formData.email,
        telefono: formData.phone,
        ...customAnswers,
      }

      await fetch("/api/form-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          registrationId,
          responses: responseData,
        }),
      })

      console.log("[v0] Registration completed successfully with data:", responseData)

      setStep(2)
      toast.success("Registro exitoso")

      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Error during registration:", error)
      toast.error(error.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const renderCustomField = (field: FormField) => {
    const value = customAnswers[field.id] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
            placeholder={field.placeholder}
          />
        )

      case "textarea":
        return (
          <textarea
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted resize-none"
            placeholder={field.placeholder}
            rows={4}
          />
        )

      case "select":
        return (
          <select
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground cursor-pointer"
          >
            <option value="">Selecciona una opción</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  required={field.required}
                  checked={value === option}
                  onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-primary/50 border-border/50"
                />
                <span className="text-foreground group-hover:text-primary transition-colors">{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const currentValues = value ? value.split(",") : []
              const isChecked = currentValues.includes(option)

              return (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      let newValues = [...currentValues]
                      if (e.target.checked) {
                        newValues.push(option)
                      } else {
                        newValues = newValues.filter((v) => v !== option)
                      }
                      setCustomAnswers({ ...customAnswers, [field.id]: newValues.join(",") })
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary/50 border-border/50 rounded"
                  />
                  <span className="text-foreground group-hover:text-primary transition-colors">{option}</span>
                </label>
              )
            })}
          </div>
        )

      case "date":
        return (
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <GlassCard glow="primary">
          {step === 1 ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Registrarse al Evento</h2>
                  <p className="text-sm text-muted">{event.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Número de Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                {event.hasCustomForm && event.customFormFields && event.customFormFields.length > 0 && (
                  <>
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Preguntas Adicionales</h3>
                      <div className="space-y-4">
                        {event.customFormFields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {field.label}
                              {field.required && <span className="text-error ml-1">*</span>}
                            </label>
                            {renderCustomField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <GradientButton type="submit" className="w-full" loading={loading} size="lg">
                  Confirmar Registro
                </GradientButton>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-success/40 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Check className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Registro Exitoso</h2>
                <p className="text-muted mb-6">Te hemos enviado un email de confirmación con todos los detalles.</p>
                <GradientButton onClick={onClose} className="w-full">
                  Cerrar
                </GradientButton>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
