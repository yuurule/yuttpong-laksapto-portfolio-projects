import styles from './RelatedProduct.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';
import Link from 'next/link';

export default function RelatedProduct() {



  return (
    <section id="related-products" className={`${styles.relatedProduct}`}>
      
      <div className='d-flex mb-5'>
        <div className={`gradient-box ${styles.rowHeader}`}>
          <p>Related<br />Products</p>
        </div>
        <div className='row'>
          {
            [...Array(4)].map((product, index) => {
              return (
                <div key={`related_product_box_${index + 1}`} className='col-sm-3'>
                  <ProductBox />
                </div>
              )
            })
          }
        </div>
      </div>

      <div className={`demo-box d-flex align-items-center ${styles.campaignBox}`} style={{height: 250, paddingLeft: '5%'}}>
        <div>
          <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
          <strong className='h3 d-block'>Top Gaming Notebook</strong>
          <p>Super Hi-end We Offer</p>
        </div>
      </div>

    </section>
  )
}