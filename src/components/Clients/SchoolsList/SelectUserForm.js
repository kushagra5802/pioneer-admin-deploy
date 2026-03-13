import React, { useState, useEffect, useContext } from 'react'
import { Input, Select, Row, Col, Button } from "antd";
import ClientContext from '../../../context/schoolContext';
import useAxiosInstance from '../../../lib/useAxiosInstance';
import { useQuery } from 'react-query';

const SelectUserForm = ({ formik3, isAddMode, handlePrevious, addedUsers, setAddedUsers }) => {
    const clientContext = useContext(ClientContext);
    const axiosInstance = useAxiosInstance();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserRole, setSelectedUserRole] = useState("");


    // get users list
    useEffect(() => {
        // Reset addedUsers when switching from edit to add mode
        if (isAddMode && !formik3.errors) {
            setAddedUsers([]);
        } else if (!isAddMode) {
            // If in edit mode, update addedUsers based on edit data
            setAddedUsers(
                clientContext.editData.users.map((user) => ({
                    _id: user._id,
                    firstName: user.firstName,
                    role: user.role,
                }))
            );
        }
        // eslint-disable-next-line
    }, [isAddMode, clientContext.editData.users]);



    const fetchUsersList = async () => {
        try {
            let allUsers = [];
            let currentPage = 1;

            while (true) {
                const response = await axiosInstance.get(`api/users/info?page=${currentPage}`);
                const allListData = response.data.data.results;
                const activeUsers = allListData.filter(user => user.userstatus === "active");
                allUsers = [...allUsers, ...activeUsers];

                if (currentPage >= response.data.data.totalPages) {
                    break;
                }

                currentPage++;
            }
            return allUsers;
        } catch (error) {
            console.error("An error occurred while fetching users data.", error);
            throw error;
        }
    };

    const usersListData = useQuery("Users-List", fetchUsersList);
    // for fetch user roll

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
        const selectedUser = usersListData?.data?.find((user) => user._id === userId);
        if (selectedUser) {
            setSelectedUserRole(selectedUser.role);
            formik3.setFieldValue('users', [
                ...formik3.values.users,
                {
                    _id: selectedUser._id,
                    firstName: selectedUser.firstName,
                    role: selectedUser.role,
                },
            ]);
        }
    };

    // add multiple users
    const handleAddUser = () => {
        if (selectedUserId && selectedUserRole) {
            const selectedUser = usersListData?.data?.find((user) => user._id === selectedUserId);
            if (selectedUser) {
                setAddedUsers((prevUsers) => [
                    ...prevUsers,
                    {
                        _id: selectedUserId,
                        firstName: selectedUser.firstName,
                        role: selectedUserRole,
                    },
                ]);
                setSelectedUserId(null);
                setSelectedUserRole("");
            }
        }
    };

    // remove selected user
    const handleRemoveUser = (indexToRemove) => {
        setAddedUsers((prevUsers) =>
            prevUsers.filter((_, index) => index !== indexToRemove)
        );
    };
    return (
        <>
            <form onSubmit={formik3.handleSubmit}>
                <div className="client-info">
                    <div className="modal-title">
                        <h3>{isAddMode ? "Add New Client" : "Edit Client"}</h3>
                    </div>

                    <div className="modal-wrapper-body">
                        <div className="modal-wrapper-content">
                            <Row className="add-modal-row pb-8">
                                <Col span={8}>
                                    <label>User</label>
                                    <Select
                                        size="large"
                                        style={{ width: "100%", height: "62px", }}
                                        className='constituency'
                                        placeholder='Please Search'
                                        id='user_id'
                                        name='users'
                                        onChange={handleUserSelect}
                                        value={selectedUserId}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    >
                                        {usersListData?.data?.map((user) => (
                                            <Select.Option key={user._id} value={user._id} className='capitalize'>
                                                {user.firstName} {user.lastName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>

                                <Col offset={2} span={8}>
                                    <label>Role</label>
                                    <Input className='mt-2'
                                        type='text'
                                        id='role'
                                        name='role' style={{  height: "48px" }}
                                        value={
                                            selectedUserRole.charAt(0).toUpperCase() +
                                            selectedUserRole.slice(1)
                                        }
                                        // onChange={(e) => setSelectedUserRole(e.target.value)}
                                        // required
                                        disabled
                                    />
                                </Col>
                                <Col offset={1} span={2}>
                                    <div
                                        className='mt-10 ml-2 font-bold'
                                        style={{ color: "#2B9FFF" }}
                                    >
                                        <button type='button' onClick={handleAddUser}>
                                            Add
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                            {addedUsers?.length > 0 && (
                                <div className='client-user-table'>
                                    <strong>Added Users</strong>
                                    <table className='user-table mt-2'>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addedUsers?.map((user, index) => (
                                                <tr key={user._id} className='capitalize'>
                                                    <td>
                                                        {user.firstName}
                                                    </td>
                                                    <td>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            type='button'
                                                            onClick={() => handleRemoveUser(index)}
                                                            className='remove-button'
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div></div>
                        </div>
                    </div>

                    <div className="prev-submit-btn flex justify-between pb-4 client-modal-footer">
                        <Button
                            type="button"
                            className="prev-button ml-3"
                            onClick={handlePrevious}
                        >
                            Previous
                        </Button>

                        <button
                            type="submit"
                            className="ant-btn primary-btn mr-3"
                        >
                            {isAddMode ? "Add New Client" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default SelectUserForm