import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import CheckoutForm from "@/components/Checkout/CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {

  const { orderId } = await params;

  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Checkout" />
          </header>
        </div>
        <CheckoutForm orderId={orderId} />
      </div>
    </main>
  )
}