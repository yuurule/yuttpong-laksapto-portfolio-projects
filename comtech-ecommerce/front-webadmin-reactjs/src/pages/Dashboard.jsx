import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {

  return (
    <div className={`page`}>
      
      <header className="page-title">
        <h1>Dashboard</h1>
        <p>Welcome to webadmin</p>
      </header>

      <div className="row mt-4">
        
        <div className="col-12 mt-4">
          <div className="row">
            {
              [...Array(4)].map((i, index) => (
                <div key={`dashboard_card_item_${index + 1}`} className="col-sm-3 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <strong className="h5">Card</strong>
                      <p>+ 10%</p>
                    </div>
                  </div>
                </div>
              ))
            }
            
          </div>
        </div>
      </div>
      
    </div>
  )
}