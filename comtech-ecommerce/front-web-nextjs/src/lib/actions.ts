'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';

export async function addReviewAction(formData: {
  productId: number, 
  rating: number, 
  message: string, 
  customerId: number,
  accessToken: string,
}) {

  try {
    const url = process.env.NEXT_PUBLIC_API_URL + '/api/review/create';
    const requestData = {
      productId: formData.productId, 
      rating: formData.rating,
      message: formData.message,
      customerId: formData.customerId
    }
    await axios.post(url, requestData, {
      headers: {
        'Authorization': `Bearer ${formData.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`Add review is successfully`);
    revalidatePath(`/products/${formData.productId}`);
    revalidatePath(`/my-account/reviews`);
    return {
      success: true,
      message: 'Add review is successfully, your review is wait for approved before publish',
    }
  }
  catch(error) {
    console.error(`Add review failed due to reason: ${error}`);
    return {
      success: false,
      message: `Add review failed due to reason: ${error}`,
    }
  }
}