import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";
import OrderDetail from "@/components/MyAccount/OrderDetail";

export default function OrdersPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'My account', url: '/my-account' },
    { text: 'Orders', url: null },
  ]

  return (
    <main>
      <Breadcrumbs urlList={breadcrumbsList} />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Order" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <OrderDetail />
          </div>
        </div>
      </div>
    </main>
  )
}