import { PaginationQueryParams } from "./pagination";

export interface GetEventsQuery extends PaginationQueryParams {
  search?: string;
}
