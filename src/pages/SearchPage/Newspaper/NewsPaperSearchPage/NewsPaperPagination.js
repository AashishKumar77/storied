import React from "react";
import TWPaginationComponent from "../../../../components/Pagination/TWPaginationComponent";

const NewsPaperPagination = ({
  getResult,
  currentPage, 
  setCurrentPage, 
  limitPerPage, 
  setLimitPerPage, 
  totalRecords
}) => {
  const changeLimit = (pageLimit) => {
		  setLimitPerPage(pageLimit)
      setCurrentPage(1)
		  getResult(1, pageLimit);
	};
    return <TWPaginationComponent
    getList={(page)=>{
        setCurrentPage(page)
        getResult(page, limitPerPage, false)
    }}
    classPagination = "flex-col md:flex-row "
    currentPage={parseInt(currentPage || 0)}
    totalRecords={totalRecords}
    limitPerPage={limitPerPage}
    changeLimit={changeLimit}
    tableSize={null}
  />
}
export default NewsPaperPagination;