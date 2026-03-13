import React from 'react';
import {UserContextProvider} from '../../context/userContext';
import Result from "../../components/Users/Result";

const Users = () => {
    return (
        <UserContextProvider>
            <Result/>
        </UserContextProvider>
    );
};

export default Users;