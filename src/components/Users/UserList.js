import React, { useState } from "react";
import { Select, Pagination } from "antd";
import { useQuery, useQueryClient } from "react-query";
import SearchFilter from "../../components/SearchFilter";
import UserDataTable from "../../components/Users/UserDataTable";
import useAxiosInstance from "../../lib/useAxiosInstance";
import { toast } from "react-toastify";

const UserList = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // GET ALL USER DATA
  const fetchUsers = async () => {
    const response = await axiosInstance.get(
      `api/users/info?page=${currentPage}&limit=${limit}`
    );
    setTotal(response.data.data.totalPages * limit);
    return response;
  };

  const usersData = useQuery(
    ["allUsers", currentPage, limit],
    () => fetchUsers(),
    {
      refetchOnWindowFocus: false,
      retry: 1
    }
  );

  // GET ALL SEARCH USER DATA
  const SearchUser = (value) => {
    setCurrentPage(1);
    setSearchKeyword(value);
  };

  const fetchSearchUsers = async () => {
    let response;
    if (searchKeyword) {
      response = await axiosInstance.get(
        `api/users/search?keyword=${searchKeyword}&page=${currentPage}&limit=${limit}`
      );

      setTotal(response?.data?.totalpages * limit);
    }
    else{
       const response = await axiosInstance.get(
         `api/users/info?page=${currentPage}&limit=${limit}`
       );
       setTotal(response.data.data.totalPages * limit);
    }
    return response;
  };

  const userSearchData = useQuery(
    ["allSearchUsers", searchKeyword, currentPage, limit],
    () => fetchSearchUsers(),
    {
      refetchOnWindowFocus: false,
      retry: 1
    }
  );
const isLoading = usersData?.isLoading || userSearchData?.isLoading;


  // FOR PAGINATION
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setLimit(pageSize);
  };

  const pagination = {
    total,
    pageSize: limit,
    current: currentPage,
    onChange: handlePageChange
  };

  // DELETE USER
  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`api/users/${record._id}`);
      const message = response?.data?.message;
      toast.success(`${message}`);
      queryClient.invalidateQueries("allUsers");
      queryClient.invalidateQueries("allSearchUsers");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className='table-list'>
      <SearchFilter handleSearch={SearchUser} />

      <UserDataTable
        usersData={usersData?.data?.data?.data?.results}
        userSearchData={userSearchData?.data}
        handleDelete={handleDelete}
        pagination={pagination}
        isLoading={isLoading}
      />

      <div className='report-pagination '>
        <div>
          <Select
            value={limit.toString()}
            style={{ width: 56 }}
            onChange={(value) => {
              setLimit(parseInt(value));
              setCurrentPage(1);
            }}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
              { value: "100", label: "100" }
            ]}
          />
          <span className='pl-2'> Entries per pages</span>
        </div>

        <div className='report-selection'>
          <Pagination
            className='pagination'
            current={currentPage}
            pageSize={limit}
            total={total}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setLimit(pageSize);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
