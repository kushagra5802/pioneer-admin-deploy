import React from 'react';
import {ClientContextProvider} from '../../context/clientContext';
import Result from "../../components/Clients/Result";

const Client = () => {
    return (
        <ClientContextProvider>
            <Result/>
        </ClientContextProvider>
    );
};

export default Client;