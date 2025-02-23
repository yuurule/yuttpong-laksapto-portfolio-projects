import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import CartTable from "@/components/Cart/CartTable/CartTable";
import CartTotal from "@/components/Cart/CartTotal/CartTotal";

export default function CartPage() {



  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Cart" />
          </header>
          <div className="col-sm-9">
            <CartTable />
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary px-4">
                Comtinue Shopping
              </button>
              <button className="btn btn-primary px-4">
                Update Cart
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