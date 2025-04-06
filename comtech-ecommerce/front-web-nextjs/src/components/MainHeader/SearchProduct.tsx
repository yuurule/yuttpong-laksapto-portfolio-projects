import styles from './MainHeader.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchProduct() {


  return (
    <div className={`${styles.searchBox}`}>
      {/* <div className={`${styles.inputSelect}`}>
        <select className={`form-select ${styles.formSelect}`} aria-label="Default select example">
          <option value="0">All Category</option>
          <option value="1">Notebook</option>
          <option value="2">Desktop</option>
          <option value="3">Mobile phone</option>
        </select>
      </div> */}
      <div className={`input-group w-100 ${styles.inputGroup}`}>
        <input type="text" className="form-control" placeholder="Search product" aria-label="Search product" aria-describedby="main-header-search-button" />
        <button className="btn px-3" type="button" id="main-header-search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  )
}