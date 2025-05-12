"use client"

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { customerService } from '@/services'
import { formatTimestamp } from '@/utils/rendering'

export default function ReviewsTable() {

  const { status, data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [reviewsData, setReviewsData] = useState([])

  useEffect(() => {
    const fecthData = async () => {
      setLoading(true)
      try {
        if(status !== 'loading' && session?.user.id) {
          const customer = await customerService.getOneCustomer(session.user.id)
          console.log(customer.RESULT_DATA)
          const result = customer.RESULT_DATA
          setReviewsData(result.createdReviews.filter((i: any) => i.approved === true))
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
            <th>Review</th>
            <th>Rating</th>
            <th>On Product</th>
            <th>Review at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            reviewsData.length > 0
            ?
            reviewsData.map((i: any, index: number) => {
              return (
                <tr key={`review_item_${index + 1}`}>
                  <td>
                    "{i.message}"
                  </td>
                  <td>
                    <FontAwesomeIcon icon={faStar} className='me-1 text-warning' />{i.rating}
                  </td>
                  <td>
                    {i.product.name}
                  </td>
                  <td>{formatTimestamp(i?.createdAt)}</td>
                  <td>
                    <div className='d-flex'>
                      <button
                        type="button"
                        className="btn text-primary btn-link p-0 btn-sm me-3"
                        onClick={() => alert('Comming soon...')}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        className="btn text-danger btn-link p-0 btn-sm"
                        onClick={() => alert('Comming soon...')}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
            :
            <tr>
              <td colSpan={5} className='text-center py-5 opacity-50'>You not have review</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}