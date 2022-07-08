import React, { useEffect, useState } from 'react'

const PaginationComponent = ({ data , rowsPerPageOptions , onChangeRowsPerPage , rowsPerPage }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(undefined)
    const [pages,setPages] = useState([1,2,3])

    useEffect(() => {
      changePage(1)
    },[])

    const changePage = page => {
      setCurrentPage(page)
      let temp = Math.ceil(data.length / rowsPerPage)
      setNumberOfPages(temp)
      if(page+2 <= temp) {
        if(page===pages[2]){
          let tempPages = [page, page+1, page+2]
          setPages(tempPages)
        }
      }
    }

    const changeNumberOfRowsPerPage = e => {
      e.preventDefault()
      setCurrentPage(1)
      setPages([1,2,3])
      setNumberOfPages(Math.ceil(data.length / e.target.value))
      onChangeRowsPerPage(e)
    }

    const switchPages = direction => {
      let tempPages = [...pages]
      let noOfPages = Math.ceil(data.length / rowsPerPage)
      if(direction === 'previous' && tempPages[0] > 1) {
        tempPages = tempPages.map(item => item-2)
        setPages(tempPages)
      }
      else if(direction === 'next' && tempPages[2] < noOfPages) {
        tempPages = tempPages.map(item => item+2)
        setPages(tempPages)
      }
    }

    const showLastPage = direction => {
      let noOfPages = Math.ceil(data.length / rowsPerPage)
      if(direction === 'end')
        setPages([noOfPages-2 , noOfPages-1 , noOfPages])
      else
        setPages([1,2,3])
    }

    return (
      <div className="pt-5 flex flex-col">
        {
          data.slice(((currentPage*rowsPerPage)-rowsPerPage) , ((currentPage*rowsPerPage))).map((item,index) => {
            return <p key = {index}>{item.name}</p>
          })
        }
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between" style = {{ background : 'orange' , position : 'absolute' , bottom : 0 , left : 0 , width : '100%' , padding : '0 30px' }}>
          <div className="flex items-center">
            <div className="mr-4 flex">
                Row per page
              <div className="relative ml-2">
                  <select onChange = {changeNumberOfRowsPerPage}>
                    {
                      rowsPerPageOptions.map((item,index) => <option value = {item} key = {index}>
                        {item}
                      </option>)
                    }
                  </select>
              </div>
            </div>
            <p className="text-sm text-gray-700">        
                <span className="font-medium px-1">1-{rowsPerPage}</span>
                of
                <span className="font-medium px-1">{data.length}</span>        
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
              <a
                style = {{ display : 'flex' , alignItems : "center" , marginRight : '10px' }}
                onClick = {() => showLastPage('start')}
                className = 'cursor-pointer'
              >
                <img src="https://image.flaticon.com/icons/png/512/54/54227.png" alt="sdfn"style = {{ height : '16px' , width : '16px' }} />
              </a>
              <a className="relative inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick = {() => switchPages('previous')}>
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <span className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700" style = {{ display : pages[0] > 1 ? 'block' : 'none' }}>
                ...
              </span>
              {
                pages.map((item,index) => {
                  return (
                    <a
                      className="text-gray-700 hover:bg-gray-50 relative inline-flex items-center px-4 py-1.5 text-sm font-medium cursor-pointer"
                      onClick = {() => changePage(item)}
                      style = {{ background : currentPage === item ? 'white' : 'none' }}
                      key = {index}
                    >
                      {item}
                    </a>
                  )
                })
              }
              <span className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700" style = {{ display : pages[2] <= numberOfPages ? 'block' : 'none' }}>
                ...
              </span>
              <a className="relative inline-flex items-center px-2 py-1.5 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick = {() => switchPages('next')}>
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>

              <a
                style = {{ display : 'flex' , alignItems : "center" , marginLeft : '10px' }}
                onClick = {() => showLastPage('end')}
                className = 'cursor-pointer'
              >
                <img src="https://image.flaticon.com/icons/png/512/54/54366.png" alt="dfhg" style = {{ width : '16px' , height : '16px' }} />
              </a>
            </nav>
          </div>
        </div>
      </div>
    )
}

export default PaginationComponent