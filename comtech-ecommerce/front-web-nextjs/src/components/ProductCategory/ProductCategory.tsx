import Link from 'next/link';
import styles from './ProductCategory.module.scss';
import { Fragment } from 'react';

export default function ProductCategory({
  categories=[]
}: {
  categories: any[]
}) {

  return (
    <div className={`${styles.productCategory}`}>
      {
        categories.map((cat: any, index: number) => {
          if(index < 3) {
            return (
              <Fragment key={`category_product_${index + 1}`}>
                <Link href="/">{cat?.category.name}</Link>
                { 
                  index < categories.length - 1 &&
                  <span>|</span>  
                }
              </Fragment>
            )
          }
        })
      }
    </div>
  )
}