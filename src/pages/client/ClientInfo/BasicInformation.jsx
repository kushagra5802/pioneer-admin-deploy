import React from "react";
import "../../../styles/BasicInformation.css";
// import { useParams } from "react-router-dom";

const BasicInformation = ({ ClientData }) => {
  // const { clientId } = useParams();


  // background color change on status

  const getStatusClass = () => {
    if (ClientData?.status === "active") {
      return "active-status";
    } else if (ClientData?.status === "inactive") {
      return "inactive-status";
    }
  };

  return (
    <div>
      <div className="client-details grid grid-cols-1 gap-4">
        <div className="cllient-details-section">
          <div className="tab-heading">
            <div className="flex client-info-heading">
              <h4>Client Information</h4>
              <h6 className={getStatusClass()}>{ClientData?.status}</h6>
            </div>
          </div>

          <div className="basicInfoDiv">
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <div className="firstname-field">
                  <p>
                    <span>First Name</span>
                    <span style={{ fontWeight: "bold" }}>
                      {ClientData?.adminFirstName}
                    </span>
                  </p>
                  <p>
                    <span>Last Name</span>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {ClientData?.adminLastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="firstname-field">
                  <p>
                    <span>Email</span>
                    <span>{ClientData?.adminEmail}</span>
                  </p>
                  <p>
                    <span>Phone</span>
                    <span>{ClientData?.adminContact}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="tab-heading">
            <p>Main Office</p>
          </div>

          <div className="basicInfoDiv">
            <div className="grid grid-cols-5">
              <div className="firstname-field col-span-2">
                <p>
                  <span>City</span>
                  <span>{ClientData?.headOffice?.officeCity || '-'}</span>
                </p>
                <p>
                  <span>State</span>
                  <span>{ClientData?.headOffice?.officeState || '-'}</span>
                </p>
              </div>

              <div className="firstname-field col-span-2">
                <p>
                  <span>Address </span>
                  <span> {ClientData?.headOffice.location}</span>
                </p>

              </div>



            </div>
          </div>



          <div className="tab-heading">
            <p>Home Constituency</p>
          </div>

          <div className="basicInfoDiv">
            <div className="grid grid-cols-5">
              <div className="firstname-field col-span-2">
                <p>
                  <span>Name</span>
                  <span>
                    {
                      ClientData?.constituency[0]
                        ?.constituencyName
                    }
                  </span>
                </p>
                <p>
                  <span>Type</span>
                  <span>
                    {
                      ClientData?.constituency[0]
                        ?.constituencyType
                    }
                  </span>
                </p>
              </div>
              <div className="firstname-field col-span-2">
                <p>
                  <span>State</span>
                  <span>
                    {
                      ClientData?.constituency[0]
                        ?.constituencyState
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
};
export default BasicInformation;
