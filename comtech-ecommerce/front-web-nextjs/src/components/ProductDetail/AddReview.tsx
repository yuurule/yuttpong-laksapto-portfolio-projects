"use client";

import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

export default function AddReview() {

  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(rating, message);
  } 

  return(
    <Form 
      className={`form-design`}
      onSubmit={handleSubmit}
    >
      <Form.Group className='w-50 mb-3'>
        <Form.Label>Your Rating</Form.Label>
        <div className='d-flex align-items-center'>
          <div style={{width: 200, marginRight: 15}}>
            <Form.Range 
              className='w-100' 
              step={1} 
              min={0} 
              max={5} 
              defaultValue={0}
              onChange={(e) => {
                setRating(parseInt(e.target.value));
              }}
            />
          </div>
          <strong className='h4'>{ rating }</strong>
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control 
          as="textarea" 
          rows={4} 
          placeholder="Your review*"
          className='form-design'
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
      </Form.Group>
      <button 
        type="submit" 
        className='btn design-btn px-5'
      >
        SUBMIT
      </button>
    </Form>
  )
}