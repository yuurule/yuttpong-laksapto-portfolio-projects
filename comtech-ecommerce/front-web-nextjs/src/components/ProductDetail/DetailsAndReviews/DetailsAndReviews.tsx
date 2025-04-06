"use client";

import { Tab, Tabs, Form } from 'react-bootstrap';
import ReviewItem from '../ReviewItem/ReviewItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRugular } from '@fortawesome/free-regular-svg-icons';
import styles from './DetailsAndReviews.module.scss';
import { useSession } from 'next-auth/react';
import AddReview from '../AddReview';

export default function DetailsAndReviews({
  detail = '',
  reviews = [],
}: {
  detail: string | null,
  reviews: any[] | null
}) {

  const { status, data: session } = useSession();

  return (
    <div className={`${styles.detailsAndReviews}`}>
      <Tabs
        defaultActiveKey="productDetail"
        id="uncontrolled-tab-example"
        className={`tab-design`}
      >
        <Tab eventKey="productDetail" title="Product Detail">
          <div className={`${styles.content} p-3`}>
            <p>"{detail}"</p>
          </div>
        </Tab>
        <Tab eventKey="reviews" title="Reviews">
          <div className={`${styles.content}`}>
            <div className='row'>
              <div className='col-sm-7'>
                {
                  reviews !== null && reviews.length > 0
                  ? <>
                  {
                    reviews.map((review: any, index: number) => (
                      <ReviewItem 
                        key={`review_item_${review?.id}`} 
                        review={review}
                      />
                    ))
                  }
                  </>
                  : <p className='ms-3 mt-3'>This product not have review yet.</p>
                }
              </div>
              <div className='col-sm-5'>
                <div className={`${styles.addReview}`}>
                  <h6>Add a review</h6>
                  {
                    status !== 'loading' &&
                    !session?.user 
                    ? // not login yet.
                    <p className='text-center my-5 h5 opacity-25'>You must log in for review this product</p>
                    : // already login
                    <>
                    <p>Your email address will not be published. Required are marked *</p>
                    <AddReview />
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}