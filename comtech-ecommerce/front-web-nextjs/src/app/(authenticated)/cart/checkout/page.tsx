import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import StripeProvider from '@/providers/StripeProvider';
import CheckoutForm from "@/components/Checkout/CheckoutForm";

export default async function CheckoutPage() {

  const breadcrumbsList = [
    { text: 'Home', url: '/' },
    { text: 'Cart', url: '/cart' },
    { text: 'Checkout', url: null },
  ]

  return (
    <main className="">
      <Breadcrumbs urlList={breadcrumbsList} />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Checkout" />
          </header>
        </div>
        <StripeProvider>
          <CheckoutForm />
        </StripeProvider>
      </div>
    </main>
  )
}