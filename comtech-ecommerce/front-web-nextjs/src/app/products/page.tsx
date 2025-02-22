import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import ProductBox from "@/components/ProductBox/ProductBox";
import ProductListOption from "@/components/ProductList/ProductListOption/ProductListOption";
import ProductListSorting from "@/components/ProductList/ProductListSorting/ProductListSorting";

export default function ProductsPage() {

  const brandsOptions = [
    { name: "Acer", inStock: 10 },
    { name: "Dell" },
    { name: "MSI" },
    { name: "Asus" },
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
          <div className="col-sm-3">
            <ProductListOption title="price" options={brandsOptions} />
            <ProductListOption title="brands" options={brandsOptions} />
            <ProductListOption title="screen size" options={brandsOptions} />
          </div>

          {/* Product list */}
          <div className="col-sm-9">
            <div className="row">
              <div className="col-12">
                <ProductListSorting />
              </div>
              {
                [...Array(10)].map((product, index) => (
                  <div key={`product_list_item_${index + 1}`} className="col-sm-3">
                    <ProductBox />
                  </div>
                ))
              }
              <div className="col-12">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}