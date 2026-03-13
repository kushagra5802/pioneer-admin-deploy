import React, { useContext } from "react";
import { MdAdd } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import SchoolContext from "../../context/schoolContext";
import PageHeading from "../PageHeading";
import SchoolForm from "./SchoolsList/SchoolForm";
import SchoolTabs from "./SchoolTabs";

const Result = () => {
  const user = JSON.parse(localStorage.getItem("admin-user"));
  const schoolContext = useContext(SchoolContext);

  return (
    <div className="page-wrapper">
      <ToastContainer />

      <PageHeading
        pageTitle="Schools"
        icon={<MdAdd />}
        pageModalTitle="Add New School"
        pageModalOpen={() => schoolContext.updateOpenModal(true)}
        role={user?.role}
      />

      <SchoolForm
        isOpen={schoolContext.isOpenModal}
        isAddMode={schoolContext.isAddMode}
      />

      <SchoolTabs />
    </div>
  );
};

export default Result;
