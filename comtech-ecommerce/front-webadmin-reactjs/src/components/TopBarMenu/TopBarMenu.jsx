import styles from './TopBarMenu.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/actions/authAction';

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
    <div className={`${styles.topBarMenu} bg-primary`}>
      <p className='mb-0'>Welcome, webadmin</p>
      <ul className='list-inline mb-0'>
        {/* <li className='list-inline-item'>Email</li> */}
        <li className='list-inline-item'>
          <button 
            className='btn btn-danger'
            onClick={handleLogout}
          >Log out</button>
        </li>
      </ul>
    </div>
  )
}