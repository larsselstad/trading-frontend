import axios from 'axios'
import { useEffect, useRef } from 'react'
import type { ChartLayout } from '../types'

const DEBOUNCE_MS = 1000

interface UseChartPersistenceParams {
  resourceId: string
  charts: ChartLayout[]
  enabled: boolean
}

export function useChartPersistence({
  resourceId,
  charts,
  enabled,
}: UseChartPersistenceParams) {
  const timeoutRef = useRef<number | null>(null)
  const previousChartsRef = useRef<string>('')

  useEffect(() => {
    if (!enabled) return

    const currentChartsJson = JSON.stringify(charts)

    // Skip if charts haven't changed
    if (currentChartsJson === previousChartsRef.current) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        await axios.put(`/api/resources/${resourceId}/charts`, {
          charts,
        })
        previousChartsRef.current = currentChartsJson
      } catch (error) {
        console.error('Failed to save charts:', error)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [resourceId, charts, enabled])
}
