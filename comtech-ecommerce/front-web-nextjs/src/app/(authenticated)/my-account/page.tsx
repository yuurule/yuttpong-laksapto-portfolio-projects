import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
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
        </div>
      </div>
    </main>
  )
}