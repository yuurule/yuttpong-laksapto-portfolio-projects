export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  
  // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่
  const formatter = new Intl.DateTimeFormat('th', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return formatter.format(date);
}

export function formatMoney(value) {
  let parse = parseFloat(value);
  return parse.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function sumTotalSale(ordersData) {
  let resultTotalSale = 0;
  let resultTotalSaleAmount = 0;
  ordersData.map(i => {
    if(i.order.paymentStatus === 'PAID') {
      resultTotalSale += parseFloat(i.sale_price);
      resultTotalSaleAmount += i.quantity
    }
  });

  return {
    saleAmount: resultTotalSaleAmount,
    totalSale: '฿' + resultTotalSale.toLocaleString('th-TH')
  }
}