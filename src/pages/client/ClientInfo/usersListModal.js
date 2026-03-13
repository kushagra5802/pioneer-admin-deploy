import React from "react";
import { Modal, Table } from "antd";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

const Column = Table;

const UsersListModal = ({ isOpen, setIsOpenUserModal }) => {
  const { clientId } = useParams();
  const axiosInstance = useAxiosInstance();

  //fetch all client info -->

  const fetchClient = async () => {
    return axiosInstance.get(`api/clients/${clientId}`);
  };
  const ClientsUsersData = useQuery("clients_users_list", fetchClient);

  // <--

  const handleCancel = () => {
    setIsOpenUserModal(false);
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
          <div className='client-modal'>
            <div className='modal-title'>
              <h3>Users</h3>
            </div>
            <div className='modal-wrapper-body client-user-list'>
              <div className='modal-wrapper-content pa-0'>
                <div className='user-data-table custom-scrollbar'>
                  <Table
                    rowKey={(record) => record._id}
                    dataSource={ClientsUsersData?.data?.data?.data?.users}
                    className='user-table-inner'
                    scroll={{ y: 240 }}
                  >
                    <Column title='user Id' dataIndex='_id' width='30%' />
                    <Column
                      title='NAME'
                      dataIndex='firstName'
                      className='capitalize'
                    />
                    <Column title='ROLE' dataIndex='role' />
                    <Column
                      title='STATUS'
                      dataIndex='userstatus'
                      className='user-status-text'
                      render={(text = "active") => (
                        <span
                          style={{
                            color: text === "active" ? "#27AE60" : "#E84C3B"
                          }}
                        >
                          {text}
                        </span>
                      )}
                    />
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
