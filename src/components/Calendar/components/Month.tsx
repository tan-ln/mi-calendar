import { useRef } from "react"
// import dayjs from 'dayjs'
import { useLocalStorageState } from 'ahooks'
import { DaysInMonth, FullYearDay } from "../types"
import type { Dayjs } from 'dayjs'
import { weekMap } from '../utils'

interface Props {
  dateOnView: string | Dayjs
  year: number
  month: number
  days: DaysInMonth[]

  checkIsToday: (year: number, month: number, day: number) => boolean
  checkIsDateOnView: (_dateOnView: string | Dayjs, year: number, month: number, day: number) => boolean
  onSelectDate: (year: number, month: number, day: number) => void
}

const Index = ({
  days,
  year,
  month,
  dateOnView,
  checkIsToday,
  checkIsDateOnView,
  onSelectDate,
}: Props) => {
  const borderClassName = true || 'border-0.5 border-solid border-slate-800'
  const [fullYearDays] = useLocalStorageState<FullYearDay[]>('mi-calendar-fullYearDays')

  const ref = useRef<HTMLDivElement>(null)
  // useLayoutEffect(() => {
  //   // console.log('month scrollIntoView', month, dayjs(dateOnView).month(), ref.current)
  //   if (
  //     year === dayjs(dateOnView).year() &&
  //     month === dayjs(dateOnView).month() + 1
  //   ) {
  //     ref.current?.scrollIntoView({
  //       // behavior: "smooth",
  //       inline: "start"
  //     })
  //   }
  // }, [dateOnView, year, month])

  const correctWeeks = (data: DaysInMonth[]) => {
    const weekOfFirstDay = data[0].week
    const prefIndexOfWeek = weekMap[2].indexOf(weekOfFirstDay)
    const prevMonth = fullYearDays?.find(v => v.year === year && v.month === month + 1)?.days || []
    const prevDays = prefIndexOfWeek && prevMonth.slice(-1 * prefIndexOfWeek) || []

    const weekOfLastDay = data.slice(-1)[0].week
    const lastIndexOfWeek = weekMap[2].indexOf(weekOfLastDay)
    const nextMonth = fullYearDays?.find(v => v.year === year && v.month === month + 1)?.days || []
    const nextDays = nextMonth.slice(0, 7 - lastIndexOfWeek - 1) || []
    
    return [
      ...prevDays,
      ...data,
      ...nextDays
    ]
  }

  return (<>
    <div className={`grid grid-cols-7 gap-x-0 gap-y-2 w-screen px-[2vw] min-h-[46vh] ${borderClassName}`} ref={ref}>
      {
        correctWeeks(days).map((day) => (
          <div
            key={`${day.month}${day.value}`}
            className={`flex flex-col items-center justify-center text-center relative px-0.5
              gap-0
              ${borderClassName}
              ${checkIsDateOnView(dateOnView, year, day.month, day.value) && checkIsToday(year, day.month, day.value) && 'bg-blue-500 rounded-lg'}
              ${checkIsDateOnView(dateOnView, year, day.month, day.value) && !checkIsToday(year, day.month, day.value) && 'bg-gray-200 rounded-lg'}
            `}
            style={{
              height: 'calc(100vw / 7)'
            }}
            onClick={() => onSelectDate(year, day.month, day.value)}
          >
            {/* 日期 */}
            <span className={`
              relative
              font-medium text-xl text-gray-800
              ${day.month !== month && 'opacity-25'}
              ${checkIsToday(year, day.month, day.value) && checkIsDateOnView(dateOnView, year, day.month, day.value) && 'text-white'}
            `}>
              { day.value }
              {/* 法定休假/调休 */}
              {
                !!day.holiday && (<>
                  <span className={`absolute -right-[14px] -top-[2px ] scale-90 text-xs
                    ${day.holiday.isWork ? 'text-red-500' : 'text-green-500'}
                  `}>
                    {day.holiday.isWork ? '班' : '休'}
                  </span>
                </>)
              }
            </span>
            {/* 节假日/阴历 */}
            <span className={`
              text-xs font-light overflow-hidden text-ellipsis text-nowrap w-full
              ${(day.jieqi || day.solar_festivals?.[0] || day.lunar_festivals?.[0]) ? 'text-blue-500' : 'text-gray-400'}
              ${day.month !== month && 'opacity-55'}
              ${checkIsToday(year, day.month, day.value) && checkIsDateOnView(dateOnView, year, day.month, day.value) && 'text-white'}
            `}>
              {
                day.solar_festivals?.[0] ||
                day.lunar_festivals?.[0] ||
                day.lunar_festivals2?.[0] ||
                day.jieqi ||
                day.lunar
              }
            </span>
          </div>
        ))
      }
      </div>
  </>)
}

export default Index
