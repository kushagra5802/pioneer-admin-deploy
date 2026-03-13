import React from "react";
import {Select, Pagination} from "antd";
import DeletedClientsDataTable from "./DeletedClientsDataTable";
import SearchFilter from "../../SearchFilter"



const deletedClientsList = () => {
    return(
        <div className="">
        <SearchFilter/>
        <DeletedClientsDataTable/>
        <div className="report-pagination ">
                <div>
                    <Select 
                    // value={limit.toString()}
                    defaultValue={5}
                     style={{width: 56}}
                            // onChange={(value) => {
                            //     setLimit(parseInt(value));
                            //     setCurrentPage(1);
                            // }}

                            options={[
                                {value: "10", label: "10"},
                                {value: "20", label: "20"},
                                {value: "50", label: "50"},
                                {value: "100", label: "100"},
                            ]}
                    />
                    <span className="pl-2"> Entries per pages</span>
                </div>

                <div className="report-selection">
                    <Pagination className="pagination" 
                    // current={currentPage} 
                    // pageSize={limit} 
                    // total={total}
                    //             onChange={(page, pageSize) => {
                    //                 setCurrentPage(page);
                    //                 setLimit(pageSize);
                    //             }}
                    />
                </div>
            </div>
        </div>
    )
}

export default deletedClientsList;
