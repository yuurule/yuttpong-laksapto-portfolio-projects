// Customer
export interface createCustomerDto {
  
}

// Product
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

export interface updateProductDto {
  name?: string;
  description?: string;
  brandId?: number;
  price?: number;
  categories?: {
    connect?: { categoryId: number }[];
    disconnect?: { categoryId: number }[];
  };
  tags?: {
    connect?: { tagId: number }[];
    disconnect?: { tagId: number }[];
  };
  specs?: {
    mainboard?: string;
    mainboardFeature?: string;
    cpu?: string;
    gpu?: string;
    ram?: number;
    harddisk?: string;
    soundCard?: string;
    powerSupply?: string;
    screenSize?: number;
    screenType?: string;
    refreshRate?: number;
    dimension?: string;
    weight?: number;
    freeGift?: string;
  };
  images?: {
    create?: { url_path: string }[];
    delete?: { id: number }[];
  };
}

// Review
export interface createReviewDto {
  productId: number,
  message: string,
  rating: number,
}
export interface updateReviewDto {
  message?: string,
  rating?: number,
}

// Category
export interface createCategoryDto {
  name: string,
  description: string,
}

// Cart
export interface createCartItemDto {
  
}

// Order
export interface createOrderDto {
  
}