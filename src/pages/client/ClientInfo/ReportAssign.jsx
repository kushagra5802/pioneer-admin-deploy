import React, { useState } from "react";
import { Table, Select, Pagination } from "antd";
import SearchFilter from "../../../components/SearchFilter";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import moment from 'moment';


const { Column } = Table;


const ReportInfo = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
   // eslint-disable-next-line 
  const [sort, setSort] = useState("DES");
  const { clientId } = useParams();
  const axiosInstance = useAxiosInstance();

      // FOR PAGINATION
      const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setLimit(pageSize);
    };

    const pagination = {
        total: total * limit,
        pageSize: limit,
        current: currentPage,
        onChange: handlePageChange,
    };



    const ReportsByClientId = async () => {
      const response = await axiosInstance.get(
          `api/reports/client/getReportClientId/${clientId}?page=${currentPage}&limit=${limit}&sort=${sort}`,
      );
      setTotal(response.data.totalpages)
      return response
  };
  const reportsData = useQuery(["client_report_list", currentPage, limit, sort], () =>
  ReportsByClientId(currentPage, limit, sort)
  );

  const reportDataList = reportsData?.data?.data?.data;
    
  return (
    <>
      <div className="gms-page-section table-wrapper-content">
        <div className="gms-table-wrapper">
          <SearchFilter />

          <div className="gms-client-table1">
            <Table
              rowKey={(record) => record.key}
              className="gms-table-rows"
              pagination={pagination}
              dataSource={reportDataList }
            >
              <Column
                title="REPORT NAME"
                dataIndex="reportName"
               
              />
              <Column title="DESCRIPTION" dataIndex="reportDescription" />

              <Column title="UPLOAD BY" dataIndex="uploaderName" />
              <Column title="UPLOAD DATE" dataIndex="createdAt" 
                  render={(createdAt) => moment(createdAt).format('DD/MM/YYYY')}

              />
            </Table>
          </div>
          <div className="report-pagination">
            <div>
              <span>Showing</span>
              <Select
                defaultValue={10}
                value={limit.toString()}
                style={{ width: 56 }}
                onChange={(value) => setLimit(parseInt(value))}
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
              />{" "}
              <span className="px-4"> of 50</span>
            </div>
            <div className="report-selection">
              <Pagination
                current={currentPage}
                pageSize={limit}
                total={total * limit}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setLimit(pageSize);
                }}
                className="pagination"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportInfo;
