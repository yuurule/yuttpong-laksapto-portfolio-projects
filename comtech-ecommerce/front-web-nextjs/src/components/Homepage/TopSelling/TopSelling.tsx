import styles from './TopSelling.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';
import Link from 'next/link';

export default function TopSelling() {



  return (
    <section id="top-selling" className={`${styles.topSelling}`}>
      
      <div className='d-flex justify-content-end'>
        <Link href="/" className='btn design-btn px-4 mb-3'>
          See all top sell notebooks
        </Link>
      </div>

      <div className='d-flex mb-5'>
        <div className={`gradient-box ${styles.rowHeader}`}>
          <p>Top<br />Selling</p>
        </div>
        <div className='row'>
          {
            [...Array(4)].map((product, index) => {
              return (
                <div key={`top_sell_product_box_${index + 1}`} className='col-sm-3'>
                  <ProductBox />
                </div>
              )
            })
          }
        </div>
      </div>

      <div className='row'>
        {
          [...Array(3)].map((campaign, index) => (
            <div key={`top_selling_campaign_${index + 1}`} className='col-sm-4'>
              <div className={`demo-box ${styles.campaignBox}`}>
                <div>
                  <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
                  <strong className='h4 d-block'>Top Gaming Notebook</strong>
                  <p>Super Hi-end We Offer</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      
    </section>
  )
}