import type { DataPoint } from '../types'

/**
 * Calculate Y-axis domain based on data points
 * @param data Array of data points containing last, prediction, and epsilon values
 * @returns Tuple of [min, max] values for Y-axis with 10% padding
 */
export const getYAxisDomain = (data: DataPoint[]): [number, number] => {
  if (data.length === 0) return [0, 100]

  const allValues: number[] = []
  for (const point of data) {
    allValues.push(point.last)
    if (point.prediction != null) allValues.push(point.prediction)
    if (point.upper_epsilon != null) allValues.push(point.upper_epsilon)
    if (point.lower_epsilon != null) allValues.push(point.lower_epsilon)
  }

  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const padding = (max - min) * 0.1 // 10% padding

  const yMin = Math.max(0, Math.floor(min - padding))
  const yMax = Math.ceil(max + padding)

  return [yMin, yMax]
}
