import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

interface Props {
  today: string | Dayjs
  dateOnView: string | Dayjs
}

const Index = ({
  dateOnView,
}: Props) => {

  return (<>
    <div
      className="flex flex-nowrap justify-between mx-3"
    >
      <div className="">
        <span className="font-bold text-2xl text-gray-950">{ dayjs(dateOnView).format('YYYY年MM月') }</span>
        <span className="text-xs font-normal text-gray-700 ml-1">{ dayjs(dateOnView).format('dddd') }</span>
      </div>
      <div className="flex items-center">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4413" width="30" height="20"><path d="M384 896C384 825.307552 440.814697 768 512 768 582.692448 768 640 824.814694 640 896 640 966.692448 583.185303 1024 512 1024 441.307552 1024 384 967.185306 384 896ZM384 512C384 441.307552 440.814697 384 512 384 582.692448 384 640 440.814697 640 512 640 582.692448 583.185303 640 512 640 441.307552 640 384 583.185303 384 512ZM384 128C384 57.307552 440.814697 0 512 0 582.692448 0 640 56.814697 640 128 640 198.692448 583.185303 256 512 256 441.307552 256 384 199.185303 384 128Z" fill="#030712" p-id="4414" data-spm-anchor-id="a313x.search_index.0.i2.42ff3a817bB113"></path></svg>
      </div>
    </div>  
  </>)
}

export default Index
