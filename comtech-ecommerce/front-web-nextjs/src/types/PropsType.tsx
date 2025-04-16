export interface ProductQueryParams {
  page: number;
  pageSize: number;
  noPagination?: boolean;
  brands?: number[];
  categories?: number[];
  tags?: number[];
  search?: string;
  orderBy?: string;
  orderDir?: string;
  onSale?: boolean;
  topSale?: string;
  campaigns?: number[];
  price?: number[];
}

export interface TextInputProps {
  handleOnChange?: Function,
  type?: string,
  labelText?: string | React.ReactNode,
  isRequired?: boolean,
  placeHolder?: string,
  isDisable?: boolean,
  isTextArea?: boolean,
  rows?: number,
  min?: number,
  max?: number | null,
}

export interface MoneyValueCartTableProps {
  cartItems: {
    id: number,
    name: string,
    campaignId?: number,
    discount?: number,
    usePrice: number,
    realPrice: number,
    quantity: number,
    itemSubTotal: number
  }[];
  subTotal: number;
  shippingFee: number;
  vatTotal: number;
  total: number; 
}

export interface createOrderProps {
  customerId: number;
  total: number;
  items: {
    productId: number,
    quantity: number,
    salePrice: number,
    campaignId?: number,
    discount?: number
  }[];
}