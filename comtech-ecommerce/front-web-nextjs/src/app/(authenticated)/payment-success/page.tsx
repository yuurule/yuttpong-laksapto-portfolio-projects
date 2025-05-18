import PaymentSuccess from '@/components/PaymentSuccess/PaymentSuccess';
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  
  return (
    <div className="container payment-success">
      <div className="row">
        <div className="col-12">
          <Suspense fallback={<>Loading...</>}>
            <PaymentSuccess />
          </Suspense>
        </div>
      </div>
    </div>
  );
}