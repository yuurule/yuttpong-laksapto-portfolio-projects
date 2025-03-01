import ProductBox from '@/components/ProductBox/ProductBox';
import DealOfTheDay from '../DealOfTheDay/DealOfTheDay';
import styles from './NewArrival.module.scss';

export default function NewArrival() {


  return (
    <section id="new-arrival" className={`${styles.newArrival}`}>
      <div className='row'>
        <div className='col-sm-4'>
          <header>
            <h3 className={`${styles.heading}`}>Deals of the Day</h3>
          </header>
          <DealOfTheDay />
        </div>
        <div className='col-sm-8'>
          <header>
            <h3 className={`${styles.heading}`}>New Arrival Products</h3>
          </header>
          <div className='row'>
          {
            [...Array(6)].map((product, index) => (
              <div key={`new_arrival_product_${index + 1}`} className='col-sm-6 mb-3'>
                <ProductBox previewStyle="horizontal" />
              </div>
            ))
          }
          </div>
        </div>
        <div className='col-12 mb-5'>
          <div className={`demo-box d-flex align-items-center ${styles.campaignBox}`} style={{height: 250, paddingLeft: '5%'}}>
            <div>
              <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
              <strong className='h3 d-block'>Top Gaming Notebook</strong>
              <p>Super Hi-end We Offer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}