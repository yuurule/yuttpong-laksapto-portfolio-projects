import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import * as ReviewService from '../../services/reviewService';
import { toast } from 'react-toastify';
import { formatTimestamp } from '../../utils/utils';

export default function ReviewWaitApprove() {

  const [loadData, setLoadData] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [currentShowReview, setCurrentShowReview] = useState(0);

  useEffect(() => {
    const fecthReview = async () => {
      try {
        const reviews = await ReviewService.getReviews();
        console.log(reviews.data.RESULT_DATA)
        setReviewList(reviews.data.RESULT_DATA.filter(i => i.approved === false));
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      } 
      finally {
        setLoadData(false);
      }
    }

    fecthReview();
  }, []);

  if(loadData) return <>Loading...</>

  const handleChangeCurrentReview = (dir) => {
    let currentIndex = currentShowReview;
    if(dir === 'next' && currentIndex < reviewList.length - 1) currentIndex++;
    else if(dir === 'previous' && currentIndex > 0) currentIndex--;
    setCurrentShowReview(currentIndex);
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <header>
          <h5>Review Waiting For Approve</h5>
        </header>
        {
          reviewList.length > 0 ?
          <>
          <div className='d-flex justify-content-between align-items-center'>
            <strong>Review</strong>
            <div className='d-flex'>
              <button className='btn btn-success me-2'><FontAwesomeIcon icon={faCheck} /></button>
              <button className='btn btn-danger'><FontAwesomeIcon icon={faCancel} /></button>
            </div>
          </div>
          <hr />
          <div>
            <p style={{maxHeight: 120, overflowY: 'auto'}}>"{reviewList[currentShowReview].message}"</p>
            <div className='d-flex align-items-center' style={{fontSize: '0.9rem', opacity: '0.6'}}>
              <p className='mb-0 me-3'><strong>By</strong>: {reviewList[currentShowReview]?.createdBy?.customerDetail?.firstName} {reviewList[currentShowReview]?.createdBy?.customerDetail?.lastName}</p>
              <p className='mb-0'><strong>At</strong>: {formatTimestamp(reviewList[currentShowReview].createdAt)}</p>
            </div>
            <p className='mb-0' style={{fontSize: '0.9rem', opacity: '0.6'}}><strong>Product</strong>: {reviewList[currentShowReview]?.product?.name}</p>
          </div>
          <div className='w-100 d-flex justify-content-between align-items-center mt-3'>
            <button 
              type="button"
              className='btn btn-link p-0'
              disabled={currentShowReview === 0}
              onClick={() => handleChangeCurrentReview('previous')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <strong>{currentShowReview + 1} of {reviewList.length}</strong>
            <button 
              type="button"
              className='btn btn-link p-0'
              disabled={currentShowReview === reviewList.length - 1}
              onClick={() => handleChangeCurrentReview('next')}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          </>
          : <p>fuck off</p>
        }
      </div>
    </div>
  )
}