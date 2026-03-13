import React, {useContext} from "react";
import "../../styles/users.css";
import {ToastContainer} from "react-toastify";
import {MdAdd} from 'react-icons/md';
import UserContext from '../../context/userContext';
import PageHeading from "../PageHeading";
import UserForm from "./UserForm";
import UserList from "./UserList";

const Result = () => {

    const userContext = useContext(UserContext);

    const handleModal = () => {
        userContext.updateOpenModal(true);
    };

    return (
        <div className="users-section">
            <ToastContainer/>

            <PageHeading
                pageTitle='Users'
                icon={<MdAdd/>}
                pageModalTitle='Add New User'
                pageModalOpen={handleModal}
            />

            <UserForm isOpen={userContext.isOpenModal} isAddMode={userContext.isAddMode}/>

            <UserList/>
        </div>
    );
};

export default Result;