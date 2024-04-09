import { useEffect, useRef, useState } from 'react'
import Month from './components/Month'
import Week from './components/Week'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FullYearDay } from './types'
import { useDebounceFn } from 'ahooks'

interface Props {
  fullYearDays: FullYearDay[]
  dateOnView: string | Dayjs

  updateDateOnView: (year: number, month: number) => void
}

const Index = ({
  fullYearDays,
  dateOnView,
  updateDateOnView,
}: Props) => {
  const monthListRef = useRef<HTMLDivElement>(null)
  // const monthOnView = dayjs(dateOnView).month()
  const [monthList, setMonthList] = useState<FullYearDay[]>([])

  const dateOnViewRef = useRef<typeof dateOnView>()
  const startScrollLeftRef = useRef<number>(0)
  const touchRef = useRef({
    touchX: 0,
    touchY: 0,
  })

  const directionRef = useRef<'left' | 'right' | null>(null)

  useEffect(() => {
    dateOnViewRef.current = dateOnView
  }, [dateOnView])

  useEffect(() => {
    console.log('dateOnView', dayjs(dateOnView).year(), dayjs(dateOnView).month())
    // setMonthList(fullYearDays)
    const targetYear = dayjs(dateOnView).year()
    // console.log(fullYearDays, targetYear)
    // setMonthList(
    //   fullYearDays.filter(v => v.year === targetYear && v.month === targetMonth)
    // )
    const targetMonth = dayjs(dateOnView).month()
    const targetIdx = fullYearDays.findIndex(v => v.year === targetYear && v.month === targetMonth + 1)
    if (targetIdx !== -1) {
      // setMonthList([fullYearDays[targetIdx]])
      setMonthList(
        fullYearDays.slice(targetIdx - 1, targetIdx + 2)
      )
    }
  }, [dateOnView, fullYearDays])

  // useLayoutEffect(() => {
  //   const targetYear = dayjs(dateOnView).year()
  //   const targetMonth = dayjs(dateOnView).month()
  //   const targetIdx = fullYearDays.findIndex(v => v.year === targetYear && v.month === targetMonth)
  //   console.log(targetIdx, (targetIdx + 1) * document.body.clientWidth )
 
  // }, [])
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addPrevMonth = useRef<any>()
  addPrevMonth.current = useDebounceFn((year, month) => {
    const targetIdx = fullYearDays.findIndex(v => v.year === year && v.month === month)
    const existTarget = monthList.find(v => v.year === year && v.month === month)
    console.log(existTarget, monthList, 'existTarget')
    if (targetIdx !== -1 && !existTarget) {
      console.log(
        targetIdx,
        fullYearDays[targetIdx - 1],
        monthList,
      )
      // 暂未考虑 1月
      // setMonthList([
      //   fullYearDays[targetIdx - 1],
      //   ...monthList
      // ])
    }
  }, {
    wait: 200,
    leading: true,
  }).run

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addNextMonth = useRef<any>()
  addNextMonth.current = useDebounceFn((year, month) => {
    const targetIdx = fullYearDays.findIndex(v => v.year === year && v.month === month)
    const existTarget = monthList.find(v => v.year === year && v.month === month)
    console.log(existTarget, 'existTarget')
    if (targetIdx !== -1 && !existTarget) {
      console.log(
        targetIdx,
        fullYearDays[targetIdx + 1],
      )
      // 暂未考虑 12月
      // setMonthList([
      //   ...monthList,
      //   fullYearDays[targetIdx + 1]
      // ])
    }
  }, {
    wait: 200,
    leading: true,
  }).run

  const handleTouch = (event: TouchEvent) => {
    // 获取所有触摸点
    const touches = event.touches;

    // 假设只有一个触摸点，你可以根据实际情况处理多个触摸点
    const touch = touches[0];

    // 获取触摸点的 clientX 和 clientY
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    const deltaX = currentX - touchRef.current.touchX
    const deltaY = currentY - touchRef.current.touchY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 主要向左或向右移动
      // 上一月
      const targetYear = dayjs(dateOnViewRef.current).year()
      const targetMonth = dayjs(dateOnViewRef.current).month() + 1
      // console.log(Math.abs((monthListRef?.current?.scrollLeft || 0) - startScrollLeftRef.current - window.innerWidth))
      if (deltaX > 0) {
        // console.log('上一月', deltaX, targetYear, targetMonth);
        // monthListRef.current?.scrollTo({
        //   left: startScrollLeftRef.current - window.innerWidth,
        //   behavior: 'smooth'
        // })

        if (!directionRef.current) {
          directionRef.current = 'left'
          addPrevMonth?.current?.(targetYear, targetMonth - 1)
        }

        if (directionRef.current !== 'left') {
          event.preventDefault()
        }

        // updateDateOnView(
        //   targetYear === 1 ? targetYear - 1 : targetYear,
        //   targetMonth === 1 ? 12 : targetMonth - 1
        // )
      } else {
        // 下一月
        // console.log('下一月', deltaX, targetYear, targetMonth);
        // monthListRef.current?.scrollTo({
        //   left: startScrollLeftRef.current + window.innerWidth,
        //   behavior: 'smooth'
        // })

        if (!directionRef.current) {
          directionRef.current = 'right'
          addNextMonth?.current?.(targetYear, targetMonth + 1)
        }

        if (directionRef.current !== 'right') {
          event.preventDefault()
        }

        // updateDateOnView(
        //   targetYear === 12 ? targetYear + 1 : targetYear,
        //   targetMonth === 12 ? 1 : targetMonth + 1
        // )
      }
    }
  }
  
  useEffect(() => {
    monthListRef.current?.addEventListener('scroll', function (event) {
      startScrollLeftRef.current = monthListRef.current?.scrollLeft || 0
      event.preventDefault()
    })
    monthListRef.current?.addEventListener('touchstart', function (event) {
      startScrollLeftRef.current = monthListRef.current?.scrollLeft || 0
      // 获取所有触摸点
      const touches = event.touches;
      
      // 假设只有一个触摸点，你可以根据实际情况处理多个触摸点
      const touch = touches[0];
      
      // 获取触摸点的 clientX 和 clientY
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      touchRef.current = {
        touchX: currentX,
        touchY: currentY,
      }
    })
    monthListRef.current?.addEventListener('touchend', function () {
      touchRef.current = {
        touchX: 0,
        touchY: 0,
      }

      const targetYear = dayjs(dateOnViewRef.current).year()
      const targetMonth = dayjs(dateOnViewRef.current).month() + 1

      directionRef.current === 'left' && 
        updateDateOnView(
          targetYear === 1 ? targetYear - 1 : targetYear,
          targetMonth === 1 ? 12 : targetMonth - 1
        )

      directionRef.current === 'right' &&
        updateDateOnView(
          targetYear === 12 ? targetYear + 1 : targetYear,
          targetMonth === 12 ? 1 : targetMonth + 1
        )

      directionRef.current = null
    })
    monthListRef.current?.addEventListener('touchmove', handleTouch)
  }, [])

  return (<>
    <div className="my-5 flex overflow-x-auto" ref={monthListRef}>
      {
        monthList.length > 0 && monthList.map(mon => (
          <div key={`${mon.year}${mon.month}`} id={`${mon.year}${mon.month}`} className='w-screen'>
            <Week {...mon} />
            <Month
              dateOnView={dateOnView}
              {...mon}
            />
          </div>
        ))
      }
    </div>
    {
      dayjs(dateOnView).format('YYYY-MM-DD')
    }
  </>)
}

export default Index
