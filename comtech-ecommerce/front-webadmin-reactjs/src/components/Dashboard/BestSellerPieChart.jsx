import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function BestSellerPieChart() {

  const data = {
    labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม'],
    datasets: [
      {
        label: 'ยอดขาย',
        data: [12, 16, 3, 5, 2],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };
  
  const options = {
    responsive: true,
    // options ต่างๆ
  };

  return (
    <div className="card">
      <div className="card-body" style={{height: 555}}>
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Best Seller Product<span></span></h5>
        </header>
        <div>
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  )
}