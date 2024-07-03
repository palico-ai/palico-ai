import { PaginationParams } from '@palico-ai/common';
import { PaginatedResponse } from '../types/common';

interface GetPaginationParamsOptions {
  pageSize: number;
}

export const getPaginationParams = (
  page: number,
  options: GetPaginationParamsOptions = {
    pageSize: 20,
  }
): PaginationParams => {
  return {
    limit: options.pageSize,
    offset: page * options.pageSize,
  };
};

export function paginatedResponse<T>(
  items: T[],
  pagination: PaginationParams
): PaginatedResponse<T> {
  const hasNextPage = items.length === pagination.limit;
  return {
    items,
    nextPage: hasNextPage
      ? {
          limit: pagination.limit,
          offset: pagination.offset + pagination.limit,
        }
      : undefined,
  };
}
