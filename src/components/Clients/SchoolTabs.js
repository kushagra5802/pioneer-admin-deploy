import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolList from "./SchoolsList/SchoolList";

const SchoolTabs = () => {
  const [activeTab, setActiveTab] = useState("school-list");
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="tabs">
        <button
          className={activeTab === "school-list" ? "active" : ""}
          onClick={() => {
            setActiveTab("school-list");
            navigate("../school-list");
          }}
        >
          School List
        </button>
      </div> */}
      <SchoolList />

      {/* {activeTab === "school-list" && <SchoolList />} */}
    </>
  );
};

export default SchoolTabs;
