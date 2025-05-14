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
    plugins: {
      // ซ่อน legend ทั้งหมด
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'แผนภูมิเส้นแสดงยอดขาย 7 วันล่าสุด'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${(context.parsed.y).toLocaleString('th-TH')} บาท`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'ยอดขาย (บาท)'
        },
        ticks: {
          // ซ่อน label บนแกน y
          // display: false, // ถ้าต้องการซ่อน label แกน y ให้เปิดใช้บรรทัดนี้
        }
      },
      x: {
        title: {
          display: true,
          text: 'วันที่'
        },
        ticks: {
          // ซ่อน label บนแกน x
          // display: false, // ถ้าต้องการซ่อน label แกน x ให้เปิดใช้บรรทัดนี้
        }
      }
    }
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
          daysWeek.unshift(presentDay.toLocaleDateString('th-TH'));

          const thisDayOrders = orders.data.RESULT_DATA.filter(x => {
            const d = new Date(x.createdAt);
            if(presentDay.toLocaleDateString('th-TH') === d.toLocaleDateString('th-TH')) {
              return x;
            }
          })

          let tempTotalIncome = 0;
          thisDayOrders.map(x => tempTotalIncome += parseFloat(x.total));
          totalIncomeWeek.unshift(tempTotalIncome);
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
      <div className="card-body income-line-chart">
        <header className='d-flex justify-content-between align-items-center mb-3'>
          <h5 className='mb-0'>Recent Week Income<span></span></h5>
        </header>
        <div className='income-line-chart-container'>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}