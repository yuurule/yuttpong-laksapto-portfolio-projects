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
        
        <div className="col-sm-9">
          <div className="row">
            {
              [...Array(3)].map((i, index) => (
                <div key={`dashboard_card_item_${index + 1}`} className="col-sm-4 mb-3">
                  <div className="card">
                    <div className="card-body" style={{height: 140}}>
                      <strong className="h5">Card</strong>
                      <p>+ 10%</p>
                    </div>
                  </div>
                </div>
              ))
            }
            <div className='col-sm-8 mb-3'>
              <div className="card">
                <div className="card-body" style={{height: 400}}>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>Recent Week Income<span></span></h5>
                  </header>
                </div>
              </div>
            </div>
            <div className='col-sm-4 mb-3'>
              <div className="card">
                <div className="card-body" style={{height: 400}}>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>Calendar<span></span></h5>
                  </header>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-3 mb-3'>
          <div className='row'>
            <div className='col-12'>
              <div className="card">
                <div className="card-body" style={{height: 555}}>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>Best Seller Product<span></span></h5>
                  </header>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-7 mb-3'>
          <div className="card">
            <div className="card-body" style={{height: 370}}>
              <header className='d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Latest Order<span></span></h5>
              </header>
            </div>
          </div>
        </div>
        <div className='col-sm-5 mb-3'>
          <div className="card">
            <div className="card-body" style={{height: 370}}>
              <header className='d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Active Campaign<span></span></h5>
              </header>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}