import React from "react";
import { Table, Button, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../../styles/antd-overrides.css";

const SchoolTable = ({ data, loading, onEdit, onDeleteClick }) => {
  const columns = [
    { title: "School Name", dataIndex: "schoolName" },
    { title: "Board", dataIndex: "board" },
    { title: "City", dataIndex: "city" },
    { title: "State", dataIndex: "state" },
    { title: "Admin Email", dataIndex: "adminEmail" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record._id)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDeleteClick(record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        className="dark-table"
      />
    </div>
  );
};

export default SchoolTable;
