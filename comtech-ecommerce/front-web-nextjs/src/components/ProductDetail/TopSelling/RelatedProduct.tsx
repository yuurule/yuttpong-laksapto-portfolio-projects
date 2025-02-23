import styles from './RelatedProduct.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';

export default function RelatedProduct() {



  return (
    <section id="top-selling" className={`${styles.topSelling}`}>
      <div className='row'>
        <div className='col-1'>
          <div className='box'>
            <p>Related<br />Products</p>
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