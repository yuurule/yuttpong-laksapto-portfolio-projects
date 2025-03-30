import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProductList from "@/components/Products/ProductList";
import ProductListOption from "@/components/Products/ProductListOption/ProductListOption";
import ProductListSorting from "@/components/Products/ProductListSorting/ProductListSorting";

export default function ProductsPage() {

  const brandsOptions = [
    { name: "Acer", inStock: 10 },
    { name: "Dell", inStock: 20 },
    { name: "MSI", inStock: 15 },
    { name: "Asus", inStock: 14 },
  ]

  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Product List" />
          </header>

          {/* Show product options */}
          <div className="col-sm-2 pe-4">
            <ProductListOption title="brands" options={brandsOptions} />
            <ProductListOption title="price" options={brandsOptions} />
            <ProductListOption title="screen size" options={brandsOptions} />
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