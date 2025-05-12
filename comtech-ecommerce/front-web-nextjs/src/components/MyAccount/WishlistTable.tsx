"use client"

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { customerService } from '@/services'
import { formatTimestamp } from '@/utils/rendering'

export default function WishlistTable() {

  const { status, data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [wishlistData, setWishlistData] = useState([])

  useEffect(() => {
    const fecthData = async () => {
      setLoading(true)
      try {
        if(status !== 'loading' && session?.user.id) {
          const customer = await customerService.getOneCustomer(session.user.id)
          const result = customer.RESULT_DATA
          setWishlistData(result.wishlists)
        }
      }
      catch(error) {
        console.log(`Fetch wishlist is failed due to reason: ${error}`);
        toast.error(`Fetch wishlist is failed due to reason: ${error}`);
      }
      finally { setLoading(false); }
    }

    fecthData()
  }, [status])

  if(loading) return <p className='text-center my-5'>Loading...</p>

  return (
    <div className='table-responsive'>
      <table className={`table table-design`}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Wishlist at</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            wishlistData.length > 0
            ?
            wishlistData.map((i: any, index: number) => {
              return (
                <tr key={`wishlist_item_${index + 1}`}>
                  <td>
                    <Link href="/" className="d-flex align-items-center text-dark">
                      {
                        i.product.images.length > 0
                        ?
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${i.product.images[0].path}`} className="product-image" />
                        :
                        <img src={`https://placehold.co/60x40`} className="product-image" />
                      }
                      <p className="mb-0">{i.product.name}</p>
                    </Link>
                  </td>
                  <td>{formatTimestamp(i?.assignedAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn text-danger btn-link p-0 btn-sm"
                      onClick={() => alert('Comming soon...')}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              )
            })
            :
            <tr>
              <td colSpan={3} className='text-center py-5 opacity-50'>You not have wishlist</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}