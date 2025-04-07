import API from '@/lib/api';

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  noPagination?: boolean;
  brands?: number[];
  orderBy?: string;
  orderDir?: string;
  search?: string;
  categories?: number[];
  tags?: number[];
}

export const productService = {

  getBrands: async (): Promise<any> => {
    const url = `/api/brand`;
    return API.get<any>(url, false);
  },

  getCategories: async (): Promise<any> => {
    const url = `/api/category`;
    return API.get<any>(url, false);
  },

  getProducts: async ({
    page = 1,
    pageSize = 12,
    noPagination = false,
    brands = [],
    orderBy = 'createdAt',
    orderDir = 'desc',
    search,
    categories,
    tags,
  }: GetProductsParams = {}): Promise<any> => {

    let url = `/api/product?page=${page}&pageSize=${pageSize}&noPagination=${noPagination}&orderBy=${orderBy}&orderDir=${orderDir}`;

    if (brands && brands.length > 0) {
      url += `&brands=${brands.join(',')}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    if (categories && categories.length > 0) {
      url += `&categories=${categories.join(',')}`;
    }
    
    if (tags && tags.length > 0) {
      url += `&tags=${tags.join(',')}`;
    }

    return API.get<any>(url, false);
  },

  getOneProduct: async (id: string): Promise<any> => {
    let url = `/api/product/${id}`;
    return API.get<any>(url, false);
  },

}