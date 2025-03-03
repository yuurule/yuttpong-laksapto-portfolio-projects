import styles from './MainMenu.module.scss';
import { Link } from 'react-router';

export default function MainMenu() {



  return (
    <div className={`${styles.mainMenu}`}>
      <p className='h4 text-center mb-0'>COMTECH</p><p className='h6 text-center'>WEBADMIN SYSTEM</p>
      <hr />
      <ul className='ms-5 list-unstyled'>
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