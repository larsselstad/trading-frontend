import { useEffect, useState } from 'react'
import ChartPanel from '../chart/ChartPanel'
import { useChartPersistence } from '../hooks/useChartPersistence'
import { useFetchData } from '../hooks/useFetchData'
import type { ChartLayout, Resource } from '../types'

interface ChartsProps {
  resource: Resource
}

export function Charts({ resource }: ChartsProps) {
  const [charts, setCharts] = useState<ChartLayout[]>([])

  const { data } = useFetchData({ filename: resource.id })
  const availableDates = data?.map((point) => point.date) ?? []

  // Initialize charts from resource data when resource changes
  useEffect(() => {
    console.log('Initializing charts for resource:', resource.charts)
    if (resource.charts && resource.charts.length > 0) {
      setCharts(resource.charts)
    } else {
      // If no saved charts, initialize with one empty chart
      setCharts([
        {
          id: crypto.randomUUID(),
          startDate: '',
          endDate: '',
          svrStartDate: '',
          svrEndDate: '',
        },
      ])
    }
  }, [resource])

  // Persist charts to backend
  useChartPersistence({
    resourceId: resource.id,
    charts,
    enabled: charts.length > 0,
  })

  const addChart = () => {
    setCharts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        startDate: '',
        endDate: '',
        svrStartDate: '',
        svrEndDate: '',
      },
    ])
  }

  const removeChart = (id: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== id))
  }

  const updateChartDates = (
    chartId: string,
    startDate: string,
    endDate: string,
    svrStartDate: string,
    svrEndDate: string,
  ) => {
    setCharts((prev) =>
      prev.map((c) =>
        c.id === chartId
          ? { ...c, startDate, endDate, svrStartDate, svrEndDate }
          : c,
      ),
    )
  }

  const lastChart = charts[charts.length - 1]
  const canAddNextChart = lastChart?.svrEndDate !== ''

  const addNextChart = () => {
    if (!lastChart?.svrEndDate) return
    const currentEndDateIndex = availableDates.indexOf(lastChart.svrEndDate)
    if (
      currentEndDateIndex === -1 ||
      currentEndDateIndex >= availableDates.length - 1
    )
      return
    const nextDate = availableDates[currentEndDateIndex + 1]
    setCharts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        startDate: lastChart.startDate,
        endDate: lastChart.endDate,
        svrStartDate: lastChart.svrStartDate,
        svrEndDate: nextDate,
      },
    ])
  }

  return (
    <>
      {charts.map((chart) => (
        <ChartPanel
          key={chart.id}
          id={chart.id}
          filename={resource.id}
          startDate={chart.startDate}
          endDate={chart.endDate}
          svrStartDate={chart.svrStartDate}
          svrEndDate={chart.svrEndDate}
          onDatesChange={(startDate, endDate, svrStartDate, svrEndDate) =>
            updateChartDates(
              chart.id,
              startDate,
              endDate,
              svrStartDate,
              svrEndDate,
            )
          }
          onRemove={removeChart}
        />
      ))}

      <div className="chart-buttons">
        <button type="button" className="add-chart-button" onClick={addChart}>
          + Add Chart
        </button>
        {canAddNextChart && (
          <button
            type="button"
            className="add-chart-button"
            onClick={addNextChart}
          >
            + Next Date Chart
          </button>
        )}
      </div>
    </>
  )
}
