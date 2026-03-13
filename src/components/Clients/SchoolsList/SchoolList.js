"use client";

import React, { useState } from "react";
import { Pagination, Spin } from "antd";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import useAxiosInstance from "../../../lib/useAxiosInstance";
import SchoolTable from "./SchoolTable";
import SearchFilter from "../../SearchFilter";
import DeleteModal from "../../DeleteModal";
import SchoolForm from "./SchoolForm";

const SchoolList = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  /* =======================
     STATE
  ======================= */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState("");

  const [editSchoolId, setEditSchoolId] = useState(null);

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* =======================
     FETCH SCHOOLS
  ======================= */
  const fetchSchools = async () => {
    const url = `api/schools?page=${page}&limit=${limit}${
      keyword ? `&keyword=${keyword}` : ""
    }`;

    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data, isLoading } = useQuery(
    ["schools", page, limit, keyword],
    fetchSchools,
    {
      keepPreviousData: true
    }
  );

  /* =======================
     EDIT HANDLERS
  ======================= */
  const handleEdit = (id) => {
    setEditSchoolId(id);
  };

  const closeEditModal = () => {
    setEditSchoolId(null);
  };

  /* =======================
     DELETE HANDLERS
  ======================= */
  const showDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModal(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`api/schools/${deleteId}`);
      toast.success("School deleted successfully");
      queryClient.invalidateQueries("schools");
      closeDeleteModal();
    } catch {
      toast.error("Failed to delete school");
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      {/* Search */}
      <SearchFilter handleSearch={setKeyword} />

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <SchoolTable
          data={data?.data || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDeleteClick={showDeleteModal}
        />
      )}

      {/* Pagination */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          total={data?.total || 0}
          pageSize={limit}
          current={page}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isDeleteModal={isDeleteModal}
        showModalDelete={closeDeleteModal}
        handleDelete={handleDelete}
        textheading="Delete School"
        action="delete"
        deleteTitle="school"
        deleteBtn="Delete"
      />

      {/* Edit School Modal */}
      <SchoolForm
        isOpen={!!editSchoolId}
        mode="edit"
        schoolId={editSchoolId}
        onClose={closeEditModal}
      />
    </>
  );
};

export default SchoolList;
