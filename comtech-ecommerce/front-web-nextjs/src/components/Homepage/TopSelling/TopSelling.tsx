import styles from './TopSelling.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';

export default function TopSelling() {



  return (
    <section id="top-selling" className={`${styles.topSelling}`}>
      <div className='row'>
        <div className='col-1'>
          <div className='box'>
            <p>Top<br />Selling</p>
          </div>
        </div>
        <div className='col-11'>
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

        <div className='col-12'>
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
        </div>
      </div>
    </section>
  )
}