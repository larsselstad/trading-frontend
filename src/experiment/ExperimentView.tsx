import { type FC, type SubmitEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StockChart from '../chart/StockChart'
import { Loading } from '../components/Loading'
import {
  useAddChart,
  useDeleteChart,
  useExperiment,
  useExperimentChartData,
  useExperimentStockData,
  useRecordBuy,
  useRecordSell,
} from '../hooks/useExperiments'
import SupportLineEditor from './SupportLineEditor'

const ExperimentView: FC = () => {
  const { id: experimentId = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [svrStartDate, setSvrStartDate] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [sellDate, setSellDate] = useState('')
  const [sellPrice, setSellPrice] = useState('')

  const { data: experiment, isLoading, error } = useExperiment(experimentId)

  const { data: stockData = [] } = useExperimentStockData(experimentId)

  const addChart = useAddChart(experimentId)
  const deleteChart = useDeleteChart(experimentId)
  const recordBuy = useRecordBuy(experimentId)
  const recordSell = useRecordSell(experimentId)

  if (isLoading) return <Loading message="Loading experiment..." />
  if (error) return <div className="error">Error: {error.message}</div>
  if (!experiment) return <div className="error">Experiment not found</div>

  const isCompleted = !!experiment.completedAt

  const handleAddChart = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!svrStartDate) return
    addChart.mutate(
      { svrStartDate },
      {
        onSuccess: () => setSvrStartDate(''),
      },
    )
  }

  const handleDeleteChart = (chartId: string) => {
    deleteChart.mutate(chartId)
  }

  const handleRecordBuy = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!buyDate) return
    recordBuy.mutate(
      { buyDate, buyPrice: buyPrice ? Number(buyPrice) : null },
      {
        onSuccess: () => {
          setBuyDate('')
          setBuyPrice('')
        },
      },
    )
  }

  const handleRecordSell = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!sellDate) return
    recordSell.mutate(
      { sellDate, sellPrice: sellPrice ? Number(sellPrice) : null },
      {
        onSuccess: () => {
          setSellDate('')
          setSellPrice('')
        },
      },
    )
  }

  const availableDates = stockData.map((p) => p.date)

  const profitAmount =
    experiment.buyPrice != null && experiment.sellPrice != null
      ? experiment.sellPrice - experiment.buyPrice
      : null
  const profitPercent =
    experiment.buyPrice != null &&
    experiment.sellPrice != null &&
    experiment.buyPrice !== 0
      ? ((experiment.sellPrice - experiment.buyPrice) / experiment.buyPrice) *
        100
      : null

  return (
    <div className="experiment-view">
      <div className="experiment-view-header">
        <button type="button" onClick={() => navigate('/experiments')}>
          ← Back
        </button>
        <h2>{experiment.name}</h2>
        <span className="experiment-meta">
          {experiment.stockId} | {experiment.startDate}
          {experiment.endDate ? ` → ${experiment.endDate}` : ' → present'}
        </span>
        {isCompleted && (
          <span className="experiment-completed-badge">Avsluttet</span>
        )}
      </div>

      {/* Buy/Sell Transaction Section */}
      {!isCompleted && !experiment.buyDate && (
        <div className="experiment-transaction-section">
          <h3>Registrer kjøp</h3>
          <form className="transaction-form" onSubmit={handleRecordBuy}>
            <label htmlFor="buy-date">
              Dato:
              <input
                id="buy-date"
                type="text"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Dato i format dd.mm.yyyy"
                placeholder="dd.mm.yyyy"
                list="buy-date-list"
                required
              />
              <datalist id="buy-date-list">
                {availableDates.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </label>
            <label htmlFor="buy-price">
              Pris (valgfri):
              <input
                id="buy-price"
                type="number"
                step="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="Hentes fra data"
              />
            </label>
            <button type="submit" disabled={!buyDate || recordBuy.isPending}>
              {recordBuy.isPending ? 'Registrerer...' : 'Registrer kjøp'}
            </button>
          </form>
          {recordBuy.isError && (
            <div className="error">Feil: {recordBuy.error.message}</div>
          )}
        </div>
      )}

      {!isCompleted && experiment.buyDate && !experiment.sellDate && (
        <div className="experiment-transaction-section">
          <div className="buy-info">
            <span>
              Kjøpt: <strong>{experiment.buyDate}</strong> til{' '}
              <strong>{experiment.buyPrice}</strong>
            </span>
          </div>
          <h3>Registrer salg</h3>
          <form className="transaction-form" onSubmit={handleRecordSell}>
            <label htmlFor="sell-date">
              Dato:
              <input
                id="sell-date"
                type="text"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                title="Dato i format dd.mm.yyyy"
                placeholder="dd.mm.yyyy"
                list="sell-date-list"
                required
              />
              <datalist id="sell-date-list">
                {availableDates.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </label>
            <label htmlFor="sell-price">
              Pris (valgfri):
              <input
                id="sell-price"
                type="number"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="Hentes fra data"
              />
            </label>
            <button type="submit" disabled={!sellDate || recordSell.isPending}>
              {recordSell.isPending ? 'Registrerer...' : 'Registrer salg'}
            </button>
          </form>
          {recordSell.isError && (
            <div className="error">Feil: {recordSell.error.message}</div>
          )}
        </div>
      )}

      {/* Completed summary */}
      {isCompleted && (
        <div className="experiment-summary">
          <h3>Oppsummering</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Kjøpsdato</span>
              <span className="summary-value">{experiment.buyDate}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Kjøpspris</span>
              <span className="summary-value">{experiment.buyPrice}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salgsdato</span>
              <span className="summary-value">{experiment.sellDate}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salgspris</span>
              <span className="summary-value">{experiment.sellPrice}</span>
            </div>
            {profitAmount !== null && (
              <div className="summary-item">
                <span className="summary-label">Gevinst/Tap</span>
                <span
                  className={`summary-value summary-pnl ${profitAmount >= 0 ? 'positive' : 'negative'}`}
                >
                  {profitAmount >= 0 ? '+' : ''}
                  {profitAmount.toFixed(2)}
                </span>
              </div>
            )}
            {profitPercent !== null && (
              <div className="summary-item">
                <span className="summary-label">Prosent</span>
                <span
                  className={`summary-value summary-pnl ${profitPercent >= 0 ? 'positive' : 'negative'}`}
                >
                  {profitPercent >= 0 ? '+' : ''}
                  {profitPercent.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCompleted && (
        <div className="experiment-add-chart">
          <form onSubmit={handleAddChart}>
            <div className="input-group">
              <label htmlFor="svr-start">
                SVR Start Date:
                <input
                  id="svr-start"
                  type="text"
                  value={svrStartDate}
                  onChange={(e) => setSvrStartDate(e.target.value)}
                  pattern="\d{1,2}\.\d{1,2}\.\d{4}"
                  title="Date in format dd.mm.yyyy"
                  list="svr-start-dates"
                />
                <datalist id="svr-start-dates">
                  {availableDates.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </label>
            </div>
            <button
              type="submit"
              disabled={!svrStartDate || addChart.isPending}
            >
              {addChart.isPending ? 'Running SVR...' : '+ Add SVR Chart'}
            </button>
          </form>
          {addChart.isError && (
            <div className="error">Error: {addChart.error.message}</div>
          )}
        </div>
      )}

      {!isCompleted && (
        <SupportLineEditor
          experimentId={experimentId}
          supportLines={experiment.supportLines}
        />
      )}

      {isCompleted && (
        <p className="experiment-completed-note">
          Eksperimentet er avsluttet. Ingen nye SVR-charts eller støttelinjer
          kan legges til.
        </p>
      )}

      {experiment.charts.length === 0 ? (
        <p className="experiment-empty">No SVR charts yet. Add one above.</p>
      ) : (
        experiment.charts.map((chart) => (
          <ExperimentChartWrapper
            key={chart.id}
            experimentId={experimentId}
            chart={chart}
            stockData={stockData}
            supportLines={experiment.supportLines}
            buyDate={experiment.buyDate ?? undefined}
            buyPrice={experiment.buyPrice ?? undefined}
            sellDate={experiment.sellDate ?? undefined}
            sellPrice={experiment.sellPrice ?? undefined}
            onDelete={() => handleDeleteChart(chart.id)}
          />
        ))
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal wrapper that fetches chart data and renders StockChart
// ---------------------------------------------------------------------------
import type {
  DataPoint,
  ExperimentChart as ExperimentChartType,
  SupportLine,
} from '../types'

interface ExperimentChartWrapperProps {
  experimentId: string
  chart: ExperimentChartType
  stockData: DataPoint[]
  supportLines: SupportLine[]
  buyDate?: string
  buyPrice?: number
  sellDate?: string
  sellPrice?: number
  onDelete: () => void
}

const ExperimentChartWrapper: FC<ExperimentChartWrapperProps> = ({
  experimentId,
  chart,
  stockData,
  supportLines,
  buyDate,
  buyPrice,
  sellDate,
  sellPrice,
  onDelete,
}) => {
  const {
    data: chartData,
    isLoading,
    error,
  } = useExperimentChartData(experimentId, chart.id)

  if (isLoading) return <Loading message="Loading chart data..." />
  if (error) return <div className="error">Error: {error.message}</div>

  const displayData = chartData ?? stockData

  return (
    <div className="chart-panel">
      <div className="chart-panel-header">
        <span className="chart-label">SVR from {chart.svrStartDate}</span>
        <button
          type="button"
          className="remove-button"
          onClick={onDelete}
          title="Remove chart"
        >
          ✕
        </button>
      </div>
      <StockChart
        data={displayData}
        supportLines={supportLines}
        buyMarker={
          buyDate && buyPrice != null
            ? { date: buyDate, price: buyPrice }
            : undefined
        }
        sellMarker={
          sellDate && sellPrice != null
            ? { date: sellDate, price: sellPrice }
            : undefined
        }
      />
    </div>
  )
}

export default ExperimentView
