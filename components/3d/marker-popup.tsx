"use client"

import { useState } from "react"
import { X, MapPin, ImageIcon, FileText, Play } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"

interface MarkerPopupProps {
  marker: {
    id: string
    name: string
    description?: string
    type: string
    color: string
    capacity?: number
    mediaFiles?: {
      file1?: string
      file2?: string
      file3?: string
    }
  }
  onClose: () => void
}

export function MarkerPopup({ marker, onClose }: MarkerPopupProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ data: string; type: string } | null>(null)

  const getFileType = (base64: string): "image" | "video" | "pdf" | "unknown" => {
    if (base64.startsWith("data:image/")) return "image"
    if (base64.startsWith("data:video/")) return "video"
    if (base64.startsWith("data:application/pdf")) return "pdf"
    return "unknown"
  }

  const mediaFiles = marker.mediaFiles
    ? Object.entries(marker.mediaFiles)
        .filter(([_, value]) => value)
        .map(([key, value]) => ({
          key,
          data: value as string,
          type: getFileType(value as string),
        }))
    : []

  const handleMediaClick = (file: { data: string; type: string }) => {
    if (file.type === "pdf") {
      // PDFs still open in new tab
      const pdfWindow = window.open()
      if (pdfWindow) {
        pdfWindow.document.write(`<iframe width='100%' height='100%' src='${file.data}'></iframe>`)
      }
    } else {
      // Images and videos open in modal
      setSelectedMedia(file)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1732]/90 backdrop-blur-md animate-in fade-in duration-300">
        <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" glow="primary">
          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#f1c6ff] to-transparent animate-shimmer" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1e1732]/80 border border-[#f1c6ff]/30 flex items-center justify-center hover:bg-[#f1c6ff]/20 hover:border-[#f1c6ff] hover:rotate-90 transition-all duration-300"
          >
            <X className="w-5 h-5 text-[#f1c6ff]" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${marker.color}20`, border: `2px solid ${marker.color}` }}
              >
                <MapPin className="w-6 h-6" style={{ color: marker.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#ffddff]">{marker.name}</h2>
                <p className="text-sm text-[#f1c6ff] capitalize">{marker.type.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {marker.description && (
            <div className="mb-6">
              <p className="text-[#e2e2e2] leading-relaxed">{marker.description}</p>
            </div>
          )}

          {/* Capacity */}
          {marker.capacity && (
            <div className="mb-6 p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#1e1732]" />
                </div>
                <div>
                  <p className="text-sm text-[#78767b]">Capacidad</p>
                  <p className="text-lg font-bold text-[#ffddff]">{marker.capacity} personas</p>
                </div>
              </div>
            </div>
          )}

          {/* Media Files */}
          {mediaFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#ffddff] mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#f1c6ff]" />
                Contenido Multimedia
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleMediaClick(file)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-[#f1c6ff]/30 hover:border-[#f1c6ff] transition-all cursor-pointer group"
                  >
                    {file.type === "image" && (
                      <img
                        src={file.data || "/placeholder.svg"}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {file.type === "video" && (
                      <div className="relative w-full h-full">
                        <video src={file.data} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                    {file.type === "pdf" && (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1732]/50">
                        <FileText className="w-12 h-12 text-[#f1c6ff] mb-2" />
                        <p className="text-xs text-[#e2e2e2]">PDF Document</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1732]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-xs text-[#ffddff] font-medium">
                        {file.type === "image" && "Click para ver imagen"}
                        {file.type === "video" && "Click para ver video"}
                        {file.type === "pdf" && "Click para descargar PDF"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <GradientButton onClick={onClose} className="flex-1">
              Cerrar
            </GradientButton>
          </div>
        </GlassCard>
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-white transition-all duration-300 z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div
            className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "image" && (
              <img
                src={selectedMedia.data || "/placeholder.svg"}
                alt="Vista ampliada"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
            {selectedMedia.type === "video" && (
              <video src={selectedMedia.data} controls autoPlay className="max-w-full max-h-full rounded-lg" />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MarkerPopup
