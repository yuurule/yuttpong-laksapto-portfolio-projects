import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './OrderByBtn.module.scss';

export default function OrderByBtn({
  currentStatus='',
  handleOnClick=() => {}
}) {



  return (
    <button
      type="button"
      className={`btn ${styles.orderByBtn} ${(currentStatus !== '' && currentStatus !== null) ? styles.active : ''}`}
      onClick={handleOnClick}
    >
      { currentStatus === null && <FontAwesomeIcon icon={faMinus} />}
      { currentStatus === 'desc' && <FontAwesomeIcon icon={faArrowUp} />}
      { currentStatus === 'asc' && <FontAwesomeIcon icon={faArrowDown} />}
    </button>
  )
}