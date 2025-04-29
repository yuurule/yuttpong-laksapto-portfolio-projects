import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as ProductService from '../../services/productService';
import { toast } from 'react-toastify';

Chart.register(...registerables);

export default function BestSellerPieChart() {

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
        text: 'แผนภูมิแสดงสินค้าที่ขายดีที่สุด 5 รายการ'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${(context.parsed).toLocaleString('th-TH')} บาท`;
          }
        }
      }
    },
  };

  useEffect(() => {
  
    const fetchData = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getStatisticProduct({
          totalSale: 'desc'
        });

        const tempResultLabels = [];
        const tempResultDataValues = [];

        products.data.RESULT_DATA.map((i, index) => {
          if(index < 5) {
            tempResultLabels.push(i.name);
            let tempTotalSale = 0;
            i.orderItems.map(x => {
              if(x.order.paymentStatus === 'PAID') {
                tempTotalSale += parseFloat(x.sale_price) * x.quantity;
              }
            });
            tempResultDataValues.push(tempTotalSale);
          }
        })

        setChartData({
          labels: tempResultLabels,
          datasets: [
            {
              label: 'ยอดขาย',
              data: tempResultDataValues,
              backgroundColor: ['#b368ca', 'rgba(237,163,33,1)', '#1e9cec', '#38b35d', '#f66c6c',]
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
      <div className="card-body" style={{height: 555}}>
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Best Seller Product<span></span></h5>
        </header>
        <div className='mt-2 px-2'>
          <Pie data={chartData} options={options} />
          <table className='w-100 mt-4'>
            <tbody>
              {
                chartData.labels.map((i, index) => (
                  <tr>
                    <td style={{padding: '2px 5px 2px 0'}}><span style={{
                      width: 175, 
                      overflow: 'hidden',
                      display: 'block',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    ><span style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      backgroundColor: `${chartData.datasets[0].backgroundColor[index]}`,
                      marginRight: 8,
                    }}></span>{i}</span></td>
                    <td style={{padding: '2px 0 2px 5px', textAlign: 'right'}}>
                      ฿{(chartData.datasets[0].data[index]).toLocaleString('th-TH')}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}