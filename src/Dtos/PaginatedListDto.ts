export type PaginatedListDto<T> = {
    items: T[];
    totalCount: number;
}