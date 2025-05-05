'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { paymentService } from '@/services';
import { VerifyPaymentResponse } from '@/types/stripe';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto p-6 border rounded shadow bg-white">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600">ชำระเงินสำเร็จ!</h1>
        </div>

        <div className="border-t border-b py-4 my-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">รหัสการชำระเงิน:</span>
            <span className="font-medium">{payment.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">จำนวนเงิน:</span>
            <span className="font-medium">{amountInBaht} บาท</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">สถานะ:</span>
            <span className="font-medium text-green-600">
              {payment.status === 'succeeded' ? 'สำเร็จ' : payment.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">วันที่:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            กลับไปยังหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}