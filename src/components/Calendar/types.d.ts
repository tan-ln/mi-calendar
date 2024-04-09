export interface DateInfo {
  
}

type Holiday = {
  day: string
  name: string
  isWork: boolean
}

export type DaysInMonth = {
  week: string
  value: number
  month: number
  // 阳历
  lunar: string
  // 节气
  jieqi?: string
  // 阳历节日
  solar_festivals: string[]
  // 阴历节日
  lunar_festivals: string[]
  // 阴历其它节日
  lunar_festivals2?: string[]
  // 节假日
  holiday: Holiday | null
}

export type FullYearDay = {
  year: number
  month: number
  days: DaysInMonth[]
}
