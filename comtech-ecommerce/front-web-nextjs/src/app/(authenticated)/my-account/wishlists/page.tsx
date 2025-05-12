import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";
import WishlistTable from "@/components/MyAccount/WishlistTable";
import { customerService } from "@/services";

export default async function WishlistsPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'My account', url: '/my-account' },
    { text: 'Wishlist', url: null },
  ]

  return (
    <main>
      <Breadcrumbs urlList={breadcrumbsList} />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Wishlist" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <WishlistTable />
          </div>
        </div>
      </div>
    </main>
  )
}