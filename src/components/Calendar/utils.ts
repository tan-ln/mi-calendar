import dayjs from 'dayjs'
import { Solar, Lunar, HolidayUtil } from 'lunar-typescript'
import localeData from 'dayjs/plugin/localeData'
import zh from 'dayjs/locale/zh-cn'
import { DaysInMonth, FullYearDay } from './types';

dayjs.extend(localeData);
dayjs.locale(zh);

export const weekMap = [
  ['天', '一', '二', '三', '四', '五', '六'],
  ['周天', '周一', '周二', '周三', '周四', '周五', '周六'],
  ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
]

/**
 * 获取特定年份某个月的日期
 * @param year 
 * @param month 
 * @param format 
 * @returns 
 * @example
    getDaysInMonth(
      dayjs().year(),
      dayjs().month(),
      'D'
    )
 */
export const getDaysInMonth = (year: number, month: number, format: string = 'YYYY-MM-DD'): DaysInMonth[] => {
  // 获取该月的第一天
  // month 是从 0 开始的
  const firstDayOfMonth = dayjs().year(year).month(month - 1).startOf('month');

  // 获取该月的最后一天
  const lastDayOfMonth = firstDayOfMonth.endOf('month');

  // 获取该月的天数
  const daysInMonth = lastDayOfMonth.date();

  // 创建一个数组来存放该月的所有日期
  const allDatesInMonth = [];

  // 遍历该月的每一天
  for (let day = 1; day <= daysInMonth; day++) {
    // 添加该月的日期到数组
    const date = firstDayOfMonth.add(day - 1, 'day').format('YYYY-MM-DD')

    allDatesInMonth.push({
      value: Number(dayjs(date).format(format)),
      week: dayjs(date).format('dddd'),
      month: month,
      // 阴历
      lunar: Lunar.fromDate(new Date(date)).getDayInChinese(),
      // 节气
      jieqi: Lunar.fromDate(new Date(date)).getJieQi(),
      // 阳历节日
      solar_festivals: Solar.fromDate(new Date(date)).getFestivals(),
      // 阴历节日
      lunar_festivals: Lunar.fromDate(new Date(date)).getFestivals(),
      // 其它阴历节日
      // lunar_festivals2: Lunar.fromDate(new Date(date)).getOtherFestivals(),
      // 节假日
      holiday: HolidayUtil.getHoliday(date)
        ? {
          day: HolidayUtil.getHoliday(date)!.getDay(),
          name: HolidayUtil.getHoliday(date)!.getName(),
          isWork: HolidayUtil.getHoliday(date)!.isWork(),
        }
        : null,
    });
  }

  return allDatesInMonth
}

export const getFullYearDay = (year: number): FullYearDay[] => {
  const fullYearDays = []

  for (let month = 1; month <= 12; month++) {
    fullYearDays.push({
      year,
      month,
      days: getDaysInMonth(year, month, 'D')
    })
  }

  return fullYearDays
}
