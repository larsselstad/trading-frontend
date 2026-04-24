interface LoadingProps {
  message?: string
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="loading">
      <p>{message}</p>
    </div>
  )
}
