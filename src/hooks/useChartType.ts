import { useState } from 'react'

const STORAGE_KEY = 'trading-frontend-chart-type'
export type ChartType = 'line' | 'candlestick'

export function useChartType(): [ChartType, (type: ChartType) => void] {
  const [chartType, setChartType] = useState<ChartType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'candlestick' ? 'candlestick' : 'line'
  })

  const setAndPersist = (type: ChartType) => {
    setChartType(type)
    localStorage.setItem(STORAGE_KEY, type)
  }

  return [chartType, setAndPersist]
}
