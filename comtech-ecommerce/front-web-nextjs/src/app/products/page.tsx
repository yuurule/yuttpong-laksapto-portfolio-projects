import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProductList from "@/components/Products/ProductList";
import ProductListOption from "@/components/Products/ProductListOption";
import ProductListSorting from "@/components/Products/ProductListSorting";

export default function ProductsPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'Products', url: null },
  ]

  return (
    <main className="">
      <Breadcrumbs urlList={breadcrumbsList} />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Product List" />
          </header>

          {/* Show product options */}
          <div className="col-sm-2 pe-4">
            <ProductListOption />
          </div>

          {/* Product list */}
          <div className="col-sm-10">
            <div className="row">
              <ProductListSorting />
              <ProductList />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}