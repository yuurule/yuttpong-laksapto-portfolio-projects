'use client';

import styles from '../ProductListOption/ProductListOption.module.scss';

export default function ProductListSorting() {

  return (
    <div className={`${styles.productSorting}`}>
      <div className={`form-check me-4 ${styles.formCheck}`}>
        <input 
          className="form-check-input" 
          type="checkbox" 
          defaultValue="" 
          id="flexCheckDefault"
          onChange={(e: any) => {

          }}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Show product on sales only
        </label>
      </div>
      <div className={`${styles.selectOption}`}>
        <span>New:</span> 
        <select 
          className={`form-select`} 
          aria-label="Default select example" 
          defaultValue={"1"}
          onChange={(e: any) => {

          }}
        >
          <option value="0">ไม่จัดเรียง</option>
          <option value="1">ใหม่สุด</option>
          <option value="2">เก่าสุด</option>
        </select>
      </div>
      <div className={`${styles.selectOption}`}>
        <span>Price:</span>
        <select 
          className={`form-select`} 
          aria-label="Default select example" 
          defaultValue={"0"}
          onChange={(e: any) => {

          }}
        >
          <option value="0">ไม่จัดเรียง</option>
          <option value="1">น้อยไปมาก</option>
          <option value="2">มากไปน้อย</option>
        </select>
      </div>
    </div>
  )
}