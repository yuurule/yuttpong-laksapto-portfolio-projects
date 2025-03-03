import styles from './TopBarMenu.module.scss';

export default function TopBarMenu() {



  return (
    <div className={`${styles.topBarMenu} bg-primary`}>
      <p className='mb-0'>Welcome, webadmin</p>
      <ul className='list-inline mb-0'>
        <li className='list-inline-item'>Email</li>
        <li className='list-inline-item'>My account</li>
      </ul>
    </div>
  )
}