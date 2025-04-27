import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import MyAccountForm from "@/components/MyAccount/MyAccountForm";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";
import PageHeader from "@/components/PageHeader/PageHeader";


export default function MyAccountPage() {

  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Account" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <MyAccountForm />
          </div>
        </div>
      </div>
    </main>
  )
}