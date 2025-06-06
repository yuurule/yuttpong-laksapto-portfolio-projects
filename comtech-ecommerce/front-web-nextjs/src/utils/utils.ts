export const calculateUsePrice = (realPrice: number, campaign: any[]) => {
  if(campaign.length < 1) {
    return realPrice;
  }
  else {
    if(campaign[0].campaign.startAt !== null && campaign[0].campaign.endAt !== null) {
      const discount = parseFloat(campaign[0].campaign.discount);
      const priceDiscount = realPrice - ((realPrice * discount) / 100);
      return priceDiscount;
    }
    else {
      return realPrice;
    }
  }
}

export const calculateSubtotal = (realPrice: number, campaign: any[], quantity: number) => {
  const usePrice = calculateUsePrice(realPrice, campaign);
  return usePrice * quantity;
}