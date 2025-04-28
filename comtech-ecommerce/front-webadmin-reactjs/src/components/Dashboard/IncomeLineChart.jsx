import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as OrderService from '../../services/orderService';
import { toast } from 'react-toastify';

Chart.register(...registerables);

export default function IncomeLineChart() {

  const [loadData, setLoadData] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const options = {
    responsive: true,
    // options ต่างๆ
  };

  useEffect(() => {

    const fetchData = async () => {
      setLoadData(true);
      try {
        const orders = await OrderService.getOrders({
          paymentStatus: 'PAID'
        });

        const daysWeek = [];
        const totalIncomeWeek = [];
        for(let i = 0; i < 7; i++) {
          let presentDay = new Date();
          presentDay.setDate(presentDay.getDate() - i);
          daysWeek.unshift(presentDay.toLocaleDateString())

          let tempTotalIncome = 0;
          totalIncomeWeek.unshift(i * 100);
        }

        setChartData({
          labels: daysWeek,
          datasets: [
            {
              label: 'ยอดขาย',
              data: totalIncomeWeek,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
          ]
        });
      }
      catch(error) {
        console.log(error);
        toast.error(`Fetch data for income line chart is failed due to reason: ${error}`);
      }
      finally {
        setLoadData(false);
      }
    }

    fetchData();
  }, []);

  

  return (
    <div className="card">
      <div className="card-body" style={{height: 400}}>
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Recent Week Income<span></span></h5>
        </header>
        <div className='ps-4' style={{height: 330}}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}