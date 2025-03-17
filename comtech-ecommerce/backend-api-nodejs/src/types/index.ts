import { PrismaClient, Prisma, StockAction } from '@prisma/client';

// Product
export interface createProductDto {
  name: string,
  description: string,
  brandId: number,
  price: number,
  publish: boolean,
  categories: {
    categoryId: number,
  }[],
  tags?: {
    tagId: number,
  }[],
  specs: {
    screen_size: string,
    processor: string,
    display: string,
    memory: string,
    storage: string,
    graphic: string,
    operating_system: string,
    camera: string,
    optical_drive: string,
    connection_ports: string,
    wireless: string,
    battery: string,
    color: string,
    dimension: string,
    weight: string,
    warranty: string,
    option: string,
  },
  images?: {
    url_path: string, 
    //order: number,
  }[]
}
export interface updateProductDto {
  name?: string;
  description?: string;
  brandId?: number;
  price?: number;
  publish?: boolean;
  categories?: {
    connect?: { categoryId: number }[];
    disconnect?: { categoryId: number }[];
  };
  tags?: {
    connect?: { tagId: number }[];
    disconnect?: { tagId: number }[];
  };
  specs?: {
    screen_size?: string,
    processor?: string,
    display?: string,
    memory?: string,
    storage?: string,
    graphic?: string,
    operating_system?: string,
    camera?: string,
    optical_drive?: string,
    connection_ports?: string,
    wireless?: string,
    battery?: string,
    color?: string,
    dimension?: string,
    weight?: string,
    warranty?: string,
    option?: string,
  };
  images?: {
    create?: { url_path: string, sequence_order: number }[];
    delete?: { id: number }[];
    //update?: { id: number, urlPath: string, order: number }[]; 
  };
}

// Stock
export interface createStockActionDto {
  productId: number;
  userId: number;
  actionType: string;
  quantity: number;
  description?: string;
}
export interface createStockSellActionDto {
  productId: number;
  customerId: number;
  actionType: string;
  quantity: number;
}

// Campaign
export interface createCampaignDto {
  userId: number;
  name: string;
  description: string;
  discount: number;
}
export interface updateCampaignDto {
  userId: number;
  name?: string;
  description?: string;
  discount?: number;
}
export interface activateCampaignDto {
  campaignId: number;
  userId: number;
  isActive: boolean;
  startAt?: Date;
  endAt?: Date;
}
export interface createCampaignHistoryDto {
  userId: number;
  campaignId: number;
  action: string;
  note?: string;
}
export interface addRemoveProductCampaignDto {
  userId: number;
  campaignId: number;
  productsId: number[];
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
  customerId: number;
  productId: number;
  quantity: number;
}

// Order
export interface createOrderDto {
  customerId: number;
  total: number;
  items: {
    productId: number;
    quantity: number;
    campaignId?: number;
    discount?: number;
    salePrice: number
  }[]
}