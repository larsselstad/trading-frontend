import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type {
  DataPoint,
  Experiment,
  ExperimentChart,
  ExperimentSummary,
  SupportLine,
} from '../types'

interface ApiResponseWrapper<T> {
  success: boolean
  data: T
  error?: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const { data: result } = await axios.get<ApiResponseWrapper<T>>(url)
  if (!result.success) {
    throw new Error(result.error || 'Request failed')
  }
  return result.data
}

export function useExperimentList() {
  return useQuery<ExperimentSummary[], Error>({
    queryKey: ['experiments'],
    queryFn: () => fetchJson<ExperimentSummary[]>('/api/experiments'),
  })
}

export function useExperiment(id: string | null) {
  return useQuery<Experiment, Error>({
    queryKey: ['experiment', id],
    queryFn: () => fetchJson<Experiment>(`/api/experiments/${id}`),
    enabled: !!id,
  })
}

export function useExperimentStockData(id: string | null) {
  return useQuery<DataPoint[], Error>({
    queryKey: ['experiment-stock-data', id],
    queryFn: () => fetchJson<DataPoint[]>(`/api/experiments/${id}/stock-data`),
    enabled: !!id,
  })
}

export function useExperimentChartData(
  id: string | null,
  chartId: string | null,
) {
  return useQuery<DataPoint[], Error>({
    queryKey: ['experiment-chart-data', id, chartId],
    queryFn: () =>
      fetchJson<DataPoint[]>(`/api/experiments/${id}/charts/${chartId}/data`),
    enabled: !!id && !!chartId,
  })
}

export function useCreateExperiment() {
  const queryClient = useQueryClient()
  return useMutation<
    Experiment,
    Error,
    { name: string; stockId: string; startDate: string; endDate?: string }
  >({
    mutationFn: async (body) => {
      const { data: result } = await axios.post<ApiResponseWrapper<Experiment>>(
        '/api/experiments',
        body,
      )
      if (!result.success) throw new Error(result.error || 'Failed to create')
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] })
    },
  })
}

export function useDeleteExperiment() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { data: result } = await axios.delete<ApiResponseWrapper<null>>(
        `/api/experiments/${id}`,
      )
      if (!result.success) throw new Error(result.error || 'Failed to delete')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] })
    },
  })
}

export function useAddChart(experimentId: string) {
  const queryClient = useQueryClient()
  return useMutation<ExperimentChart, Error, { svrStartDate: string }>({
    mutationFn: async (body) => {
      const { data: result } = await axios.post<
        ApiResponseWrapper<ExperimentChart>
      >(`/api/experiments/${experimentId}/charts`, body)
      if (!result.success)
        throw new Error(result.error || 'Failed to add chart')
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['experiment', experimentId],
      })
    },
  })
}

export function useDeleteChart(experimentId: string) {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (chartId) => {
      const { data: result } = await axios.delete<ApiResponseWrapper<null>>(
        `/api/experiments/${experimentId}/charts/${chartId}`,
      )
      if (!result.success)
        throw new Error(result.error || 'Failed to delete chart')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['experiment', experimentId],
      })
    },
  })
}

export function useUpdateSupportLines(experimentId: string) {
  const queryClient = useQueryClient()
  return useMutation<Experiment, Error, SupportLine[]>({
    mutationFn: async (supportLines) => {
      const { data: result } = await axios.put<ApiResponseWrapper<Experiment>>(
        `/api/experiments/${experimentId}/support-lines`,
        { supportLines },
      )
      if (!result.success) throw new Error(result.error || 'Failed to update')
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['experiment', experimentId],
      })
    },
  })
}

export function useRecordBuy(experimentId: string) {
  const queryClient = useQueryClient()
  return useMutation<
    Experiment,
    Error,
    { buyDate: string; buyPrice?: number | null }
  >({
    mutationFn: async (body) => {
      const { data: result } = await axios.put<ApiResponseWrapper<Experiment>>(
        `/api/experiments/${experimentId}/buy`,
        body,
      )
      if (!result.success)
        throw new Error(result.error || 'Failed to record buy')
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiment', experimentId] })
      queryClient.invalidateQueries({ queryKey: ['experiments'] })
    },
  })
}

export function useRecordSell(experimentId: string) {
  const queryClient = useQueryClient()
  return useMutation<
    Experiment,
    Error,
    { sellDate: string; sellPrice?: number | null }
  >({
    mutationFn: async (body) => {
      const { data: result } = await axios.put<ApiResponseWrapper<Experiment>>(
        `/api/experiments/${experimentId}/sell`,
        body,
      )
      if (!result.success)
        throw new Error(result.error || 'Failed to record sell')
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiment', experimentId] })
      queryClient.invalidateQueries({ queryKey: ['experiments'] })
    },
  })
}
