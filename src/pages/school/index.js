import React from 'react';
import {SchoolContextProvider} from '../../context/schoolContext';
import Result from "../../components/Clients/Result";

const School = () => {
    return (
        <SchoolContextProvider>
            <Result/>
        </SchoolContextProvider>
    );
};

export default School;