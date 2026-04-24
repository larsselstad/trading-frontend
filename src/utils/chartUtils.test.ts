import { describe, expect, it } from 'vitest'
import type { DataPoint } from '../types'
import { getYAxisDomain } from './chartUtils'

describe('getYAxisDomain', () => {
  it('should return default domain [0, 100] for empty data', () => {
    const result = getYAxisDomain([])
    expect(result).toEqual([0, 100])
  })

  it('should calculate domain for data with only "last" values', () => {
    const data: DataPoint[] = [
      { timeStamp: 1, date: '01.01.2025', last: 25 },
      { timeStamp: 2, date: '02.01.2025', last: 30 },
      { timeStamp: 3, date: '03.01.2025', last: 28 },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min should be 25, max 30, range is 5
    // Padding is 10% of range = 0.5
    // Expected: [floor(25 - 0.5), ceil(30 + 0.5)] = [24, 31]
    expect(min).toBe(24)
    expect(max).toBe(31)
  })

  it('should include prediction values in domain calculation', () => {
    const data: DataPoint[] = [
      { timeStamp: 1, date: '01.01.2025', last: 25, prediction: 24 },
      { timeStamp: 2, date: '02.01.2025', last: 30, prediction: 32 },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min is 24, max is 32, range is 8
    // Padding is 10% of range = 0.8
    // Expected: [floor(24 - 0.8), ceil(32 + 0.8)] = [23, 33]
    expect(min).toBe(23)
    expect(max).toBe(33)
  })

  it('should include epsilon bounds in domain calculation', () => {
    const data: DataPoint[] = [
      {
        timeStamp: 1,
        date: '01.01.2025',
        last: 27,
        prediction: 27,
        upper_epsilon: 29,
        lower_epsilon: 25,
      },
      {
        timeStamp: 2,
        date: '02.01.2025',
        last: 28,
        prediction: 28,
        upper_epsilon: 31,
        lower_epsilon: 26,
      },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min is 25, max is 31, range is 6
    // Padding is 10% of range = 0.6
    // Expected: [floor(25 - 0.6), ceil(31 + 0.6)] = [24, 32]
    expect(min).toBe(24)
    expect(max).toBe(32)
  })

  it('should handle single data point', () => {
    const data: DataPoint[] = [{ timeStamp: 1, date: '01.01.2025', last: 50 }]
    const [min, max] = getYAxisDomain(data)

    // Min and max are both 50, range is 0
    // Padding is 10% of 0 = 0
    // Expected: [floor(50 - 0), ceil(50 + 0)] = [50, 50]
    expect(min).toBe(50)
    expect(max).toBe(50)
  })

  it('should handle data with undefined optional fields', () => {
    const data: DataPoint[] = [
      { timeStamp: 1, date: '01.01.2025', last: 20, prediction: undefined },
      { timeStamp: 2, date: '02.01.2025', last: 30 },
    ]
    const [min, max] = getYAxisDomain(data)

    // Only "last" values count: 20 and 30, range is 10
    // Padding is 10% of range = 1
    // Expected: [floor(20 - 1), ceil(30 + 1)] = [19, 31]
    expect(min).toBe(19)
    expect(max).toBe(31)
  })

  it('should handle data with null optional fields', () => {
    const data: DataPoint[] = [
      {
        timeStamp: 1,
        date: '21.10.2025',
        last: 27.0,
        prediction: null,
        upper_epsilon: null,
        lower_epsilon: null,
      },
      {
        timeStamp: 2,
        date: '22.10.2025',
        last: 28.12,
        prediction: 28.37974861074759,
        upper_epsilon: 28.639284398815022,
        lower_epsilon: 28.120212822680163,
      },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min is 27.0, max is 28.639284398815022
    // Range is ~1.639
    // Padding is 10% of range = ~0.164
    // Expected: [floor(27 - 0.164), ceil(28.639 + 0.164)] = [26, 29]
    expect(min).toBe(26)
    expect(max).toBe(29)
  })

  it('should handle negative values and clamp min to 0', () => {
    const data: DataPoint[] = [
      { timeStamp: 1, date: '01.01.2025', last: -10 },
      { timeStamp: 2, date: '02.01.2025', last: 10 },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min is -10, max is 10, range is 20
    // Padding is 10% of range = 2
    // Calculated: [floor(-10 - 2), ceil(10 + 2)] = [-12, 12]
    // But min is clamped to 0
    expect(min).toBe(0)
    expect(max).toBe(12)
  })

  it('should handle decimal values properly', () => {
    const data: DataPoint[] = [
      { timeStamp: 1, date: '01.01.2025', last: 25.5 },
      { timeStamp: 2, date: '02.01.2025', last: 26.5 },
    ]
    const [min, max] = getYAxisDomain(data)

    // Min is 25.5, max is 26.5, range is 1
    // Padding is 10% of range = 0.1
    // Expected: [floor(25.5 - 0.1), ceil(26.5 + 0.1)] = [25, 27]
    expect(min).toBe(25)
    expect(max).toBe(27)
  })
})
