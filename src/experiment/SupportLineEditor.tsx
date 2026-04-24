import { type FC, type SubmitEvent, useState } from 'react'
import { useUpdateSupportLines } from '../hooks/useExperiments'
import type { SupportLine } from '../types'

interface SupportLineEditorProps {
  experimentId: string
  supportLines: SupportLine[]
}

const SupportLineEditor: FC<SupportLineEditorProps> = ({
  experimentId,
  supportLines,
}) => {
  const [label, setLabel] = useState('')
  const [price, setPrice] = useState('')
  const updateSupportLines = useUpdateSupportLines(experimentId)

  const handleAdd = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = Number.parseFloat(price)
    if (!label.trim() || Number.isNaN(parsed)) return

    const newLine: SupportLine = {
      id: crypto.randomUUID(),
      label: label.trim(),
      price: parsed,
    }
    updateSupportLines.mutate([...supportLines, newLine])
    setLabel('')
    setPrice('')
  }

  const removeLine = (id: string) => {
    updateSupportLines.mutate(supportLines.filter((l) => l.id !== id))
  }

  return (
    <div className="support-line-editor">
      <div className="support-line-header">
        <h3>Support Lines</h3>
      </div>

      <form className="support-line-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="support-line-label"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          step="0.01"
          className="support-line-price"
          required
        />
        <button
          type="submit"
          disabled={!label.trim() || !price || updateSupportLines.isPending}
        >
          + Add
        </button>
      </form>

      {supportLines.length === 0 ? (
        <p className="support-line-empty">No support lines.</p>
      ) : (
        <div className="support-line-list">
          {supportLines.map((line) => (
            <div key={line.id} className="support-line-row">
              <span className="support-line-label">{line.label}</span>
              <span className="support-line-price">{line.price}</span>
              <button
                type="button"
                className="remove-button"
                onClick={() => removeLine(line.id)}
                title="Remove line"
                disabled={updateSupportLines.isPending}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {updateSupportLines.isError && (
        <div className="error">
          Error saving: {updateSupportLines.error.message}
        </div>
      )}
    </div>
  )
}

export default SupportLineEditor
