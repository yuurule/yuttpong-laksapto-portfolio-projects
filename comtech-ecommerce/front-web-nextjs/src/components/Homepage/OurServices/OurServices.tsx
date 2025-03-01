import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHeadphones, faWallet } from '@fortawesome/free-solid-svg-icons';
import styles from './OurServices.module.scss';

export default function OurServices() {

  const services = useMemo(() => [
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
  ], [])

  return (
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
  )
}