import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import CartTable from "@/components/Cart/CartTable/CartTable";
import CartTotal from "@/components/Cart/CartTotal/CartTotal";

export default function CartPage() {



  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Cart" />
          </header>
          <div className="col-sm-9 mb-5">
            <CartTable />
            <div className="d-flex justify-content-end">
              <button className="btn design-btn px-4">
                Continue Shopping
              </button>
            </div>
          </div>
          <div className="col-sm-3">
            <CartTotal />
          </div>
        </div>
      </div>
    </main>
  )
}