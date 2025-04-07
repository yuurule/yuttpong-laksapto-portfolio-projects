export const calculateUsePrice = (realPrice: number, campaign: any[]) => {
  if(campaign.length < 1) {
    return realPrice;
  }
  else {
    const discount = campaign[0].campaign.discount;
    const priceDiscount = realPrice - ((realPrice * discount) / 100);
    return priceDiscount;
  }
}

export const calculateSubtotal = (realPrice: number, campaign: any[], quantity: number) => {
  const usePrice = calculateUsePrice(realPrice, campaign);
  return usePrice * quantity;
}