'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { paymentService, orderService } from '@/services';
import { VerifyPaymentResponse } from '@/types/stripe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import useStore from '@/store';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const store = useStore((state) => state);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentId) {
        setIsLoading(false);
        setError('ไม่พบรหัสการชำระเงิน');
        return;
      }

      try {
        setIsLoading(true);
        const paymentData = await paymentService.verifyPayment(paymentId);
        const orders = await orderService.getOrders()
        const orderId = orders.RESULT_DATA.find((i: any) => i.paymentIntent === paymentId)

        if(paymentData.payment) {
          if(paymentData.payment.status === 'succeeded') {
            if(orderId.paymentStatus === 'PENDING') {
              await orderService.updateOrder(orderId.id, 'PAID')
              store.incrementRefreshCart()
            }
          }
          else {
            await orderService.updateOrder(orderId.id, 'FAILED')
          }
        }
        else {
          await orderService.updateOrder(orderId.id, 'FAILED')
        }

        setPaymentDetails(paymentData);
      } catch (error: any) {
        setError(error.message || 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน');
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [paymentId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-pulse">กำลังตรวจสอบการชำระเงิน...</div>
      </div>
    );
  }

  if (error || !paymentDetails?.success) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">
          {error || paymentDetails?.error || 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน'}
        </div>
        <Link href="/checkout" className="text-blue-600 hover:underline">
          กลับไปยังหน้าชำระเงิน
        </Link>
      </div>
    );
  }

  const payment = paymentDetails.payment;
  if (!payment) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-yellow-100 p-4 rounded text-yellow-700 mb-4">
          ไม่พบข้อมูลการชำระเงิน
        </div>
        <Link href="/checkout" className="text-blue-600 hover:underline">
          กลับไปยังหน้าชำระเงิน
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(payment.created * 1000).toLocaleDateString('th-TH');
  const amountInBaht = (payment.amount / 100).toFixed(2);

  return (
    <div className="container payment-success">
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-center align-items-center py-5">
            <div className="text-center w-50">
              <FontAwesomeIcon icon={faCheck} className='success-icon' />
              <h1 className='mb-4'>Payment Success</h1>
              <p className='mb-0'>รหัสการชำระเงิน: {payment.id}</p>
              <p className='mb-0'>สถานะ: {amountInBaht} บาท</p>
              <p className='mb-0'>รหัสการชำระเงิน: {payment.status === 'succeeded' ? 'สำเร็จ' : payment.status}</p>
              <p className='mb-0'>วันที่: {formattedDate}</p>
              <div className="btn-group d-flex justify-content-center mt-4">
                <Link href="/" className="btn design-btn gradient-btn px-4 me-3">Back to homepage</Link>
                <Link href="/products?brands=all&categories=all&topSale=desc" className="btn design-btn gradient-btn px-4 me-3">More shopping</Link>
                <Link href="/my-account/orders" className="btn design-btn gradient-btn px-4">View order recipe</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}