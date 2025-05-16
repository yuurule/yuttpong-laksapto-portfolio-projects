import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import * as ProductService from '../../services/productService';
import * as OrderService from '../../services/orderService';
import * as StockService from '../../services/stockService';
import * as ReviewService from '../../services/reviewService';
import { formatTimestamp, formatMoney } from '../../utils/utils';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function ProductDetail() {

  const serverPath = import.meta.env.VITE_API_URL;
  const params = useParams();
  const [loadData, setLoadData] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productSpecs, setProductSpecs] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [saleAmount, setSaleAmount] = useState(0);
  const [latestSale, setLatestSale] = useState([]);
  const [stockActions, setStockActions] = useState([]);
  const [reviewData, setReviewData] = useState([]);

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

  useState(() => {
    const fecthData = async () => {
      setLoadData(true);
      try {
        const product = await ProductService.getOneProduct(params.id);
        const orders = await OrderService.getOrders({
          paymentStatus: 'PAID',
        });
        const stockAction = await StockService.getAllStockAction({
          productId: params.id
        });
        const reviews = await ReviewService.getReviewsByProduct(params.id);

        //============================================================================================

        const result = product.data.RESULT_DATA;
        //console.log(result)
        const resultProductSpecs = [
          { title: "Title", value: result.name },
          { title: "Screen size", value: result.specs.screen_size },
          { title: "Processor", value: result.specs.processor },
          { title: "Display", value: result.specs.display },
          { title: "Memory", value: result.specs.memory },
          { title: "Storage", value: result.specs.storage },
          { title: "Graphic", value: result.specs.graphic },
          { title: "Operating system", value: result.specs.operating_system },
          { title: "Camera", value: result.specs.camera },
          { title: "Optical drive", value: result.specs.optical_drive },
          { title: "Connection ports", value: result.specs.connection_ports },
          { title: "Wireless", value: result.specs.wireless },
          { title: "Battery", value: result.specs.battery },
          { title: "Color", value: result.specs.color },
          { title: "Dimension(WxDxH)", value: `${result.specs.dimension} cm` },
          { title: "Weight", value: result.specs.weight },
          { title: "Warranty", value: result.specs.warranty },
          { title: "Option", value: result.specs.option },
        ];
        let tempTotalSale = 0;
        let tempSaleAmount = 0;
        let tempLatestSale = [];
        orders.data.RESULT_DATA.map(i => {
          i.orderItems.map(y => {
            if(y.productId === parseInt(params.id)) {
              tempTotalSale += (parseFloat(y.product.price) * y.quantity);
              tempSaleAmount += y.quantity;
              tempLatestSale.push({
                orderId: i.id,
                quantity: y.quantity,
                datetime: i.createdAt
              })
            }
          });
        });

        const daysWeek = [];
        const totalIncomeWeek = [];
        for(let i = 0; i < 7; i++) {
          let presentDay = new Date();
          presentDay.setDate(presentDay.getDate() - i);
          daysWeek.unshift(presentDay.toLocaleDateString('th-TH'));

          let tempTotalIncome = 0;
          result.orderItems.map(x => {
            const d = new Date(x.order.createdAt);
            if(x.order.paymentStatus === 'PAID' && (presentDay.toLocaleDateString('th-TH') === d.toLocaleDateString('th-TH'))) {
              tempTotalIncome += parseFloat(x.sale_price) * x.quantity;
            }
          });
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

        setProductData(result);
        setProductSpecs(resultProductSpecs);
        setTotalSale(tempTotalSale);
        setSaleAmount(tempSaleAmount);
        setLatestSale(tempLatestSale);
        setStockActions(stockAction.data.RESULT_DATA);
        setReviewData(reviews.data.RESULT_DATA);
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
      finally {
        setLoadData(false);
      }
    }

    fecthData();
  }, [params.id]);

  const renderRating = () => {
    let result = 0;
    if(productData.reviews.length > 0) {
      productData.reviews.map(i => {
        result += parseFloat(i.rating);
      });
      return (result / productData.reviews.length);
    }
    else {
      return result;
    }
  }

  if(loadData) return <p>Loading...</p>
  if(productData === null) return <p>Something wrong...</p>

  return (
    <div className={`page detail-page product-detail`}>
      <header className="page-title smaller">
        <h1>{productData.name}</h1>
        <p>SKU: {productData.sku}</p>
      </header>

      <div className="row">
        <div className="col-12 mb-3">
          <div className='d-flex justify-content-end align-items-center'>
            <Link to={`/product/edit/${params.id}`} className='btn my-btn purple-btn big-btn px-5'><FontAwesomeIcon icon={faEdit} className='me-2' />Edit</Link>
            {/* <button 
              type="button"
              className='btn my-btn red-btn big-btn'
              onClick={null}
            ><FontAwesomeIcon icon={faTrash} className='me-2' />Delete</button> */}
          </div>
        </div>
        <div className='col-lg-9 left-col'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body header-detail'>
                  <div>
                    <figure className='image'>
                    {
                      productData.images.length > 0
                      ?
                      <img src={`${serverPath}/${productData.images[0].path}`} />
                      :
                      <img src="https://placehold.co/200x160" />
                    }
                    </figure>
                  </div>
                  <div className='feature-detail'>
                    <div className='feature-detail-item'>
                      <strong className='h3 d-block mb-1'>
                        ฿{formatMoney(productData.price)}
                      </strong>
                      <p className='mb-0 opacity-50'>Price</p>
                    </div>
                    <div className='feature-detail-item'>
                      <strong className='h3 d-block mb-1'>
                        ฿{formatMoney(totalSale)}
                      </strong>
                      <p className='mb-0 opacity-50'>Total Sale</p>
                    </div>
                    <div className='feature-detail-item'>
                      <strong className='h3 d-block mb-1'>
                        {saleAmount}
                      </strong>
                      <p className='mb-0 opacity-50'>Sale Amount</p>
                    </div>
                    <div className='feature-detail-item'>
                      <strong className='h3 d-block mb-1'>{renderRating()}</strong>
                      <p className='mb-0 opacity-50'>Rating</p>
                    </div>
                    <div className='feature-detail-item'>
                      <strong className='h3 d-block mb-1'>{productData.inStock.inStock}</strong>
                      <p className='mb-0 opacity-50'>In Stock</p>
                    </div>
                  </div>
                  <div style={{clear: 'both'}}></div>
                </div>
              </div>
            </div>
            <div className='col-sm-6 mb-3'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Specification<span></span></h5>
                  </header>
                  <table className='table detail-table'>
                    <tbody>
                      {
                        productSpecs.map((i, index) => (
                          <tr key={`product_specs_row_${index + 1}`}>
                            <td>
                              <strong>{i.title}</strong>
                            </td>
                            <td>{i.value}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>Latest Sale in 1 week<span></span></h5>
                    {/* <small>12 - 17 Jan 2025</small> */}
                  </header>
                  <div className='d-flex justify-content-center align-items-center my-3'>
                    <Line data={chartData} options={options} />
                  </div>
                </div>
              </div>

              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5 className='mb-0'>Latest Review by Customer<span></span></h5>
                  </header>
                  {
                    reviewData.map((i, index) => {
                      if(index < 3) {
                        return (
                          <div key={index} className='reviewItem'>
                            <p>"{i.message}"</p>
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>By : {i.createdBy.displayName}</span>
                              <span>{formatTimestamp(i.createdAt)}</span>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>

              <div className='card mb-3 show-1024'>
                <div className='card-body'>
                  <header>
                    <h5>Latest Sale History<span></span></h5>
                  </header>
                  {
                    latestSale.length > 0
                    ?
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>order ID</th>
                          <th>quantity</th>
                          <th>date/Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          latestSale.map((i, index) => {
                            if(index < 5) {
                              return (
                                <tr key={`sale_history_${i.orderId}`}>
                                  <td>#{i.orderId}</td>
                                  <td>x{i.quantity}</td>
                                  <td>{formatTimestamp(i.datetime)}</td>
                                </tr>
                              )
                            }
                          })
                        }
                      </tbody>
                    </table>
                    :
                    <p className='my-3 text-center opacity-50'>Not have sale</p>
                  }
                  
                </div>
              </div>

              <div className='card mb-3 show-1024'>
                <div className='card-body'>
                  <header>
                    <h5>Latest In Stock Action<span></span></h5>
                  </header>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>action</th>
                        <th>quantity</th>
                        <th>date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        stockActions.map((i, index) => {
                          if(index < 5) {
                            return (
                              <tr key={`stock_history_${index + 1}`}>
                                <td>{i.action}</td>
                                <td>x{i.quantity}</td>
                                <td>
                                  {formatTimestamp(i.actionedAt)}
                                  <small className='d-block opacity-50'>{i.actionedBy.displayName}</small>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className='col-lg-3 right-col'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Latest Sale History<span></span></h5>
                  </header>
                  {
                    latestSale.length > 0
                    ?
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>order ID</th>
                          <th>quantity</th>
                          <th>date/Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          latestSale.map((i, index) => {
                            if(index < 5) {
                              return (
                                <tr key={`sale_history_${i.orderId}`}>
                                  <td>#{i.orderId}</td>
                                  <td>x{i.quantity}</td>
                                  <td>{formatTimestamp(i.datetime)}</td>
                                </tr>
                              )
                            }
                          })
                        }
                      </tbody>
                    </table>
                    :
                    <p className='my-3 text-center opacity-50'>Not have sale</p>
                  }
                  
                </div>
              </div>
            </div>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Latest In Stock Action<span></span></h5>
                  </header>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>action</th>
                        <th>quantity</th>
                        <th>date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        stockActions.map((i, index) => {
                          if(index < 5) {
                            return (
                              <tr key={`stock_history_${index + 1}`}>
                                <td>{i.action}</td>
                                <td>x{i.quantity}</td>
                                <td>
                                  {formatTimestamp(i.actionedAt)}
                                  <small className='d-block opacity-50'>{i.actionedBy.displayName}</small>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}