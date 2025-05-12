"use client"

import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function SearchProduct({ css }: { css?: string }) {

  const router = useRouter()
  const [searchText, setSearchText] = useState('')

  const handleSearchProduct = () => {
    let url = `/products?brands=all&categories=all`
    if(searchText.trim() !== '') {
      url = `/products?brands=all&categories=all&search=${searchText}`
    }
    router.push(url)
    setSearchText('')
  }

  return (
    <div className={`searchBox ${css}`}>
      {/* <div className={`${styles.inputSelect}`}>
        <select className={`form-select ${styles.formSelect}`} aria-label="Default select example">
          <option value="0">All Category</option>
          <option value="1">Notebook</option>
          <option value="2">Desktop</option>
          <option value="3">Mobile phone</option>
        </select>
      </div> */}
      <div className={`input-group w-100 inputGroup`}>
        <input 
          defaultValue={searchText}
          type="text" 
          className="form-control" 
          placeholder="Search product" 
          onChange={(e: any) => {
            setSearchText(e.target.value)
          }}
        />
        <button 
          className="btn px-3" 
          type="button" 
          id="main-header-search-button"
          onClick={() => {
            handleSearchProduct()
          }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  )
}