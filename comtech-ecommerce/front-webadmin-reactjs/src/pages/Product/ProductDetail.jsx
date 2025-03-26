import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { toast } from 'react-toastify';
import * as ProductService from '../../services/productService';
import * as OrderService from '../../services/orderService';
import { formatTimestamp } from '../../utils/utils';

export default function ProductDetail() {

  const params = useParams();

  const [loadData, setLoadData] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productSpecs, setProductSpecs] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [latestSale, setLatestSale] = useState([]);

  useState(() => {

    const fecthData = async () => {
      setLoadData(true);
      try {
        const product = await ProductService.getOneProduct(params.id);
        const orders = await OrderService.getOrders();

        //console.log(product);
        const result = product.data.RESULT_DATA;
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
        const ordersPaidResult = orders.data.RESULT_DATA.filter(i => i.paymentStatus === 'PAID');
        let tempTotalSale = 0;
        let tempLatestSale = [];
        ordersPaidResult.map(i => {
          i.orderItems.map(y => {
            if(y.productId === parseInt(params.id)) {
              tempTotalSale += (parseFloat(y.product.price) * y.quantity);
              tempLatestSale.push({
                orderId: i.id,
                quantity: y.quantity,
                datetime: i.createdAt
              })
            }
          });
        });

        setProductData(result);
        setProductSpecs(resultProductSpecs);
        setTotalSale(tempTotalSale);
        setLatestSale(tempLatestSale);
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
    productData.reviews.map(i => {
      result += parseFloat(i.rating);
    });
    return (result / productData.reviews.length).toFixed(1);
  }

  if(loadData) return <p>Loading...</p>
  if(productData === null) return <p>Something wrong...</p>

  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-2">
          <div>
            <h1 className='h3 mb-0'>{productData.name}</h1>
            <p>SKU: {productData.sku}</p>
          </div>
          <div className='d-flex'>
            <Link to={`/product/edit/${params.id}`} className='btn btn-primary text-bg-primary px-4 me-3'><FontAwesomeIcon icon={faEdit} className='me-2' />Edit</Link>
            <button 
              type="button"
              className='btn btn-danger px-4'
              onClick={null}
            ><FontAwesomeIcon icon={faTrash} className='me-2' />Delete</button>
          </div>
        </header>
        <div className='col-sm-8'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body d-flex justify-content-between align-items-center py-0'>
                  <div>
                    <figure>
                      <img src="/images/dummy-product.jpg" style={{width: 200}} />
                    </figure>
                  </div>
                  <div className='d-flex align-items-center'>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>฿{parseFloat(productData.price).toLocaleString('th-TH')}</strong>
                      <p className='mb-0 opacity-50'>Price</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>฿{parseFloat(totalSale).toLocaleString('th-TH')}</strong>
                      <p className='mb-0 opacity-50'>Total Sale</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$1,880 <FontAwesomeIcon icon={faArrowUp} className='text-success h5' /></strong>
                      <p className='mb-0 opacity-50'>Last Month Sale</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>{renderRating()}</strong>
                      <p className='mb-0 opacity-50'>Rating</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>{productData.inStock.inStock}</strong>
                      <p className='mb-0 opacity-50'>In Stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Specification</h5>
                    <hr />
                  </header>
                  <table className='table'>
                    <tbody>
                      {
                        productSpecs.map((i, index) => (
                          <tr key={`product_specs_row_${index + 1}`}>
                            <td style={{width: '35%'}}>
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
                    <h5 className='mb-0'>Weekly Sale Statistic</h5>
                    <small>12 - 17 Jan 2025</small>
                  </header>
                  <div className='d-flex justify-content-center align-items-center' style={{height: 300}}>
                    <p className='mb-0'>"Chart Line Here"</p>
                  </div>
                </div>
              </div>

              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h6 className='mb-0'>Recent Review by Customer</h6>
                    {/* {
                      productData.reviews &&
                      <small>
                      Total { productData.reviews.length } review{ productData.reviews.length > 1 && 's' }
                      </small>
                    } */}
                  </header>
                  {
                    productData.reviews && productData.reviews.map((i, index) => {
                      if(index < 3) {
                        return (
                          <div key={index} className='card mb-2'>
                            <div className='card-body'>
                              <p>"{i.message}"</p>
                              <div className='d-flex justify-content-between align-items-center'>
                                <span>By : {i.createdBy.customerDetail.firstName} {i.createdBy.customerDetail.lastName}</span>
                                <span>{formatTimestamp(i.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Latest Sale History</h5>
                  </header>
                  {
                    latestSale.length > 0
                    ?
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Quantity</th>
                          <th>Date/Time</th>
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
                    <p className='my-4 text-center'>Not have sale</p>
                  }
                  
                </div>
              </div>
            </div>
            <div className='col-12'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Recent In Stock Action</h5>
                  </header>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Quantity</th>
                        <th>Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(5)].map((i, index) => (
                          <tr key={`stock_history_${index + 1}`}>
                            <td>Add</td>
                            <td>x20</td>
                            <td>
                              20 Jan 25, 12:30:55
                              <br />
                              <small className='opacity-50'>by Webadmin</small>
                            </td>
                          </tr>
                        ))
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