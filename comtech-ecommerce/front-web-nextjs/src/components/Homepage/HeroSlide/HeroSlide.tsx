"use client"

import Link from 'next/link';
import styles from './HeroSlide.module.scss';

export default function HeroSlide() {
  
  return (
    <header id="hero-homepage">
      <div className={`${styles.heroSlide}`}>
        <div className={`${styles.firstRow}`}>
          <Link href="/products?brands=all&categories=2" className={`${styles.box} ${styles.left}`}>
            <div>
              <span className='badge-sign badge-red'>New Arrival!</span>
              <strong className='h1 d-block'>Dream Adventure<br />Is Come To Reals</strong>
              <p>AMAZING HI-END GAMING NOTEBOOK</p>
              {/* <div className='d-flex align-items-center'>
                From
                <s>$399</s>
                <strong>$299</strong>
              </div> */}
              {/* <button>shop now</button> */}
            </div>
          </Link>
          <Link href="/products?brands=6&categories=2" className={`${styles.box} ${styles.right}`}>
            <div>
              <span className='badge-sign badge-red'>Weekend Deals!</span>
              <strong className='h2 d-block'>MSI Gamimg Notebook</strong>
              <p>NEW PERFORMANCE WE OFFER</p>
            </div>
          </Link>
        </div>
        <div className={`${styles.secondRow}`}>
          <Link href="/products?brands=all&categories=1,3" className={`${styles.box}`}>
            <div>
              <strong className='h2 d-block'>Slim & Performance<br />Notebooks</strong>
              <p>until 26 June 2025</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}