"use client";
import { Tab, Tabs, Form } from 'react-bootstrap';
import ReviewItem from '../ReviewItem/ReviewItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRugular } from '@fortawesome/free-regular-svg-icons';

export default function DetailsAndReviews() {


  return (
    <Tabs
      defaultActiveKey="productDetail"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="productDetail" title="Product Detail">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste ab, necessitatibus, quibusdam hic autem facilis velit rerum vel adipisci fugit sit, placeat animi! Eius corrupti ab maxime aliquid vero.</p>
      </Tab>
      <Tab eventKey="reviews" title="Reviews">
        <div className='row'>
          <div className='col-sm-7'>
            {
              [...Array(3)].map((review, index) => (
                <ReviewItem key={`review_item_${index + 1}`} />
              ))
            }
          </div>
          <div className='col-sm-5'>
            <h6>Add a review</h6>
            <p>Your email address will not be published. Required are marked *</p>
            <p className='mb-0'>Your Rating</p>
            <div className='d-flex mb-3'>
              <button className='btn btn-link p-0'><FontAwesomeIcon icon={faStarRugular} /></button>
              <button className='btn btn-link p-0'><FontAwesomeIcon icon={faStarRugular} /></button>
              <button className='btn btn-link p-0'><FontAwesomeIcon icon={faStarRugular} /></button>
              <button className='btn btn-link p-0'><FontAwesomeIcon icon={faStarRugular} /></button>
              <button className='btn btn-link p-0'><FontAwesomeIcon icon={faStarRugular} /></button>
            </div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control as="textarea" rows={4} placeholder="Your review*" />
              </Form.Group>
              <div className='row'>
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
              </div>
              <button type="submit" className='btn btn-dark'>SUBMIT</button>
            </Form>
          </div>
        </div>
        
      </Tab>
    </Tabs>
  )
}