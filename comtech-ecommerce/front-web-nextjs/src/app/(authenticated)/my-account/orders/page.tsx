import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";

export default function OrdersPage() {



  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Order" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <div className="row">
              <div className="col-sm-5">
                <table className={`table table-design`}>
                  <thead>
                    <tr>
                      <th>#Order ID</th>
                      <th>Total Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>20250430-00001</td>
                      <td>฿57,990.00</td>
                      <td><small className="badge text-bg-warning">pending</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-sm-7">
                <div
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid var(--very-soft-gray)',
                    width: '100%',
                    height: '480px',
                    padding: 20
                  }}
                >
                  <header>
                    <h6>Order details</h6>
                  </header>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}