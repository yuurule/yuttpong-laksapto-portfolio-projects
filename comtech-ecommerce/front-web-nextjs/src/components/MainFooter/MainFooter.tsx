import styles from './MainFooter.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

export default function MainFooter() {


  return (
    <footer className={`${styles.mainFooter}`}>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-4'>
            <strong>COMTECH</strong>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum corrupti amet, laboriosam nostrum, culpa consectetur perferendis nulla.</p>
            <ul className="list-inline">
            <li className="list-inline-item">
                <Link href="/"><FontAwesomeIcon icon={faInstagram} /></Link>
              </li>
              <li className="list-inline-item">
                <Link href="/"><FontAwesomeIcon icon={faFacebookF} /></Link>
              </li>
              <li className="list-inline-item">
                <Link href="/"><FontAwesomeIcon icon={faTwitter} /></Link>
              </li>
              <li className="list-inline-item">
                <Link href="/"><FontAwesomeIcon icon={faYoutube} /></Link>
              </li>
              <li className="list-inline-item">
                <Link href="/"><FontAwesomeIcon icon={faLinkedinIn} /></Link>
              </li>
            </ul>
          </div>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-sm-3'>
                <ul className='list-unstyled'>
                  <li><strong>Company</strong></li>
                  <li><Link href="/">About us</Link></li>
                  <li><Link href="/">Contact us</Link></li>
                  <li><Link href="/">How it work</Link></li>
                  <li><Link href="/">Sitemap</Link></li>
                </ul>
              </div>
              <div className='col-sm-3'>
                <ul className='list-unstyled'>
                  <li><strong>Notebook</strong></li>
                  <li><Link href="/">Hi-end</Link></li>
                  <li><Link href="/">Working</Link></li>
                  <li><Link href="/">Gaming</Link></li>
                  <li><Link href="/">For student</Link></li>
                </ul>
              </div>
              <div className='col-sm-3'>
                <ul className='list-unstyled'>
                  <li><strong>Services</strong></li>
                  <li><Link href="/">Delivery</Link></li>
                  <li><Link href="/">Warranty</Link></li>
                  <li><Link href="/">Financing</Link></li>
                </ul>
              </div>
              <div className='col-sm-3'>
                <ul className='list-unstyled'>
                  <li><strong>Order</strong></li>
                  <li><Link href="/">Track order</Link></li>
                  <li><Link href="/">Delivery & Pickup</Link></li>
                  <li><Link href="/">Returns</Link></li>
                  <li><Link href="/">Exchanges</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 d-flex justify-content-between align-items-center'>
            <div>
              <p>&copy; COMTECH All Right Reserved 2025.</p>
            </div>
            <div>
              <ul className='list-inline'>
                <li className='list-inline-item'><Link href="/">Privacy policy</Link></li>
                <li className='list-inline-item'><Link href="/">Term of use</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}