export default function Dashboard() {

  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12">
          <h1>Dashboard</h1>
        </header>
        <div className="col-12 mt-4">
          <div className="row">
            {
              [...Array(4)].map((i, index) => (
                <div key={`dashboard_card_item_${index + 1}`} className="col-sm-3">
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