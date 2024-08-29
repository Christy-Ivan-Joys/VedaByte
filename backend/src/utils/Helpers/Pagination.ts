
export function Paginate(items:[], currentPage: number, ItemsPerPage: number) {

    const indexOfLastItem = currentPage * ItemsPerPage;
    const indexOfFirstitem = indexOfLastItem - ItemsPerPage;
    const paginatedItems:any = items.slice(indexOfFirstitem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / ItemsPerPage)
    return { totalPages, paginatedItems}
}