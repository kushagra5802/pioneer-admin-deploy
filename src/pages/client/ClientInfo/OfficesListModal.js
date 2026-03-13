import React from "react";
import { Modal, Table } from "antd";

const Column = Table;

const UsersListModal = ({ isOpen, setIsOpenOfficeModal }) => {


  const handleCancel = () => {
    setIsOpenOfficeModal(false);
  };

  return (
    <>
      {isOpen && (
        <Modal
          open={isOpen}
          // onSumbit={handleToggleStatus}
          onCancel={handleCancel}
          footer={null}
          width={1040}
        >
          <div className="client-modal">
            <div className='modal-title'>
              <h3>Offices</h3>
            </div>
            <div className="modal-wrapper-body client-user-list">
              <div className="modal-wrapper-content p-0">

                <div className="user-data-table custom-scrollbar">
                  <Table
                    rowKey={(record) => record._id}
                    //   dataSource={ClientsUsersData?.data?.data?.data?.users}
                    className="user-table-inner"
                    scroll={{ y: 400, }}
                  >

                    <Column title="Office name" dataIndex="office_name" width="30%" />
                    <Column title="Constituency" dataIndex="constituency" />
                    <Column title="Address" dataIndex="address" />



                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UsersListModal;
