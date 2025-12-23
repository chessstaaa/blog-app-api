import { PaginationQueryParams } from "./pagination";

export interface GetAttendeeQuery extends PaginationQueryParams {
  search?: string;
}
