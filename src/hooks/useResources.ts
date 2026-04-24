import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Resource, ResourcesApiResponse } from '../types'

async function fetchResources(): Promise<Resource[]> {
  const { data: result } =
    await axios.get<ResourcesApiResponse>('/api/resources')

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch resources')
  }

  return result.data
}

export function useResources() {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: fetchResources,
  })
}
