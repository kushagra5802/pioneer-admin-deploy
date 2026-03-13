import React, { useContext } from 'react'
import { Table, Space } from 'antd'
// import DeleteModal from '../../DeleteModal';
import { AppContext } from "../../../context/AppContextProvider";
import ClientContext from '../../../context/clientContext';
import RestoreClient from './RestoreClient';

const Column = Table;

const data = [
    {
        key: "1",
        adminFirstName: "Rakesh",
        adminLastName: "Sharma",
        _id: "#CL1234",
        state: "Maharastra",
        planType: "Gold",
        constituencyName: "Malad",
        date: "04/09/2023"
    }
]

const DeletedClientsDataTable = ({ pagination, planList }) => {

    const clientContext = useContext(ClientContext);
    const { isDropdownOpen, handleClick, handleMouseEnter, handleMouseLeave } = useContext(AppContext);

    // const [selectedRecord, setSelectedRecord] = useState(null);
    const showModalRestore = (record) => {
        // setSelectedRecord(record);
        clientContext.updateStatusModal(true);

    };

    return (
        <div className='user-data-table'>
            <Table rowKey={record => record._id}
                dataSource={data}
                className="user-table-inner" pagination={pagination}>
                <Column key="client_name" title="CLIENT NAME" dataIndex="name"
                    render={(text, record) => (
                        <>
                            <span>{`${record.adminFirstName} ${record.adminLastName}`}</span>
                        </>
                    )}
                />

                <Column key="client-id" title="CLIENT ID" dataIndex="_id" />

                <Column key="state" title="State" dataIndex="state"
                // render={(constituency, record, index) => (
                //     <span>{`${record?.constituency[0]?.constituencyName}`}</span>
                // )}
                />

                <Column key="subscription" title="SUBSCRIPTION" dataIndex="planType"
                // render={(text, record) => planList?.data?.data?.data?.find((plan) => plan._id === record.planType)?.name}
                />

                <Column title="CONSTITUENCY" dataIndex="constituencyName"
                // render={(constituency, record, index) => (
                //     <span>
                //         {`${record?.constituency[0]?.constituencyName} ${record.constituency?.length > 1 ? ` +${record.constituency.length - 1}` : ""}`}
                //     </span>
                // )}
                />

                <Column key="start_date" title="START DATE" dataIndex="date" sortDirections={["ascend", "descend"]} className="custom-sorter"
                    // render={(text, record) => (
                    //     <span>
                    //         {new Date(record.validityStart).toLocaleDateString("en-GB")}{" "}
                    //     </span>
                    // )}
                    sorter={(a, b) => new Date(a.validityStart) - new Date(b.validityStart)}
                />

                <Column key="end_date" title="END DATE" dataIndex="date" sortDirections={["ascend", "descend"]} className="custom-sorter"
                    // render={(text, record) => (
                    //     <span>
                    //         {new Date(record.validityEnd).toLocaleDateString("en-GB")}
                    //     </span>
                    // )}
                    sorter={(a, b) => new Date(a.validityStart) - new Date(b.validityStart)}
                />

                <Column title="ACTION" key="action"
                    render={(text, record, index) => (
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

                                        <div
                                            onClick={() => showModalRestore()}
                                        >Restore Client</div>
                                    </div>
                                )}
                            </div>
                        </Space>
                    )}
                />
            </Table>


            {clientContext.isStatusModal && (
                <RestoreClient isOpen={clientContext.isStatusModal}/>
            )}
        </div>
    )
};

export default DeletedClientsDataTable


