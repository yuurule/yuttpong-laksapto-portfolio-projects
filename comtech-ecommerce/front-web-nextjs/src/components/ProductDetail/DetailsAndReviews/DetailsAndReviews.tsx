"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tab, Tabs, Form } from 'react-bootstrap';
import ReviewItem from '../ReviewItem/ReviewItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRugular } from '@fortawesome/free-regular-svg-icons';
import styles from './DetailsAndReviews.module.scss';
import AddReview from '../AddReview';

export default function DetailsAndReviews({
  productId,
  detail = '',
  reviews = [],
}: {
  productId: number,
  detail: string | null,
  reviews: any[] | null
}) {

  const { status, data: session } = useSession();

  const [canAddReview, setCanAddReview] = useState(true);

  useEffect(() => {
    if(status !== 'loading') {
      if(reviews !== null && session?.user.id) {
        const findCustomerReview = reviews.find(i => i.createdById === session.user.id);
        if(findCustomerReview) {
          setCanAddReview(false);
        }
      }
    }
  }, [status, reviews]);

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
                    reviews.filter((i: any) => i.approved === true).map((review: any, index: number) => (
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
                      <p className='text-center my-5 h5 opacity-25'>Sign in for review this product</p>
                      : // already login

                        canAddReview
                        ?
                        <>
                        <p>Your email address will not be published. Required are marked *</p>
                        <AddReview 
                          productId={productId}
                        />
                        </>
                        :
                        <p className='text-center my-5 h6 opacity-25'>
                          You already add review for this product. If you want to update your review, go to my account page
                        </p>
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