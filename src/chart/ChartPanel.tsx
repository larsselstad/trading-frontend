import type { FC, SubmitEvent } from 'react'
import { useFetchData } from '../hooks/useFetchData'
import StockChart from './StockChart'

interface ChartPanelProps {
  id: string
  filename: string
  startDate: string
  endDate: string
  svrStartDate: string
  svrEndDate: string
  onDatesChange: (
    startDate: string,
    endDate: string,
    svrStartDate: string,
    svrEndDate: string,
  ) => void
  onRemove: (id: string) => void
}

const ChartPanel: FC<ChartPanelProps> = ({
  id,
  filename,
  startDate,
  endDate,
  svrStartDate,
  svrEndDate,
  onDatesChange,
  onRemove,
}) => {
  const {
    data = [],
    isLoading,
    error,
  } = useFetchData({
    filename,
    startdate: startDate || undefined,
    enddate: endDate || undefined,
    svr_startdate: svrStartDate || undefined,
    svr_enddate: svrEndDate || undefined,
  })

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newStartDate = (formData.get('startDate') as string) ?? ''
    const newEndDate = (formData.get('endDate') as string) ?? ''
    const newSvrStartDate = (formData.get('svrStartDate') as string) ?? ''
    const newSvrEndDate = (formData.get('svrEndDate') as string) ?? ''
    onDatesChange(newStartDate, newEndDate, newSvrStartDate, newSvrEndDate)
  }

  return (
    <div className="chart-panel">
      <div className="chart-panel-header">
        <form className="chart-panel-controls" onSubmit={onSubmit}>
          <div className="input-group">
            <label htmlFor={`startDate-${id}`}>
              Start Date (dd.mm.yyyy):
              <input
                id={`startDate-${id}`}
                name="startDate"
                type="text"
                defaultValue={startDate}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Date must be in format d.m.yyyy or dd.mm.yyyy (e.g., 5.5.2025 or 12.12.2025)"
                list={`startDateList-${id}`}
              />
              <datalist id={`startDateList-${id}`}>
                {data.map((point) => (
                  <option key={`start-${point.date}`} value={point.date} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="input-group">
            <label htmlFor={`endDate-${id}`}>
              End Date (dd.mm.yyyy):
              <input
                id={`endDate-${id}`}
                name="endDate"
                type="text"
                defaultValue={endDate}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Date must be in format d.m.yyyy or dd.mm.yyyy (e.g., 5.5.2025 or 12.12.2025)"
                list={`endDateList-${id}`}
              />
              <datalist id={`endDateList-${id}`}>
                {data.map((point) => (
                  <option key={`end-${point.date}`} value={point.date} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="input-group">
            <label htmlFor={`svrStartDate-${id}`}>
              SVR Start Date (dd.mm.yyyy):
              <input
                id={`svrStartDate-${id}`}
                name="svrStartDate"
                type="text"
                defaultValue={svrStartDate}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Date must be in format d.m.yyyy or dd.mm.yyyy (e.g., 5.5.2025 or 12.12.2025)"
                list={`svrStartDateList-${id}`}
              />
              <datalist id={`svrStartDateList-${id}`}>
                {data.map((point) => (
                  <option key={`start-${point.date}`} value={point.date} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="input-group">
            <label htmlFor={`svrEndDate-${id}`}>
              SVR End Date (dd.mm.yyyy):
              <input
                id={`svrEndDate-${id}`}
                name="svrEndDate"
                type="text"
                defaultValue={svrEndDate}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Date must be in format d.m.yyyy or dd.mm.yyyy (e.g., 5.5.2025 or 12.12.2025)"
                list={`svrEndDateList-${id}`}
              />
              <datalist id={`svrEndDateList-${id}`}>
                {data.map((point) => (
                  <option key={`end-${point.date}`} value={point.date} />
                ))}
              </datalist>
            </label>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch Data'}
          </button>
        </form>

        <button
          type="button"
          className="remove-button"
          onClick={() => onRemove(id)}
          title="Remove chart"
        >
          ✕
        </button>
      </div>

      {error && <div className="error">Error: {error.message}</div>}

      {data.length > 0 && <StockChart data={data} />}
    </div>
  )
}

export default ChartPanel
