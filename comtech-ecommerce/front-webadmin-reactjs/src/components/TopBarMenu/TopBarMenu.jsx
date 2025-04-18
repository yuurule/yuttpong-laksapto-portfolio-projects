import styles from './TopBarMenu.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { logout } from '../../redux/actions/authAction';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function TopBarMenu() {

  const { refreshToken } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout(refreshToken));
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className={`${styles.topBarMenu}`}>

      <div className='d-flex'>
        <button 
          type="button"
          className={`btn ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button 
          type="button"
          className={`btn ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faBell} />
        </button>
        <div className="dropdown">
          <button 
            className={`${styles.userDropdown} btn`} 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <div className='d-flex'>
              <img src={'/images/dummy-webadmin.jpg'} className={`${styles.userImg}`} />
              <div className={`${styles.userInfo}`}>
                <p className='mb-0'>Luciana Swiss</p>
                <small>webadmin@mail.com</small>
              </div>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end">
            <li>
              <button 
                className='dropdown-item'
                onClick={handleLogout}
              >Log out</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}