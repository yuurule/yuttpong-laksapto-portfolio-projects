import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import ProductBox from "@/components/ProductBox/ProductBox";
import ProductListOption from "@/components/ProductList/ProductListOption/ProductListOption";
import ProductListSorting from "@/components/ProductList/ProductListSorting/ProductListSorting";

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
              <div className="col-12">
                <ProductListSorting />
              </div>
              {
                [...Array(10)].map((product, index) => (
                  <div key={`product_list_item_${index + 1}`} className={`col-sm-3 mb-3 col-product`}>
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