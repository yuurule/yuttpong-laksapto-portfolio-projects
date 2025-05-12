import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";
import ReviewsTable from "@/components/MyAccount/ReviewsTable";

export default function ReviewsPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'My account', url: '/my-account' },
    { text: 'Reviews', url: null },
  ]

  return (
    <main>
      <Breadcrumbs urlList={breadcrumbsList} />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Review" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <ReviewsTable />
          </div>
        </div>
      </div>
    </main>
  )
}