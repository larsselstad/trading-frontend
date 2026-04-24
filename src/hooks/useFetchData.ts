import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { ApiResponse, DataPoint } from '../types'

interface UseFetchDataParams {
  filename: string
  startdate?: string
  enddate?: string
  svr_startdate?: string
  svr_enddate?: string
  enabled?: boolean
}

async function fetchData(params: UseFetchDataParams): Promise<DataPoint[]> {
  const { enabled: _, ...queryParams } = params

  // Remove empty string values so they aren't sent as query params
  const cleanParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) cleanParams[key] = value
  }

  const endpoint =
    params.svr_startdate || params.svr_enddate ? '/api/plot' : '/api/data'

  const { data: result } = await axios.get<ApiResponse>(endpoint, {
    params: cleanParams,
  })

  if (!result.success) {
    throw new Error(result.error || 'Unknown error occurred')
  }

  return result.data
}

export function useFetchData({
  filename,
  startdate,
  enddate,
  svr_startdate,
  svr_enddate,
}: UseFetchDataParams) {
  return useQuery<DataPoint[], Error>({
    queryKey: [
      'data',
      filename,
      startdate,
      enddate,
      svr_startdate,
      svr_enddate,
    ],
    queryFn: () =>
      fetchData({ filename, startdate, enddate, svr_startdate, svr_enddate }),
  })
}
