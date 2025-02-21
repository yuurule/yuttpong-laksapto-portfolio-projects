import styles from './HeroSlide.module.scss';

export default function HeroSlide() {


  
  return (
    <div className={`${styles.heroSlide}`}>
      <div className={`${styles.firstRow}`}>
        <div className={`${styles.box} ${styles.left}`}>
          <div>
            <span className='badge-sign badge-red'>Weekend Deals!</span>
            <strong className='h1 d-block'>Best Deals<br />Of The Week</strong>
            <p>AMAZING DISCOUNTS AND DEALS</p>
            <div className='d-flex align-items-center'>
              From
              <s>$399</s>
              <strong>$299</strong>
            </div>
            <button>shop now</button>
          </div>
        </div>
        <div className={`${styles.box} ${styles.right}`}>
          <div>
            <span className='badge-sign badge-red'>Weekend Deals!</span>
            <strong className='h2 d-block'>MSI Gamimg Notebook</strong>
            <p>NEW PERFORMANCE WE OFFER</p>
          </div>
        </div>
      </div>
      <div className={`${styles.secondRow}`}>
        <div className={`${styles.box}`}>
          <div>
            <strong className='h2 d-block'>Discounts 50% On<br />Working Dell Laptop</strong>
            <p>until 26 April 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}