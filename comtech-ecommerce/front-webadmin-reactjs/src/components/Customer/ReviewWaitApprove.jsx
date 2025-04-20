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
  const [onSubmit, setOnSubmit] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fecthReview = async () => {
      try {
        const reviews = await ReviewService.getReviews();
        //console.log(reviews.data.RESULT_DATA)
        setReviewList(reviews.data.RESULT_DATA.filter(i => i.approved === null));
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
  }, [refresh]);

  const handleChangeCurrentReview = (dir) => {
    let currentIndex = currentShowReview;
    if(dir === 'next' && currentIndex < reviewList.length - 1) currentIndex++;
    else if(dir === 'previous' && currentIndex > 0) currentIndex--;
    setCurrentShowReview(currentIndex);
  }

  const handleSubmitApproveReview = async (reviewId, approve) => {
    setOnSubmit(true);
    try {
      await ReviewService.approveReview(reviewId, approve)
        .then(response => {
          setRefresh(prevState => prevState + 1);
          toast.success(`${approve === true ? 'Approve' : 'Unapprove'} review is successfully!`);
        })
        .catch(error => {
          throw new Error(error);
        });
    }
    catch(error) {
      console.log(error);
      toast.error(error);
    } 
    finally {
      setOnSubmit(false);
    }
  }

  if(loadData) return <>Loading...</>

  return (
    <div className='card'>
      <div className='card-body'>
        <header>
          <h5>Review Waiting For Approve<span></span></h5>
        </header>
        {
          reviewList.length > 0 ?
          <>
          <div className='d-flex justify-content-between align-items-center'>
            <strong>Review</strong>
            <div className='d-flex'>
              <button
                type="button" 
                className='btn btn-success me-2'
                disabled={onSubmit}
                onClick={() => handleSubmitApproveReview(reviewList[currentShowReview]?.id, true)}
              ><FontAwesomeIcon icon={faCheck} /></button>
              <button 
                type="button"
                className='btn btn-danger'
                disabled={onSubmit}
                onClick={() => handleSubmitApproveReview(reviewList[currentShowReview]?.id, false)}
              ><FontAwesomeIcon icon={faCancel} /></button>
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
              disabled={currentShowReview === 0 || onSubmit}
              onClick={() => handleChangeCurrentReview('previous')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <strong>{currentShowReview + 1} of {reviewList.length}</strong>
            <button 
              type="button"
              className='btn btn-link p-0'
              disabled={currentShowReview === reviewList.length - 1 || onSubmit}
              onClick={() => handleChangeCurrentReview('next')}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          </>
          : <p className='my-5 text-center'>Not have waiting approve review</p>
        }
      </div>
    </div>
  )
}