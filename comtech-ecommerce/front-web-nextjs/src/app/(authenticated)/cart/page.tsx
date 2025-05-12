import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import CartTable from "@/components/Cart/CartTable";

export default function CartPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'Cart', url: null },
  ]

  return (
    <main>
      <Breadcrumbs 
        urlList={breadcrumbsList}
      />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Cart" />
          </header>
          <CartTable />
        </div>
      </div>
    </main>
  )
}