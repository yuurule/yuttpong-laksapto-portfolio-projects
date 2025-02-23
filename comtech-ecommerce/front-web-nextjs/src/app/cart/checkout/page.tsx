import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import OrderSummary from "@/components/Cart/CartTotal/OrderSummary";
import PageHeader from "@/components/PageHeader/PageHeader";
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";

export default function CheckoutPage() {

  

  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Checkout" />
          </header>
          <div className="col-sm-8">
            <section className="mb-4">
              <h6>Billing Details</h6>
              <hr />
              <div className="row">
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("First Name", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Last Name", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Country / Region", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Street address", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Postcode", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Town / City", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Phone", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Email address", true)}
                  />
                </div>
                <div className="col-sm-12">
                  <TextInput
                    labelText={renderLabelInput("Order noteds (optional)")}
                    isTextArea={true}
                  />
                </div>
              </div>
            </section>

            <section className="mb-4">
              <h6>Payment Details</h6>
              <hr />
              <div className="row">
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Name on card", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Card number", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("Valid through", true)}
                  />
                </div>
                <div className="col-sm-6">
                  <TextInput
                    labelText={renderLabelInput("CVC Code", true)}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="col-sm-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </main>
  )
}