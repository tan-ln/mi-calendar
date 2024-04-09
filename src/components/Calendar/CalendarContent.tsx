import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Month from './components/Month'
import Week from './components/Week'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FullYearDay } from './types'
import { useEventListener, useMemoizedFn } from 'ahooks'
import React from 'react'
import { Timeout } from 'ahooks/lib/useRequest/src/types'

interface Props {
  fullYearDays: FullYearDay[]
  dateOnView: string | Dayjs

  updateDateOnView: (year: number, month: number, day: number) => void
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

  const checkIsDateOnView = useMemoizedFn((_dateOnView: string | Dayjs, year: number, month: number, day: number) => {
    return dayjs(`${year}-${month}-${day}`).isSame(dayjs(_dateOnView), 'day')
  })

  const checkIsToday = useMemoizedFn((year: number, month: number, day: number) => {
    return dayjs(`${year}-${month}-${day}`).isSame(dayjs(), 'day')
  })

  useLayoutEffect(() => {
    dateOnViewRef.current = dateOnView
  }, [dateOnView])

  useEffect(() => {
    // console.log('dateOnView', dayjs(dateOnView).year(), dayjs(dateOnView).month())
    const targetYear = dayjs(dateOnView).year()
    const targetMonth = dayjs(dateOnView).month() + 1
    const targetIdx = fullYearDays.findIndex(v => v.year === targetYear && v.month === targetMonth)
    if (targetIdx !== -1) {
      setMonthList(
        fullYearDays.slice(targetIdx - 1, targetIdx + 2)
      )
    }
  }, [dateOnView, fullYearDays])

  useLayoutEffect(() => {
    observerRef.current?.disconnect()
    observerRef.current = undefined
    monthListRef.current?.scrollTo({
      left: window.innerWidth,
      behavior: 'instant'
    })
  }, [monthList])
  
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
      if (deltaX > 0) {
        if (!directionRef.current) {
          directionRef.current = 'left'
        }

        if (directionRef.current !== 'left') {
          event.preventDefault()
        }
      } else {
        // 下一月
        if (!directionRef.current) {
          directionRef.current = 'right'
        }

        if (directionRef.current !== 'right') {
          event.preventDefault()
        }
      }
    }
  }
  
  useEffect(() => {
    monthListRef.current?.addEventListener('scroll', function (event) {
      startScrollLeftRef.current = monthListRef.current?.scrollLeft || 0
      !observerRef.current && doObserver?.current?.()
      // observerRef.current?.disconnect()
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
      !observerRef.current && doObserver?.current?.()
    })
    monthListRef.current?.addEventListener('touchmove', handleTouch)
  }, [])

  const timer = useRef<Timeout>();
  const topValue = useRef<number>(0);
  useEventListener(
    'scroll',
    () => {
      clearTimeout(timer.current)
      topValue.current = monthListRef.current?.scrollTop || 0;
      timer.current = setTimeout(()=>{
        if(monthListRef.current?.scrollTop === topValue.current) {
          // const position = {
          //   top: monthListRef.current.scrollTop,
          //   left: monthListRef.current.scrollLeft
          // };
          // 滚动停止
          if (observerRef.current && touchRef.current.touchX === 0 && touchRef.current.touchY === 0) {
            console.log('滚动停止')
            observerRef.current?.disconnect()
            observerRef.current = undefined
            directionRef.current = null

            setUpdateElement(state => state + 1)
            if (maxElement?.id) {
              const idStr = maxElement?.id
              const year = idStr.slice(0, 4)
              const month = idStr.replace(year, '')
              const day = dayjs().format('DD')
              updateDateOnView(
                Number(year),
                Number(month),
                Number(day)
              )
            }
          }
        }
      }, 80);
    },
    { target: monthListRef },
  );

  // 监听页面滚动后子元素在可视区显示的最大值
  // 将最大的元素完整的显示在可视区内
  const [maxElement, setMaxElement] = useState<Element | null>(null)
  const [updateElement, setUpdateElement] = useState<number>(0)
  const observerRef = useRef<IntersectionObserver>()
  const doObserver = useRef<() => void>()
  doObserver.current = function () {
    observerRef.current = new IntersectionObserver(entries => {
      let maxArea = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const area = entry.intersectionRect.width * entry.intersectionRect.height;
          if (area > maxArea) {
            maxArea = area;
            setMaxElement(entry.target)
            setUpdateElement(state => state + 1)
          }
        }
      });
    }, { threshold: [0, 0.5, 1] });

    const children = monthListRef.current?.childNodes;
    children?.forEach(child => observerRef?.current?.observe(child as Element));
  }

  useEffect(() => {
    maxElement?.scrollIntoView({
      behavior: "smooth",
      inline: "start"
    })
  }, [maxElement, updateElement])

  return (<>
    <div className="my-5 flex overflow-x-auto" ref={monthListRef}>
      {
        monthList.length > 0 && monthList.map(mon => (
          <div ref={React.createRef()} key={`${mon.year}${mon.month}`} id={`${mon.year}${mon.month}`} className='w-screen'>
            <Week {...mon} />
            <Month
              dateOnView={dateOnView}
              checkIsToday={checkIsToday}
              checkIsDateOnView={checkIsDateOnView}
              onSelectDate={updateDateOnView}
              {...mon}
            />
          </div>
        ))
      }
    </div>
    {
      dayjs(dateOnView).format('YYYY-MM-DD')
    }
    {
      directionRef.current
    }
  </>)
}

export default Index
