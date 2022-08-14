import React  from 'react'
import dynamic from 'next/dynamic'
import Spinner from './Spinner'
import { chartOptions } from './PriceChart.config'
import { IEvents, IProp } from './lib/type'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const priceSymbol = (lastPriceChange: any) => {
  let output
  if (lastPriceChange === '+') {
    output = <span className="text-success">&#9650;</span> // Green up tiangle
  } else {
    output = <span className="text-danger">&#9660;</span> // Red down triangle
  }
  return (output)
}

interface Props {
  dados: IProp;
  events: IEvents;
}

const PriceChart = ({ dados, events }: Props) => {
  const { tokenName, priceChart } = dados
  const showPriceChart = (priceChart: any) => {


    return (
      <div className="price-chart ">
        <div className="price">
          <h4 className="pricecharth4">
            {tokenName}/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}
          </h4>

        </div>
        {(typeof window !== 'undefined') &&
          <Chart className="chart" options={chartOptions} series={priceChart.series} type='candlestick' width={'100%'} height={'100%'} />
        }
      </div>
    )
  }


  return (
    <div className="card bg-transparent ">

      <div className="card-body " >

        {true ? showPriceChart(priceChart) : <Spinner />}
      </div>
    </div>
  )

}

export default PriceChart;