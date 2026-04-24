import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { useDeleteExperiment, useExperimentList } from '../hooks/useExperiments'
import type { ExperimentSummary } from '../types'

const ExperimentList: FC = () => {
  const navigate = useNavigate()
  const { data: experiments, isLoading, error } = useExperimentList()
  const deleteExperiment = useDeleteExperiment()

  if (isLoading) return <Loading message="Loading experiments..." />
  if (error) return <div className="error">Error: {error.message}</div>

  const handleDelete = (e: React.MouseEvent, exp: ExperimentSummary) => {
    e.stopPropagation()
    if (confirm(`Delete experiment "${exp.name}"?`)) {
      deleteExperiment.mutate(exp.id)
    }
  }

  return (
    <div className="experiment-list">
      <div className="experiment-list-header">
        <h2>Experiments</h2>
        <button type="button" onClick={() => navigate('/experiments/new')}>
          + New Experiment
        </button>
      </div>

      {!experiments || experiments.length === 0 ? (
        <p className="experiment-empty">
          No experiments yet. Create one to get started.
        </p>
      ) : (
        <div className="experiment-table-wrapper">
          <table className="experiment-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Aksje</th>
                <th>Start</th>
                <th>Kjøpspris</th>
                <th>P/L %</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp) => {
                const isCompleted = !!exp.completedAt
                return (
                  <tr
                    key={exp.id}
                    className="experiment-table-row"
                    onClick={() => navigate(`/experiments/${exp.id}`)}
                  >
                    <td className="experiment-name-cell">
                      <span className="experiment-name-link">{exp.name}</span>
                    </td>
                    <td>{exp.stockId}</td>
                    <td>{exp.startDate}</td>
                    <td>
                      {exp.buyPrice != null ? exp.buyPrice.toFixed(2) : '–'}
                    </td>
                    <td>
                      {exp.profitPercent != null ? (
                        <span
                          className={
                            exp.profitPercent >= 0 ? 'positive' : 'negative'
                          }
                        >
                          {exp.profitPercent >= 0 ? '+' : ''}
                          {exp.profitPercent.toFixed(2)}%
                        </span>
                      ) : (
                        '–'
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${isCompleted ? 'status-completed' : 'status-active'}`}
                      >
                        {isCompleted ? 'Avsluttet' : 'Aktiv'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="remove-button"
                        type="button"
                        onClick={(e) => handleDelete(e, exp)}
                        title="Delete experiment"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ExperimentList
