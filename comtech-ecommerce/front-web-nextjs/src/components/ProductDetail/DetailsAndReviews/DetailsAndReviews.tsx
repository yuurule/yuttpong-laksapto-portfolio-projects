"use client";
import { Tab, Tabs, Form } from 'react-bootstrap';
import ReviewItem from '../ReviewItem/ReviewItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRugular } from '@fortawesome/free-regular-svg-icons';
import styles from './DetailsAndReviews.module.scss';

export default function DetailsAndReviews() {


  return (
    <div className={`${styles.detailsAndReviews}`}>
      <Tabs
        defaultActiveKey="productDetail"
        id="uncontrolled-tab-example"
        className={`tab-design`}
      >
        <Tab eventKey="productDetail" title="Product Detail">
          <div className={`${styles.content} p-3`}>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero.</p>
          </div>
        </Tab>
        <Tab eventKey="reviews" title="Reviews">
          <div className={`${styles.content}`}>
            <div className='row'>
              <div className='col-sm-7'>
                {
                  [...Array(3)].map((review, index) => (
                    <ReviewItem key={`review_item_${index + 1}`} />
                  ))
                }
              </div>
              <div className='col-sm-5'>
                <div className={`${styles.addReview}`}>
                  <h6>Add a review</h6>
                  <p>Your email address will not be published. Required are marked *</p>
                  <Form className={`form-design`}>
                    <Form.Group className='w-50 mb-3'>
                      <Form.Label>Your Rating</Form.Label>
                      <div className='d-flex align-items-center'>
                        <Form.Range className='me-5' />
                        <strong className='h4'>4.0</strong>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Your review*"
                        className='form-design'
                      />
                    </Form.Group>
                    {/* <div className='row'>
                      <div className='col-sm-6'>
                        <Form.Group className="mb-3">
                          <Form.Control placeholder="Name*" />
                        </Form.Group>
                      </div>
                      <div className='col-sm-6'>
                        <Form.Group className="mb-3">
                          <Form.Control type="email" placeholder="Email*" />
                        </Form.Group>
                      </div>
                    </div> */}
                    <button type="submit" className='btn design-btn px-5'>SUBMIT</button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}