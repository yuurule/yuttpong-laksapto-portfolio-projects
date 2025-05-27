import styles from './Homepage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHeadphones, faWallet } from '@fortawesome/free-solid-svg-icons';
import TopSelling from '@/components/Homepage/TopSelling/TopSelling';
import DealOfTheDay from '@/components/Homepage/DealOfTheDay/DealOfTheDay';
import NewArrival from '@/components/Homepage/NewArrival/NewArrival';
import HeroSlide from '@/components/Homepage/HeroSlide/HeroSlide';
import Link from 'next/link';

export default function HomePage() {

  const services = [
    {
      icon: <FontAwesomeIcon icon={faTruck} />,
      title: "Free Delivery",
      description: "Free shipping on all order over $100",
    },
    {
      icon: <FontAwesomeIcon icon={faShoppingBag} />,
      title: "Free Delivery",
      description: "Free shipping on all order over $100",
    },
    {
      icon: <FontAwesomeIcon icon={faHeadphones} />,
      title: "Free Delivery",
      description: "Free shipping on all order over $100",
    },
    {
      icon: <FontAwesomeIcon icon={faWallet} />,
      title: "Free Delivery",
      description: "Free shipping on all order over $100",
    },
  ];

  return (
    <main className={`${styles.homepage}`}>
      <div className='container'>
        
        <section id="recommendCampaign">
          <HeroSlide />
        </section>

        <section id="services" className={`${styles.ourServices}`}>
          <div className={`container ${styles.container}`}>
            {
              services.map((service, index) => (
                <div key={`service_${index + 1}`} className={`${styles.serviceItem}`}>
                  {service.icon}
                  <div>
                    <strong>{service.title}</strong>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </section>

        <TopSelling />

        <div className='row mb-5'>
          <div className='col-sm-4 mb-3'>
            <Link href="/products?brands=4&categories=all" className={`demo-box ${styles.campaignBox} demo-hero-4`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Lenovo</span>
                <strong className='h4 d-block'>Lenovo Notebooks</strong>
                <p>Performance & Hi-end</p>
              </div>
            </Link>
          </div>
          <div className='col-sm-4 mb-3'>
            <Link href="/products?brands=1&categories=all" className={`demo-box ${styles.campaignBox} demo-hero-5`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Asus</span>
                <strong className='h4 d-block'>New Asus Gaming Laptop</strong>
                <p>Game is life</p>
              </div>
            </Link>
          </div>
          <div className='col-sm-4 mb-3'>
            <Link href="/products?brands=2&categories=all" className={`demo-box ${styles.campaignBox} demo-hero-6`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Acer</span>
                <strong className='h4 d-block'>Acer Notebook</strong>
                <p>Stand your work</p>
              </div>
            </Link>
          </div>
        </div>

        <section id="new-arrival" className={`${styles.newArrival}`}>
          <div className='row'>
            <div className='col-sm-4'>
              <header>
                <h3 className={`${styles.heading}`}>Deals of the Week</h3>
              </header>
              <DealOfTheDay />
            </div>
            <div className='col-sm-8'>
              <header>
                <h3 className={`${styles.heading}`}>New Arrival Products</h3>
              </header>
              <NewArrival />
            </div>
          </div>
        </section>

        <Link href="/products?brands=all&categories=2,4" 
          className={`demo-box d-flex align-items-center ${styles.campaignBox} demo-hero-7`} 
          style={{height: 250, paddingLeft: '5%'}}
        >
          <div>
            <span className='badge text-bg-danger mb-2'>Hi-end</span>
            <strong className='h3 d-block'>SUPER HI-END TECHNOLOGY</strong>
            <p>Powered Your Notebook with AI of The Future</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
