import styles from './MyPagination.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function MyPagination({
  currentPage=1,
  totalPage=1,
  handleSelectPage=() => {},
  css=''
}) {

  return (
    <div className={`${styles.myPagination} ${css}`}>
      <button 
        className='btn btn-link p-0'
        type="button"
        disabled={currentPage == 1}
        onClick={() => {
          handleSelectPage(currentPage - 1);
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="dropdown">
        <button 
          className={`btn btn-link p-0`} 
          type="button" 
          data-bs-toggle="dropdown"
        >
          Page {currentPage}<span className='d-inline-block mx-2'>/</span>{totalPage}
        </button>
        <ul className="dropdown-menu dropdown-menu-lg-start">
          {
            [...Array(totalPage)].map((i, index) => {
              return (
                <button 
                  key={`${index + 1}`}
                  className='dropdown-item'
                  disabled={currentPage === index + 1}
                  onClick={() => {
                    handleSelectPage(index + 1)
                  }}
                >{index + 1}</button>
              )
            })
          }
        </ul>
      </div>
      <button 
        className='btn btn-link p-0'
        type="button"
        disabled={currentPage == totalPage}
        onClick={() => {
          handleSelectPage(currentPage + 1);
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  )
}