import React, { useState } from "react";
import BasicInformation from "./BasicInformation";
import ReportInfo from "./ReportAssign";
import SurvayAssign from "./SurvayAssign";
import SubscriptionInfo from "./SubscriptionInfo";
import { useParams } from "react-router-dom";
import icon1 from "../../../assets/images/client-icon/Vector (30).png";
import icon2 from "../../../assets/images/client-icon/Vector (31).png";
import icon3 from "../../../assets/images/client-icon/Vector (32).png";
import icon4 from "../../../assets/images/client-icon/Vector (33).png";
import icon5 from "../../../assets/images/client-icon/Group 1290.png";
import icon6 from "../../../assets/images/client-icon/Group 1000001961.png";
import icon7 from "../../../assets/images/client-icon/Vector (34).png";
import rightArrow from "../../../assets/images/client-icon/chevron-right.png";
import { NavLink } from "react-router-dom";
import UsersListModal from "./usersListModal";
import OfficesListModal from "./OfficesListModal";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import { useQuery } from "react-query";

const ClientInfo = () => {
  const params = useParams();
  const clientId = params.clientId;

  const axiosInstance = useAxiosInstance();

  //fetch all client info -->

  const fetchClient = async () => {
    return axiosInstance.get(`api/clients/${clientId}`);
  };
  const singleClientData = useQuery("single_client_data", fetchClient);
  const ClientData = singleClientData?.data?.data?.data;

  // <--

  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("client-info");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "client-info":
        return <BasicInformation ClientData={ClientData} />;
      case "subscription-info":
        return <SubscriptionInfo />;
      case "reports-info":
        return <ReportInfo />;
      case "survay-assigned":
        return <SurvayAssign />;
      default:
        return <BasicInformation />;
    }
  };

  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const showModalUserList = () => {
    setIsOpenUserModal(!isOpenUserModal);
  };

  const [isOpenOfficeModal, setIsOpenOfficeModal] = useState(false);
  const showModalOfficeList = () => {
    setIsOpenOfficeModal(!isOpenOfficeModal);
  };

  return (
    <div className='gms-page-section'>
      <div className='gms-wrapper'>
        <div className='client-breadcrumbs'>
          <p className='flex'>
            <span className='flex'>
              <NavLink to='/client' className='nav-link flex mr-2'>
                Clients <img src={rightArrow} alt='arrow' />
              </NavLink>
            </span>
            <span>
              {`${ClientData?.adminFirstName} ${ClientData?.adminLastName}`}
            </span>
          </p>
        </div>
        <div className='client-info-stats grid grid-cols-7'>
          <div className='client-info-stats-wrapper'>
            <img src={icon1} alt='icon' />
            <h6>-</h6>
            <p>Number of Constituency</p>
          </div>
          <div
            className='client-info-stats-wrapper'
            onClick={() => showModalOfficeList()}
          >
            <img src={icon2} alt='icon' />
            <h6>-</h6>
            <p>Number of offices</p>
          </div>

          <div
            className='client-info-stats-wrapper'
            onClick={() => showModalUserList()}
          >
            <img src={icon3} alt='icon' />
            <h6>-</h6>
            <p>Number of staff</p>
          </div>

          <div className='client-info-stats-wrapper'>
            <img src={icon4} alt='icon' />
            <h6>-</h6>
            <p>Number of grievance</p>
          </div>
          <div className='client-info-stats-wrapper'>
            <img src={icon5} alt='icon' />
            <h6>-</h6>
            <p>Number of Task</p>
          </div>
          <div className='client-info-stats-wrapper'>
            <img src={icon6} alt='icon' />
            <h6>-:-</h6>
            <p>Grievance to task ratio</p>
          </div>
          <div className='client-info-stats-wrapper'>
            <img src={icon7} alt='icon' />
            <h6>-:-</h6>
            <p>Task to staff ratio</p>
          </div>
        </div>

        <div className='tabs1 client-tabs'>
          <div className='gms-table-tabs'>
            <nav className='user-info-tabs'>
              <button
                className={`tab-button tab-btn1 ${
                  activeTab === "client-info" ? "active" : ""
                }`}
                onClick={() => handleTabClick("client-info")}
              >
                Client Info
              </button>
              <button
                className={`tab-button tab-btn2 ${
                  activeTab === "subscription-info" ? "active" : ""
                } `}
                onClick={() => handleTabClick("subscription-info")}
              >
                Subscription Info
              </button>
              <button
                className={`tab-button tab-btn2 ${
                  activeTab === "reports-info" ? "active" : ""
                } `}
                onClick={() => handleTabClick("reports-info")}
              >
                Report Assigned
              </button>
              <button
                className={`tab-button tab-btn2 ${
                  activeTab === "survay-assigned" ? "active" : ""
                } `}
                onClick={() => handleTabClick("survay-assigned")}
              >
                Surveys Assigned
              </button>
            </nav>
          </div>
        </div>
        <div className='tab-content'>{renderTabContent()}</div>
      </div>

      {isOpenUserModal && (
        <UsersListModal
          isOpen={isOpenUserModal}
          setIsOpenUserModal={setIsOpenUserModal}
        />
      )}

      {isOpenOfficeModal && (
        <OfficesListModal
          isOpen={isOpenOfficeModal}
          setIsOpenOfficeModal={setIsOpenOfficeModal}
        />
      )}
    </div>
  );
};

export default ClientInfo;
