interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    //   totalItems: number;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    //   totalItems,
    onItemsPerPageChange,
}: PaginationProps) {
    const getVisiblePages = () => {
        const pageRange = 10;
        const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
        const endPage = Math.min(startPage + pageRange - 1, totalPages);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col items-center gap-4 mt-6">

            <div className="flex gap-4 items-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-md ${page === currentPage
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-gray-600">
                    Items per page:
                </label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
}
