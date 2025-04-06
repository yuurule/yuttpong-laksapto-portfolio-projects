import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";

export default function OrdersPage() {



  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Orders" />
          </header>
        </div>
      </div>
    </main>
  )
}