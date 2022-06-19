import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import classes from "./Pagination.module.css";
import { useState } from "react";
const MyPagination = (props) => {
  const paginationSize = 3;
  const pageNums=props.pageNums;
  const currentPage = props.page;
  const totalPages = props.pageData.totalPages;
  console.log('dgdfg',totalPages);

const nextClickHandler =()=> {
  const nextPossiblePageNum = currentPage+1;
  const lastPage = pageNums[paginationSize-1];
  if(nextPossiblePageNum <= totalPages){props.onSet(nextPossiblePageNum)}
  if(nextPossiblePageNum > lastPage){
    props.onPageNo(pageNums.map(pageNum => pageNum + 1))
  }
}

function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}
const prevPageHandler = () => {
  const prevPossiblePageNum = currentPage-1;
  const firstPage = pageNums[0];
  if(prevPossiblePageNum > 0){props.onSet(prevPossiblePageNum)}

  if(prevPossiblePageNum < firstPage){
    props.onPageNo(pageNums.map(pageNum => pageNum - 1))
  }
}

const firstPageHandler = () => {
  props.onSet(1);
  props.onPageNo(pageNums.map((pageNum,index)=> 1 + index));
}

const lastPageHandler = () => {
  props.onSet(totalPages);
  const array=pageNums.map((pageNum,index)=> totalPages - index).reverse()
  var result = arrayRemove(array, 0);
  props.onPageNo(result);
}
  return (
    <div className={classes.page}>
     <Pagination size="md" aria-label="Page navigation example" style={{width:'100%'}}>
      <PaginationItem disabled={!props.pageData.hasPrevious} onClick={firstPageHandler}>
        <PaginationLink first href="#" className="parent" style={{boxShadow:'none',outline:'none',color:'black'}}/>
      </PaginationItem>
    
      <PaginationItem disabled={!props.pageData.hasPrevious} onClick={()=>props.pageData.hasPrevious &&
      prevPageHandler()}>
        <PaginationLink previous className="parent" href="#" />
      </PaginationItem>

      
{pageNums.map(pageNum => pageNum <= totalPages && <><PaginationItem  className={currentPage===pageNum ? classes.active : ""}>
 
   
   <PaginationLink href="#"style={{boxShadow:'none',outline:'none'}} onClick={()=>props.onSet(pageNum)}>
     {pageNum} {console.log('pagenums',pageNum)}
   </PaginationLink>
 
   </PaginationItem></>)}



      <PaginationItem disabled={!props.pageData.hasNext} onClick={()=>props.pageData.hasNext && nextClickHandler()}>
        <PaginationLink next href="#" className="d-flex flex-row-reverse parent" />
      </PaginationItem>

      <PaginationItem disabled={!props.pageData.hasNext} onClick={()=>{ props.pageData.hasNext && lastPageHandler()}}>
        <PaginationLink last className="d-flex flex-row-reverse parent" href="#" />
      </PaginationItem>
    </Pagination>
    </div>
  );
};

export default MyPagination;
