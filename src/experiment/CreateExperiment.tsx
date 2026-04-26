import { type FC, type SubmitEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StockChart from '../chart/StockChart'
import { Loading } from '../components/Loading'
import { useCreateExperiment } from '../hooks/useExperiments'
import { useFetchData } from '../hooks/useFetchData'
import { useResources } from '../hooks/useResources'

const CreateExperiment: FC = () => {
  const navigate = useNavigate()
  const [stockId, setStockId] = useState('')
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: resources, isLoading: resourcesLoading } = useResources()
  const { data: stockData = [] } = useFetchData({
    filename: stockId,
    enabled: !!stockId,
  })
  const createExperiment = useCreateExperiment()

  if (resourcesLoading) return <Loading message="Loading stocks..." />

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    createExperiment.mutate(
      { name, stockId, startDate, endDate: endDate || undefined },
      {
        onSuccess: (experiment) => {
          navigate(`/experiments/${experiment.id}`)
        },
      },
    )
  }

  return (
    <div className="create-experiment">
      <div className="create-experiment-header">
        <h2>New Experiment</h2>
        <button
          type="button"
          className="remove-button"
          onClick={() => navigate('/experiments')}
        >
          ✕ Cancel
        </button>
      </div>

      <form className="create-step" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="stock-select">
            Stock:
            <select
              id="stock-select"
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
            >
              <option value="">Select a stock</option>
              {resources?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {stockData.length > 0 && (
          <div className="stock-preview">
            <p>Preview ({stockData.length} data points)</p>
            <StockChart data={stockData} />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="exp-name">
            Name:
            <input
              id="exp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vår Energi Q4 2025"
              required
            />
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="exp-start">
            Start Date (dd.mm.yyyy):
            <input
              id="exp-start"
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              pattern="\d{1,2}\.\d{1,2}\.\d{4}"
              title="Date in format dd.mm.yyyy"
              list="exp-start-dates"
            />
            <datalist id="exp-start-dates">
              {stockData.map((p) => (
                <option key={`s-${p.date}`} value={p.date} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="exp-end">
            End Date (dd.mm.yyyy, optional):
            <input
              id="exp-end"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              pattern="\d{1,2}\.\d{1,2}\.\d{4}"
              title="Date in format dd.mm.yyyy"
              list="exp-end-dates"
            />
            <datalist id="exp-end-dates">
              {stockData.map((p) => (
                <option key={`e-${p.date}`} value={p.date} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="create-step-buttons">
          <button
            type="submit"
            disabled={!name || !stockId || createExperiment.isPending}
          >
            {createExperiment.isPending ? 'Creating...' : 'Create Experiment'}
          </button>
        </div>

        {createExperiment.isError && (
          <div className="error">Error: {createExperiment.error.message}</div>
        )}
      </form>
    </div>
  )
}

export default CreateExperiment
