import styles from './MainMenu.module.scss';
import { Link } from 'react-router';

export default function MainMenu() {



  return (
    <div className={`${styles.mainMenu}`}>
      <div className='py-4'>
        <p className='h4 text-center mb-0'>COMTECH</p>
        <p className='h6 text-center mb-0'>WEBADMIN SYSTEM</p>
      </div>
      <hr />
      <ul className='mt-5 ms-5 list-unstyled'>
        <li className='mb-2'><Link to="/dashboard">Dashboard</Link></li>
        <li className='mb-2'><Link to="/report">Report</Link></li>
        <li className='mb-2'><Link to="/product">Product</Link></li>
        <li className='mb-2'><Link to="/category">Category</Link></li>
        <li className='mb-2'><Link to="/tag">Tag</Link></li>
        <li className='mb-2'><Link to="/order">Order</Link></li>
        <li className='mb-2'><Link to="/customer">Customer</Link></li> 
      </ul>
    </div>
  )
}