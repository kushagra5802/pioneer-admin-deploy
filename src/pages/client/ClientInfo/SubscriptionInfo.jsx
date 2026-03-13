import React from "react";
import { Table, Select, Pagination } from "antd";
import SearchFilter from "../../../components/SearchFilter";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import moment from "moment";

const { Column } = Table;

const Data = [
  // {
  //   key: "1",
  //   name: "John Brown",
  //   subscription: "Custom",
  //   amt: "₹" + parseFloat(4299),
  //   date: "12/10/2022",
  // },
];

const SubscriptionInfo = () => {
  const { clientId } = useParams();

  const axiosInstance = useAxiosInstance();

  //fetch all client list -->
  const fetchClientInfo = async () => {
    return axiosInstance.get(`api/clients/${clientId}`);
  };
  const ClientInfoData = useQuery("single_client_info", fetchClientInfo);
  const ClientInfo = ClientInfoData?.data?.data?.data;

  // const planTypeColors = {
  //   custom: "#ffb703", // Custom color
  // };

  // const planType = ClientInfo?.planType[0].name;
  // const backgroundColor = planTypeColors[planType] || "#ffb703";

  return (
    <>
      <div className='gms-page-section'>
        <div className='gms-table-wrapper'>
          <div className='client-details '>
            <div className='tab-heading'>
              <div className='flex client-info-heading1'>
                <h4>Current Subscription </h4>
                {/* <h6 className="subscription-tag" style={{ backgroundColor }}>{ClientInfo?.planType[0].name}</h6> */}
                {ClientInfo?.planType.map((plan, index) => (
                  <h6
                    key={index}
                    className='subscription-tag'
                    style={{ backgroundColor: plan.backgroundColor }}
                  >
                    {plan.name}
                  </h6>
                ))}
              </div>
            </div>
            <div className='cllient-details-section1 grid grid-cols-5 '>
              <div className='basicInfoDiv col-span-2'>
                <div className='firstname-field'>
                  <p>
                    <span>Amount</span>
                    <span>₹{ClientInfo?.planAmount}</span>
                  </p>
                  <p>
                    <span>Start Date</span>

                    <span>
                      {moment(ClientInfo?.validityStart).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </div>

              <div className='basicInfoDiv col-span-3'>
                <div className='firstname-field'>
                  <p>
                    <span>Total amount paid</span>
                    <span>₹</span>
                  </p>
                  <p>
                    <span>End Date</span>
                    <span>
                      {moment(ClientInfo?.validityEnd).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div className='tab-heading tab-heading1'>
            <h4 className='ml-4'>Transactions</h4>
          </div>
          <div className=" table-wrapper-content">
            <SearchFilter />

            <div className='gms-client-table'>
              <Table
                rowKey={(record) => record.key}
                className='gms-table-rows'
                // pagination={pagination}
                dataSource={Data}
              >
                <Column title='SUBSCRIPTION' dataIndex='subscription' />
                <Column key='state' title='Amount Due' dataIndex='amt' />

                <Column title='Due DATE' dataIndex='date' />

                <Column key='amt' title='Amount received' dataIndex='amt' />

                <Column title='DATE' dataIndex='date' />
              </Table>
            </div>
            <div className='report-pagination'>
              <div>
                <span>Showing</span>
                <Select
                  // value={limit.toString()}
                  defaultValue={10}
                  style={{ width: 56 }}
                  // onChange={(value) => setLimit(parseInt(value))}
                  options={[
                    // { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" }
                  ]}
                />
                <span className='px-4'> of 50</span>
              </div>
              <div className='report-selection'>
                <Pagination
                  // current={currentPage}
                  // pageSize={limit}
                  // total={total * limit}
                  // onChange={(page, pageSize) => {
                  //   setCurrentPage(page);
                  //   setLimit(pageSize);
                  // }}
                  className='pagination'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionInfo;
