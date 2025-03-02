import styles from './ProductListOption.module.scss';
import { useMemo } from 'react';
import { ProductListOptionProps } from '@/types/PropsType';

export default function ProductListOption({
  title, options
} : ProductListOptionProps) {

  const transformedOptions = useMemo(() => 
    options.map(opt => ({
      ...opt,
      inStock: opt.inStock ?? null
    }))
  , [options]);

  return (
    <div className={`${styles.productListOption}`}>
      <h5 className={`${styles.title}`}>{title}</h5>
      {
        transformedOptions.map((option, index) => (
          <div key={`product_list_option_${title}_${index + 1}`} className={`form-check ${styles.formCheck}`}>
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              {option.name}
              {option.inStock !== null && <span className={styles.inStockAmount}>({option.inStock})</span>}
            </label>
          </div>
        ))
      }
    </div>
  )
}