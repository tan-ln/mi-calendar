import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useLocalStorageState, useDebounceFn } from 'ahooks'
import CalenderHeader from './CalendarHeader'
import CalenderContent from './CalendarContent'
import { getFullYearDay } from './utils'
import { FullYearDay } from './types'

const Index = () => {
  const [dateInfo, setDateInfo] = useState({
    today: dayjs(),
    dateOnView: dayjs()
  })

  const [fullYearDays, setFullYearDays] = useLocalStorageState<FullYearDay[]>('mi-calendar-fullYearDays', {
    defaultValue: []
  })

  useEffect(() => {
    // if (!fullYearDays || !fullYearDays.length) {
      setFullYearDays(
        getFullYearDay(
          dayjs().year(),
        )
      )
    // }

  }, [])

  const updateDateOnView = useDebounceFn((year: number, month: number, day: number = 1) => {
    console.log('updateDateOnView', year, month, day)
    setDateInfo(dateInfo => ({
      ...dateInfo,
      dateOnView: dayjs(`${year}-${month}-${day}`)
    }))
  }, {
    wait: 200
  }).run

  console.log('render')

  return (<>
    <div className='w-full flex flex-col py-5'>
      <CalenderHeader
        { ...dateInfo }
      />
      <CalenderContent
        dateOnView={dateInfo.dateOnView}
        fullYearDays={fullYearDays || []}
        updateDateOnView={updateDateOnView}
      />
    </div>
  </>)
}

export default Index
