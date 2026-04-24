export interface DataPoint {
  timeStamp: number
  date: string
  open?: number
  high?: number
  low?: number
  last: number
  volume?: number
  prediction?: number | null
  upper_epsilon?: number | null
  lower_epsilon?: number | null
  svr_isBull?: boolean
}

export interface ApiResponse {
  success: boolean
  data: DataPoint[]
  error?: string
}

export interface FetchDataRequest {
  filename: string
  startdate?: string
  enddate?: string
  svr_startdate?: string
  svr_enddate?: string
}

export interface ChartLayout {
  id: string
  startDate: string
  endDate: string
  svrStartDate: string
  svrEndDate: string
}

export interface Resource {
  id: string
  name: string
  url: string
  charts: ChartLayout[]
}

export interface ResourcesApiResponse {
  success: boolean
  data: Resource[]
  error?: string
}

export interface SupportLine {
  id: string
  label: string
  price: number
}

export interface ExperimentChart {
  id: string
  svrStartDate: string
  dataFile: string
}

export interface Experiment {
  id: string
  name: string
  stockId: string
  startDate: string
  endDate: string
  createdAt: string
  buyDate?: string | null
  buyPrice?: number | null
  sellDate?: string | null
  sellPrice?: number | null
  completedAt?: string | null
  supportLines: SupportLine[]
  charts: ExperimentChart[]
}

export interface ExperimentSummary {
  id: string
  name: string
  stockId: string
  chartCount: number
  createdAt: string
  startDate: string
  completedAt?: string | null
  buyDate?: string | null
  buyPrice?: number | null
  sellDate?: string | null
  sellPrice?: number | null
  profitPercent?: number | null
}
