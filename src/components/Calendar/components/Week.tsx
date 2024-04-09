import { weekMap } from '../utils'

interface Props {
  year: number
  month: number
}

const Index = ({
  year,
  month
}: Props) => {
  return (<>
    <div className='grid grid-cols-7 w-screen mb-3'>
      {
        weekMap[0].map(week => (
          <span
            key={`${year}${month}${week}`} className='flex items-center justify-center text-center text-gray-400 text-xs'
          >{ week }</span>
        ))
      }
    </div>
  </>)
}

export default Index
