import HeroSlide from '@/components/HeroSlide/HeroSlide';
import styles from './Homepage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHeadphones, faWallet } from '@fortawesome/free-solid-svg-icons';
import ProductBox from '@/components/ProductBox/ProductBox';

export default function Home() {
  return (
    <main className={`${styles.homepage}`}>
      <div className='container'>
        
        <header id="hero-homepage">
          <HeroSlide />
        </header>

        <section id="services">
          <div className='d-flex justify-content-around w-100'>
            <div className='d-flex' style={{width: '18%'}}>
              <FontAwesomeIcon icon={faTruck} />
              <div>
                <strong>Free Delivery</strong>
                <p>Free shipping on all order over $100</p>
              </div>
            </div>
            <div className='d-flex' style={{width: '18%'}}>
              <FontAwesomeIcon icon={faShoppingBag} />
              <div>
                <strong>Free Delivery</strong>
                <p>Free shipping on all order over $100</p>
              </div>
            </div>
            <div className='d-flex' style={{width: '18%'}}>
              <FontAwesomeIcon icon={faHeadphones} />
              <div>
                <strong>Free Delivery</strong>
                <p>Free shipping on all order over $100</p>
              </div>
            </div>
            <div className='d-flex' style={{width: '18%'}}>
              <FontAwesomeIcon icon={faWallet} />
              <div>
                <strong>Free Delivery</strong>
                <p>Free shipping on all order over $100</p>
              </div>
            </div>
          </div>
        </section>

        <section id="top-selling">
          <div className='row'>
            <div className='col-1'>
              <div className='box'>
                <p>Top<br />Selling</p>
              </div>
            </div>
            <div className='col-11'>
              <div className='row'>
                {
                  [1,2,3,4].map((i, index) => {
                    return (
                      <div key={`top_sell_product_box_${index + 1}`} className='col-sm-3'>
                        <ProductBox />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </section>

        <section id="new-arrival">

        </section>

      </div>
    </main>
  );
}
