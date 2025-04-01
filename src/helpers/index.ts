import { PAGINATION_OPTIONS } from "./constants";
import { IProductSearchKey } from "./enums";
import { IGetProducts, IGetProductsWhereCase, IPaginationResponse } from "./interfaces";

export const trimModel = () => ({
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const getLimitAndOffset = (page: string = "", size: string = "") => {
  const pageNumber = parseInt(page, 10) || PAGINATION_OPTIONS.page;
  const limit = parseInt(size, 10) || PAGINATION_OPTIONS.size;
  const offset = (pageNumber - 1) * limit;

  return { limit, offset };
};

export const getPagination = (data: any, page: string, size: string): IPaginationResponse => {
  if (!data) {
    return { totalItems: 0, totalPages: 0, currentPage: 0, records: [] };
  }
  const { count: totalItems, rows: records } = data;
  const currentPage = +page > 0 ? +page : 1;
  const limit = size ? +size : 25;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    records,
    totalPages,
    currentPage,
  };
};

export const getSearchWhereCase = (queryObj: IGetProducts, args = {}) => {
  const { searchKey, searchValue, status } = queryObj;

  const whereCase = { isDeleted: false } as IGetProductsWhereCase;
  if (searchKey && searchValue) {
    whereCase[searchKey] = searchValue;
  }
  if (status) whereCase["status"] = status;

  return { ...whereCase, ...args };
};

export const getPaginationQuery = (queryObj: IGetProducts, args: any = {}) => {
  const { page, size } = queryObj;
  const { limit, offset } = getLimitAndOffset(page, size);
  const whereCase = getSearchWhereCase(queryObj, args);

  return {
    page,
    size,
    limit,
    offset,
    whereCase,
  };
};
