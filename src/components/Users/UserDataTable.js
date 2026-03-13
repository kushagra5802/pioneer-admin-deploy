import React, { useContext, useState } from 'react'
import { Table, Space, Skeleton, Empty } from 'antd'
import DeleteModal from '../DeleteModal';
import { AppContext } from "../../context/AppContextProvider";
import UserContext from '../../context/userContext';
import useAxiosInstance from '../../lib/useAxiosInstance';

const Column = Table;

const UserDataTable = ({ usersData, userSearchData, handleDelete, pagination, isLoading }) => {
    const adminUser=JSON.parse(localStorage.getItem("admin-user"));
    const axiosInstance = useAxiosInstance();
    const userContext = useContext(UserContext);
    const { isDropdownOpen, handleClick, handleMouseEnter, handleMouseLeave } = useContext(AppContext);

    const [isDeleteModal, setDeleteModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const showModalDelete = (record) => {
        setSelectedRecord(record);
        setDeleteModal(!isDeleteModal)
    };

    const handleEdit = async (record) => {
        try {
            const response = await axiosInstance.get(`api/users/info/${record._id}`);
            const responseData = response.data.data;
            userContext.updateEditData(responseData);
            userContext.updateAddMode(false);
            userContext.updateOpenModal(true);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };
    
    return (
        <div className='user-data-table user-data-table-email'>
            <Table rowKey={record => record._id} dataSource={userSearchData?.data?.data || usersData} className="user-table-inner" pagination={pagination}
                locale={{
                    emptyText: isLoading ? (
                        <div
                            style={{
                                marginLeft: "20px",
                                width: "95%"
                            }}
                        >

                            <Skeleton
                                title={false}
                                active
                                paragraph={{
                                    rows: 6,
                                    width: ["100%", "100%", "100%", "100%", "100%", "100%"]
                                }}
                            />
                        </div>
                    ) : (
                        <Empty />
                    )
                }}>
                <Column title="NAME" dataIndex="name"
                    render={(text, record) => (
                        <span>
                            {`${record.firstName} ${record.lastName}`}
                        </span>
                    )}
                />
                <Column title="EMAIL" dataIndex="email" />
                <Column title="PHONE" dataIndex="phone" />
                <Column title="ROLE" dataIndex="role"
                    render={(text) => {
                        switch (text) {
                            case "clientManager":
                                return "Client Manager";
                            case "superadmin":
                                return "Super Admin";
                            default:
                                return text;
                        }
                    }}

                />
                <Column title="STATUS" dataIndex="userstatus" className="user-status-text"
                    render={(text) => (
                        <span style={{ color: text === 'active' ? '#27AE60' : '#E84C3B' }}>
                            {text}
                        </span>
                    )}
                />
                <Column title="ACTION" key="action"
                    render={(text, record, index) => {
                         // Determine if Edit should be shown
                        const canEdit =
                        adminUser?.role === 'admin'
                            ? record?._id === adminUser?._id
                            : true;
                        return (
                            <Space className='select-option' size="small" style={{}}>
                                    <div className="dropdown" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                        <span onClick={() => handleClick(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="30" viewBox="0 0 34 30" fill="none">
                                                <circle cx="17.3889" cy="9.38845" r="1.38889" transform="rotate(-90 17.3889 9.38845)" fill="#004877" />
                                                <circle cx="17.3889" cy="15.4998" r="1.38889" transform="rotate(-90 17.3889 15.4998)" fill="#004877" />
                                                <circle cx="17.3889" cy="21.6111" r="1.38889" transform="rotate(-90 17.3889 21.6111)" fill="#004877" />
                                            </svg>
                                        </span>
                                        {isDropdownOpen(index) && (
                                            <div className="dropdown-content">
                                                {canEdit && (
                                                    <div onClick={() => handleEdit(record)}>Edit</div>
                                                )}
                                                <div onClick={() => showModalDelete(record)}>Delete</div>
                                            </div>
                                        )}
                                    </div>
                            </Space>
                        )
                    }}        
                />
            </Table>

            {isDeleteModal && (
                <DeleteModal
                    textheading="Delete User"
                    deleteTitle="User"
                    deleteBtn="Delete User"
                    handleDelete={() => handleDelete(selectedRecord)}
                    isDeleteModal={isDeleteModal}
                    showModalDelete={() => setDeleteModal(false)}
                    action='delete'
                />
            )}
        </div>
    )
};

export default UserDataTable


