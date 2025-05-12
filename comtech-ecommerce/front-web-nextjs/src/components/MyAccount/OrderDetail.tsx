"use client"

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { customerService } from '@/services'
import { formatTimestamp } from '@/utils/rendering'
import { calculateUsePrice, calculateSubtotal } from '@/utils/utils';
import { moneyFormat } from '@/utils/rendering';

export default function OrderDetail() {

  const { status, data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [customerData, setCustomerData] = useState<any>(null)
  const [ordersData, setOrdersData] = useState<any>([])
  const [selectOrder, setSelectOrder] = useState<any>(null)
  const [selectOrderData, setSelectOrderData] = useState<any>(null)
  const [moneyValue, setMoneyValue] = useState({
    orderItems: [],
    subTotal: 0,
    shippingFee: 0,
    vatTotal: 0,
    total: 0,
  });

  useEffect(() => {
    const fecthData = async () => {
      setLoading(true)
      try {
        if(status !== 'loading' && session?.user.id) {
          const customer = await customerService.getOneCustomer(session.user.id)
          const result = customer.RESULT_DATA
          setCustomerData(result)
          setOrdersData(result.orders)
          if(result.orders.length > 0) {
            setSelectOrder(result.orders[0].id)
            setSelectOrderData(result.orders[0])
            calculateMoneyValue(result.orders[0].orderItems)
          }
        }
      }
      catch(error) {
        console.log(`Fetch orders is failed due to reason: ${error}`);
        toast.error(`Fetch orders is failed due to reason: ${error}`);
      }
      finally { setLoading(false); }
    }

    fecthData()
  }, [status])

  const calculateMoneyValue = (orderItemsData: any[]) => {
    const tempResult: any = {
      orderItems: [],
      subTotal: 0,
      shippingFee: 0,
      vatTotal: 0,
      total: 0,
    };

    orderItemsData.map((item: any) => {
      const productPrice = parseFloat(item.product.price);
      const productCampiagn = item.campaign ? [{ campaign: item.campaign }] : [];
      const usePrice = calculateUsePrice(productPrice, productCampiagn);
      const itemSubTotal = calculateSubtotal(productPrice, productCampiagn, item.quantity);

      tempResult.orderItems.push({
        id: item.product.id,
        name: item.product.name,
        usePrice: usePrice,
        realPrice: productPrice,
        quantity: item.quantity,
        discount: item.discount,
        itemSubTotal: itemSubTotal,
      });

      tempResult.subTotal += itemSubTotal;
    });

    if(orderItemsData.length > 0) {
      tempResult.shippingFee = tempResult.subTotal >= 5000 ? 0 : 100;
    }
    tempResult.total = tempResult.subTotal + tempResult.shippingFee;
    tempResult.vatTotal = (tempResult.subTotal * 7) / 100;
    tempResult.subTotal = tempResult.subTotal - ((tempResult.subTotal * 7) / 100);

    console.log(tempResult)

    setMoneyValue(tempResult);
  }

  const renderPaymentStatusColor = (paymentStatus: string) => {
    let resultCss = ''
    switch(paymentStatus) {
      case 'PAID':
        resultCss = 'text-bg-success'
        break;
      case 'Failed':
      case 'Cancel':
        resultCss = 'text-bg-warning'
        break;
    }

    return resultCss
  }

  if(loading) return <p className='text-center my-5'>Loading...</p>

  return (
    <>
    <div className="row">
      <div className="col-lg-4">
        <table className={`table table-design`}>
          <thead>
            <tr>
              <th>#Order number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              ordersData.length > 0
              ?
              ordersData.map((i: any, index: number) => {
                return (
                  <tr key={`order_item_${index + 1}`}>
                    <td>
                      {
                        selectOrder === i.id
                        ?
                        <strong style={{color: 'var(--main-blue)'}}>#{i.orderNumber}</strong>
                        :
                        <span 
                          className='order-id'
                          onClick={() => {
                            setSelectOrder(i.id)
                            setSelectOrderData(i)
                            calculateMoneyValue(i.orderItems)
                          }}
                        >#{i.orderNumber}</span>
                      }
                    </td>
                    <td>
                      <small className={`badge ${renderPaymentStatusColor(i.paymentStatus)}`}>{i.paymentStatus}</small>
                    </td>
                  </tr>
                )
              })
              :
              <tr>
                <td colSpan={2} className='text-center py-5 opacity-50'>You not have order</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div className="col-lg-8">
        {
          selectOrderData !== null
          ?
          <div
            className='order-detail'
            style={{
              backgroundColor: '#FFF',
              border: '1px solid var(--very-soft-gray)',
              width: '100%',
              height: 'auto',
            }}
          >
            <header>
              <h6>Order details</h6>
              <hr />
            </header>
            <div className='d-flex justify-content-between' style={{fontSize: '0.7rem'}}>
              <div className='w-50'>
                #Order number: {selectOrderData.orderNumber}<br />
                <strong>Buyer</strong><br />
                {customerData.customerDetail.firstName} {customerData.customerDetail.lastName}<br />
                {customerData.customerDetail.address} {customerData.customerDetail.subDistrict} {customerData.customerDetail.district} {customerData.customerDetail.postcode} {customerData.customerDetail.province} {customerData.customerDetail.country}
                <br />
                {customerData.customerDetail.phone} / {customerData.email}
              </div>
              <div className='text-start w-50'>
                <p className='mb-0 text-end'>Created at: 20 Jan 2025</p>
                <strong>Shipping address</strong><br />
                {
                  selectOrderData.useSameAddress
                  ?
                  <>
                  {customerData.customerDetail.firstName} {customerData.customerDetail.lastName}<br />
                  {customerData.customerDetail.address} {customerData.customerDetail.subDistrict} {customerData.customerDetail.district} {customerData.customerDetail.postcode} {customerData.customerDetail.province} {customerData.customerDetail.country}
                  <br />
                  {customerData.customerDetail.phone}
                  </>
                  :
                  <>
                  {selectOrderData.firstName} {selectOrderData.lastName}<br />
                  {selectOrderData.address} {selectOrderData.subDistrict} {selectOrderData.district} {selectOrderData.postcode} {selectOrderData.province} {selectOrderData.country}
                  <br />
                  {selectOrderData.phone}
                  </>
                }
                
              </div>
            </div>
            <hr />
            <table className='table' style={{fontSize: '0.7rem'}}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className='text-end'>Price</th>
                  <th className='text-end'>Quantity</th>
                  <th className='text-end'>Sub total</th>
                </tr>
              </thead>
              <tbody>
                {
                  moneyValue.orderItems.map((i: any, index: number) => (
                    <tr key={`order_item_${index + 1}`}>
                      <td>{i.name}</td>
                      <td className='text-end'>
                        {
                          i.usePrice !== i.realPrice
                          ?
                          <>
                          ฿{moneyFormat(i.usePrice, 2, 2)}
                          <small className='d-block opacity-50'><s>฿{moneyFormat(i.realPrice, 2, 2)}</s></small>
                          </>
                          :
                          <>฿{moneyFormat(i.usePrice, 2, 2)}</>
                        }
                        
                      </td>
                      <td className='text-end'>x{i.quantity}</td>
                      <td className='text-end'>฿{moneyFormat(i.itemSubTotal, 2, 2)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className='subtotal-box w-50 ps-5 float-end' style={{fontSize: '0.7rem'}}>
              <dl className='row mb-0'>
                <dt className='col-6'><strong>Sub total</strong></dt>
                <dd className='col-6 text-end'>฿{moneyFormat(moneyValue.subTotal, 2, 2)}</dd>

                <dt className='col-6'><strong>Shippng fee</strong></dt>
                <dd className='col-6 text-end'>฿{moneyFormat(moneyValue.shippingFee, 2, 2)}</dd>

                <dt className='col-6'><strong>Vat(7%)</strong></dt>
                <dd className='col-6 text-end'>฿{moneyFormat(moneyValue.vatTotal, 2, 2)}</dd>

                <dt className='col-6'><strong>Total</strong></dt>
                <dd className='col-6 text-end'>฿{moneyFormat(moneyValue.total, 2, 2)}</dd>
              </dl>
              <hr className='mt-2' />
            </div>
            <div style={{clear: 'both'}}></div>
          </div>
          :
          <p className='text-center opacity-50 my-5'>Select order to preview</p>
        }
        
      </div>
    </div>
    </>
  )
}