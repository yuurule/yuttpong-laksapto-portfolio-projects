import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";

export default function WishlistsPage() {



  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Wishlists" />
          </header>
        </div>
      </div>
    </main>
  )
}