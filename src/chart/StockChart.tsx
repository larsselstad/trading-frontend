import {
  type CandlestickData,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  createSeriesMarkers,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  LineSeries,
  LineStyle,
  type SeriesMarker,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts'
import { type FC, useEffect, useRef, useState } from 'react'
import { type ChartType, useChartType } from '../hooks/useChartType'
import type { DataPoint, SupportLine } from '../types'

const SUPPORT_COLORS = [
  '#f59e0b',
  '#06b6d4',
  '#a855f7',
  '#f43f5e',
  '#10b981',
  '#6366f1',
]

interface StockChartProps {
  data: DataPoint[]
  supportLines?: SupportLine[]
  buyMarker?: { date: string; price: number }
  sellMarker?: { date: string; price: number }
  height?: number
  showVolume?: boolean
}

function toChartTime(point: DataPoint): UTCTimestamp {
  return Math.floor(point.timeStamp / 1000) as UTCTimestamp
}

function hasOHLC(data: DataPoint[]): boolean {
  return data.some((p) => p.open != null && p.high != null && p.low != null)
}

const StockChart: FC<StockChartProps> = ({
  data,
  supportLines,
  buyMarker,
  sellMarker,
  height = 400,
  showVolume = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [chartType, setChartType] = useChartType()
  const [legendItems, setLegendItems] = useState<
    { label: string; color: string; dashed?: boolean }[]
  >([])

  // Determine if candlestick mode is possible
  const canShowCandlestick = hasOHLC(data)
  const effectiveType: ChartType =
    chartType === 'candlestick' && canShowCandlestick ? 'candlestick' : 'line'

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a2e' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d2d44' },
        horzLines: { color: '#2d2d44' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#4a4a6a' },
      timeScale: {
        borderColor: '#4a4a6a',
        timeVisible: false,
      },
    })
    chartRef.current = chart

    // Sort data by time
    const sortedData = [...data].sort((a, b) => a.timeStamp - b.timeStamp)

    // --- Price series ---
    let priceSeries: ISeriesApi<SeriesType>

    if (effectiveType === 'candlestick') {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        wickUpColor: '#22c55e',
      })
      const candleData: CandlestickData[] = sortedData.map((p) => ({
        time: toChartTime(p) as Time,
        open: p.open ?? p.last,
        high: p.high ?? p.last,
        low: p.low ?? p.last,
        close: p.last,
      }))
      candleSeries.setData(candleData)
      priceSeries = candleSeries
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#8884d8',
        lineWidth: 2,
      })
      const lineData: LineData[] = sortedData.map((p) => ({
        time: toChartTime(p) as Time,
        value: p.last,
      }))
      lineSeries.setData(lineData)
      priceSeries = lineSeries
    }

    // --- SVR prediction series (bull/bear) ---
    const hasPredictions = sortedData.some((d) => d.prediction != null)
    const legend: { label: string; color: string; dashed?: boolean }[] = []

    if (hasPredictions) {
      // Single prediction line colored by bull/bear
      const predictionData = sortedData
        .filter((p) => p.prediction != null)
        .map((p) => ({
          time: toChartTime(p) as Time,
          value: p.prediction as number,
          color: p.svr_isBull ? '#15803d' : '#b91c1c',
        }))

      if (predictionData.length > 0) {
        const predSeries = chart.addSeries(LineSeries, {
          lineWidth: 2,
          color: '#15803d',
          lastValueVisible: false,
          priceLineVisible: false,
        })
        predSeries.setData(predictionData)
        legend.push({
          label: 'SVR Prediction (green = bull, red = bear)',
          color: '#15803d',
        })
      }

      // Upper epsilon
      const upperData: LineData[] = sortedData
        .filter((p) => p.upper_epsilon != null)
        .map((p) => ({
          time: toChartTime(p) as Time,
          value: p.upper_epsilon as number,
        }))

      if (upperData.length > 0) {
        const upperSeries = chart.addSeries(LineSeries, {
          color: '#6b7280',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          lastValueVisible: false,
          priceLineVisible: false,
        })
        upperSeries.setData(upperData)
        legend.push({ label: 'Upper Bound', color: '#6b7280', dashed: true })
      }

      // Lower epsilon
      const lowerData: LineData[] = sortedData
        .filter((p) => p.lower_epsilon != null)
        .map((p) => ({
          time: toChartTime(p) as Time,
          value: p.lower_epsilon as number,
        }))

      if (lowerData.length > 0) {
        const lowerSeries = chart.addSeries(LineSeries, {
          color: '#6b7280',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          lastValueVisible: false,
          priceLineVisible: false,
        })
        lowerSeries.setData(lowerData)
        legend.push({ label: 'Lower Bound', color: '#6b7280', dashed: true })
      }
    }

    // --- Support lines ---
    if (supportLines && supportLines.length > 0) {
      for (let idx = 0; idx < supportLines.length; idx++) {
        const sl = supportLines[idx]
        const color = SUPPORT_COLORS[idx % SUPPORT_COLORS.length]
        priceSeries.createPriceLine({
          price: sl.price,
          color,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
        })
        legend.push({ label: `${sl.label} (${sl.price})`, color, dashed: true })
      }
    }

    // --- Buy/Sell markers ---
    const markers: SeriesMarker<Time>[] = []

    if (buyMarker) {
      const buyPoint = sortedData.find((p) => p.date === buyMarker.date)
      if (buyPoint) {
        markers.push({
          time: toChartTime(buyPoint) as Time,
          position: 'belowBar',
          color: '#22c55e',
          shape: 'arrowUp',
          text: `Kjøp ${buyMarker.price}`,
        })
      }
    }

    if (sellMarker) {
      const sellPoint = sortedData.find((p) => p.date === sellMarker.date)
      if (sellPoint) {
        markers.push({
          time: toChartTime(sellPoint) as Time,
          position: 'aboveBar',
          color: '#ef4444',
          shape: 'arrowDown',
          text: `Salg ${sellMarker.price}`,
        })
      }
    }

    if (markers.length > 0) {
      // Markers must be sorted by time
      markers.sort((a, b) => (a.time as number) - (b.time as number))
      createSeriesMarkers(priceSeries, markers)
    }

    // --- Volume ---
    if (showVolume && sortedData.some((p) => p.volume != null)) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      })
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      })
      const volumeData = sortedData
        .filter((p) => p.volume != null)
        .map((p) => ({
          time: toChartTime(p) as Time,
          value: p.volume as number,
          color:
            p.open != null && p.last >= p.open
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(239, 68, 68, 0.3)',
        }))
      volumeSeries.setData(volumeData)
    }

    setLegendItems(legend)

    // Fit content
    chart.timeScale().fitContent()

    // Resize handler
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      chartRef.current = null
    }
  }, [
    data,
    supportLines,
    buyMarker,
    sellMarker,
    height,
    showVolume,
    effectiveType,
  ])

  return (
    <div className="chart-container">
      <div className="chart-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${effectiveType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line
        </button>
        <button
          type="button"
          className={`toggle-btn ${effectiveType === 'candlestick' ? 'active' : ''}`}
          onClick={() => setChartType('candlestick')}
          disabled={!canShowCandlestick}
          title={
            !canShowCandlestick ? 'OHLC data not available' : 'Candlestick'
          }
        >
          Candlestick
        </button>
      </div>
      <div ref={containerRef} />
      {legendItems.length > 0 && (
        <div className="chart-legend">
          {legendItems.map((item) => (
            <span key={item.label} className="chart-legend-item">
              <span
                className="chart-legend-swatch"
                style={{
                  borderColor: item.color,
                  borderStyle: item.dashed ? 'dashed' : 'solid',
                }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
      <p className="data-count">Showing {data.length} data points</p>
    </div>
  )
}

export default StockChart
