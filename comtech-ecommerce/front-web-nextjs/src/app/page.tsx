import styles from './Homepage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHeadphones, faWallet } from '@fortawesome/free-solid-svg-icons';
import TopSelling from '@/components/Homepage/TopSelling/TopSelling';
import DealOfTheDay from '@/components/Homepage/DealOfTheDay/DealOfTheDay';
import NewArrival from '@/components/Homepage/NewArrival/NewArrival';

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
          <img src="/images/dummy-hero-slide.jpg" className='img-fluid' />
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
          <div className='col-sm-4'>
            <div className={`demo-box ${styles.campaignBox}`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
                <strong className='h4 d-block'>Top Gaming Notebook</strong>
                <p>Super Hi-end We Offer</p>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className={`demo-box ${styles.campaignBox}`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
                <strong className='h4 d-block'>Top Gaming Notebook</strong>
                <p>Super Hi-end We Offer</p>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className={`demo-box ${styles.campaignBox}`}>
              <div>
                <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
                <strong className='h4 d-block'>Top Gaming Notebook</strong>
                <p>Super Hi-end We Offer</p>
              </div>
            </div>
          </div>
        </div>

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
              <NewArrival />
            </div>
          </div>
        </section>

        <div 
          className={`demo-box d-flex align-items-center ${styles.campaignBox}`} 
          style={{height: 250, paddingLeft: '5%'}}
        >
          <div>
            <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
            <strong className='h3 d-block'>Top Gaming Notebook</strong>
            <p>Super Hi-end We Offer</p>
          </div>
        </div>
      </div>
    </main>
  );
}
