import { useNavigate, useParams } from 'react-router-dom'
import { Charts } from '../components/Charts'
import { Loading } from '../components/Loading'
import { useResources } from '../hooks/useResources'

function StocksPage() {
  const { stockId = '' } = useParams<{ stockId: string }>()
  const navigate = useNavigate()
  const { data: resources, isLoading: resourcesLoading } = useResources()

  const selectedResource = resources?.find((r) => r.id === stockId)
  const displayName = selectedResource?.name ?? 'Chart'

  return (
    <>
      <h1>{displayName}</h1>

      {resourcesLoading ? (
        <Loading message="Loading resources..." />
      ) : !resources || resources.length === 0 ? (
        <Loading message="No resources available" />
      ) : (
        <>
          <div className="controls">
            <div className="input-group">
              <label htmlFor="resource">
                Stock:
                <select
                  id="resource"
                  name="resource"
                  value={stockId}
                  onChange={(e) => {
                    const id = e.target.value
                    if (id) {
                      navigate(`/stocks/${id}`)
                    } else {
                      navigate('/stocks')
                    }
                  }}
                >
                  <option value="">Select a stock</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {selectedResource && <Charts resource={selectedResource} />}
        </>
      )}
    </>
  )
}

export default StocksPage
