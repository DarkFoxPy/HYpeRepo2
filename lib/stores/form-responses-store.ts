import { create } from "zustand"
import type { FormResponse } from "@/lib/types"

interface FormResponsesState {
  responses: FormResponse[]
  loading: boolean
  addResponse: (response: Omit<FormResponse, "id" | "submittedAt">) => Promise<FormResponse>
  getResponsesByEvent: (eventId: string) => FormResponse[]
  fetchResponsesByEvent: (eventId: string) => Promise<void>
}

export const useFormResponsesStore = create<FormResponsesState>((set, get) => ({
  responses: [],
  loading: false,

  addResponse: async (responseData) => {
    set({ loading: true })

    try {
      console.log("[v0] Saving form response:", responseData)

      const newResponse: FormResponse = {
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...responseData,
        submittedAt: new Date(),
      }

      set((state) => ({
        responses: [...state.responses, newResponse],
      }))

      console.log("[v0] Form response saved successfully:", newResponse)
      return newResponse
    } catch (error) {
      console.error("[v0] Error saving form response:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  getResponsesByEvent: (eventId) => {
    const { responses } = get()
    return responses.filter((r) => r.eventId === eventId)
  },

  fetchResponsesByEvent: async (eventId) => {
    set({ loading: true })

    try {
      // In a real app, this would fetch from an API
      // For now, we're using local state
      console.log("[v0] Fetching responses for event:", eventId)
    } finally {
      set({ loading: false })
    }
  },
}))
