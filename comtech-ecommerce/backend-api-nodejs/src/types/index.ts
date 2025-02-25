export interface createCustomerDto {
  
}

export interface createProductDto {
  name: string,
  description: string,
  brandId: number,
  price: number,
  categories: {
    categoryId: number,
  }[],
  tags?: {
    tagId: number,
  }[],
  specs: {
    mainboard: string,
    mainboardFeature: string,
    cpu: string,
    gpu: string,
    ram: number,
    harddisk: string,
    soundCard: string,
    powerSupply: string,
    screenSize: number,
    screenType: string,
    refreshRate: number,
    dimension: string,
    weight: number,
    freeGift: string,
  },
  images?: {
    url_path: string, 
  }[]
}

export interface createProductReviewDto {

}

export interface createCategoryDto {

}

export interface createTagDto {
  
}

export interface createCartItemDto {
  
}

export interface createOrderDto {
  
}