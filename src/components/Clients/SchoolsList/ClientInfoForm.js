import React, { useEffect, useMemo, useState } from "react";
import { Input, Select, Row, Col, Radio, Switch } from "antd";
import ErrorMessage from "../../Forms/ErrorMessage";
import { useQuery, useQueryClient } from "react-query";
import stateDistrictMapping from "../../../assets/data/Indian_district_State.json";
import useAxiosInstance from "../../../lib/useAxiosInstance";

import statePCMapping from "../../../assets/data/state_pc_mapping.json"
const { Option } = Select;


const ClientInfoForm = ({
  formik1,
  isAddMode,
  constituencyStates,
  setConstituencyStates,
  pcName,
  setPcName,
  constituencyDistricts,
  setConstituencyDistricts,
  constituencyName,
  categories
}) => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const planListQuery = queryClient.getQueryData("plan-list");
  const [radioValue, setRadioValue] = useState(1);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [parliamentData,setParliamentData]=useState([]);

  const activeTab = radioValue === 1 ? "assembly" : "parliamentary";


  const pcOptions = constituencyStates
    ? (statePCMapping[constituencyStates] || []).map((pc) => ({
        value: pc,
        label: pc
      }))
    : [];
  // subscription date
  const handleDateChange = (event) => {
    const formattedDate = event.target.value;
    formik1.setFieldValue("validityStart", formattedDate);
  };
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };
  // const fetchConstituencyByState = async (state, district) => {
  //   return axiosInstance.get(
  //     `api/constituency/getAllConstituency?state=${state}&district=${district}`
  //   );
  // };
  const fetchParliament = async (state, pcName) => {
    try {
      if(state!=='' && pcName!=='')
      {
        const response = await axiosInstance.get(`/api/parliment/getParliamentByStateAndName?state=${state}&name=${pcName}`);
        return response.data;
      } 
      return;
      
    } catch (error) {
      console.error('Error fetching parliamentary data:', error);
      return null;
    }
  };
  const fetchConstituencyByState = async (state, district,constituencyName,activeTab) => {
    
    return axiosInstance.get(
        `api/constituency/getAllConstituency?state=${state}&district=${district}`
      );
    
  };
  const constituencyByState = useQuery(
    [
      "addClient-constituency-ByState",
      constituencyStates,
      constituencyDistricts,
      constituencyName,
      // pcName,
      activeTab
    ],
    () =>
      fetchConstituencyByState(
        formik1.values.constituencyState,
        formik1.values.constituencyDistrict,
        formik1.values.constituencyName,
        activeTab
      ),
    {
    enabled: formik1.values.constituencyState !== "",
    refetchOnWindowFocus: false
    }
  );

  const parliamentaryData=useQuery(
    [
      "addClient-parliamentary",
      constituencyStates,
      pcName,
      activeTab
    ],
    ()=>
      fetchParliament(
        formik1.values.constituencyState,
        pcName
      ),
      {
        enabled: formik1.values.constituencyState !== "",
        refetchOnWindowFocus: false
      }
  );
  useEffect(() => {
    const selected = parliamentaryData?.data?.data?.[0];
    if (selected) {
      const existing = formik1.values.constituency?.[0];
  
      // Avoid unnecessary updates
      if (
        !existing ||
        existing.constituencyId !== selected._id
      ) {
        formik1.setFieldValue("constituency", [{
          constituencyId: selected._id,
          constituencyName: selected.name,
          constituencyState: selected.state,
          constituencyDistrict: selected.district,
          constituencyType: selected.type,
        }]);
      }
    }
  }, [parliamentaryData]);
  
  // Define state and district options based on the stateDistrictMapping
  const stateConstituencyOptions = Object.keys(stateDistrictMapping).map(
    (constituencyState) => ({
      value: constituencyState,
      label: constituencyState
    })
  );

  const selectedStateTitleCase = formik1.values.constituencyState;
  
  const districtsForSelectedState =
    stateDistrictMapping[selectedStateTitleCase];

  // Updated districtOptions based on the converted selected state
  const districtOptions = districtsForSelectedState
    ? districtsForSelectedState?.map((constituencyDistrict) => ({
      value: constituencyDistrict,
      label: constituencyDistrict
    }))
    : [];

  const handleChange = (value, name) => {
    formik1.setFieldValue(name, value);
    if (name === "constituencyDistrict") {
      formik1.setFieldValue("constituencyName", "");
      setConstituencyDistricts(value);
      fetchConstituencyByState(value);
    }
    if (name === "constituencyState") {
      formik1.setFieldValue("constituencyName", "");
      formik1.setFieldValue("constituencyDistrict", "");
      formik1.setFieldValue("pcName", "");
      setPcName("")
      setConstituencyStates(value);
      // setPcName(value);
      fetchConstituencyByState(value);
    }
    if(name==='pcName')
    {
      setPcName(value);
    }
  };



  // Memoized and filtered state options
  const filteredStateOptions = useMemo(() => {
    return stateConstituencyOptions.filter((state) =>
      state.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );
  }, [stateConstituencyOptions, stateSearchTerm]);

  const filteredDistrictOptions = useMemo(() => {
    return districtOptions.filter((district) =>
      district.label.toLowerCase().includes(districtSearchTerm.toLowerCase())
    );
  }, [districtOptions, districtSearchTerm]);

  const filteredHomeConstituencyOptions = useMemo(() => {
    return stateConstituencyOptions.filter((state) =>
      state.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );
  }, [stateConstituencyOptions, stateSearchTerm]);

  return (
    <>
      <form onSubmit={formik1.handleSubmit}>
        <div className='client-info modal-body-container'>
          <div className='modal-title'>
            <h3>{isAddMode ? "Add New Client" : "Edit Client"}</h3>
          </div>

          <div className='modal-wrapper-body'>
            <div className='modal-wrapper-content'>
              <h4>Client Information</h4>

              <Row className='add-modal-row'>
                <Col span={8} className='mr-6'>
                  <label htmlFor=''>First Name</label>
                  <Input.Group compact className='client-first-name'>
                    <Select
                      placeholder='Mr.'
                      style={{ width: "25%" }}
                      onChange={(value) =>
                        formik1.setFieldValue("prefix", value)
                      }
                      value={formik1.values.prefix || undefined}
                    >
                      <Option value='Mr.'>Mr.</Option>
                      <Option value='Mrs.'>Mrs.</Option>
                      <Option value='Ms.'>Ms.</Option>
                    </Select>
                    <Input
                      type='text'
                      placeholder='John'
                      name='adminFirstName'
                      onChange={formik1.handleChange}
                      value={formik1.values.adminFirstName}
                    />
                  </Input.Group>
                  <ErrorMessage
                    hasError={Boolean(
                      (formik1.errors.adminFirstName &&
                        formik1.touched.adminFirstName) ||
                      (formik1.errors.prefix && formik1.touched.prefix)
                    )}
                    message={
                      formik1.errors.adminFirstName || formik1.errors.prefix
                    }
                  />
                </Col>

                <Col span={8}>
                  <label htmlFor=''>Last Name</label>
                  <Input
                    type='text'
                    placeholder='Smith'
                    name='adminLastName'
                    onChange={formik1.handleChange}
                    value={formik1.values.adminLastName}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.adminLastName &&
                      formik1.touched.adminLastName
                    )}
                    message={formik1.errors.adminLastName}
                  />
                </Col>
              </Row>

              <Row className='add-modal-row'>
                <Col span={8} className='mr-6'>
                  <label htmlFor=''>Email</label>
                  <Input
                    type='text'
                    placeholder='john.smith@abc.com'
                    name='adminEmail'
                    onChange={formik1.handleChange}
                    value={formik1.values.adminEmail}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.adminEmail && formik1.touched.adminEmail
                    )}
                    message={formik1.errors.adminEmail}
                  />
                </Col>

                <Col span={8} className='phone-input'>
                  <label htmlFor=''>Phone</label>
                  <Input
                    type='number'
                    placeholder='1234567890'
                    addonBefore='+91'
                    name='adminContact'
                    onChange={formik1.handleChange}
                    value={formik1.values.adminContact}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.adminContact &&
                      formik1.touched.adminContact
                    )}
                    message={formik1.errors.adminContact}
                  />
                </Col>
              </Row>

              <Row className='add-modal-row'>
                <Col span={8} className='mr-6 pb-1 planType'>
                  <label>Select Plan</label>
                  <Select
                    id='subscription'
                    placeholder='Please Select'
                    style={{ width: "100%" }}
                    size='large'
                    name='planType'
                    value={formik1.values.planType.map((item) => item.name)}
                    onChange={(value) => {
                      const formattedValue = value.map((name, index) => ({
                        _id: planListQuery?.data?.data[index]._id,
                        name: name
                      }));
                      formik1.setFieldValue("planType", formattedValue);
                    }}
                    showSearch={false}
                    mode='multiple'
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {planListQuery?.data?.data?.map((plan) => (
                      <Select.Option key={plan._id} value={plan.name}>
                        {plan.name}
                      </Select.Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.planType && formik1.touched.planType
                    )}
                    message={formik1.errors.planType}
                  />
                </Col>

                <Col span={8} className='planDuration'>
                  <label>Plan Duration</label>
                  <Select
                    style={{ width: "100%", height: "48px" }}
                    placeholder='Please Select'
                    name='planDuration'
                    onChange={(value) =>
                      formik1.setFieldValue("planDuration", value)
                    }
                    value={formik1.values.planDuration}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value='quarterly'>Quarterly</Select.Option>
                    <Select.Option value='yearly'>Yearly</Select.Option>
                    <Select.Option value='half_yearly'>
                      Half-Yearly{" "}
                    </Select.Option>
                  </Select>
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.planDuration &&
                      formik1.touched.planDuration
                    )}
                    message={formik1.errors.planDuration}
                  />
                </Col>
              </Row>
              <Row className='add-modal-row'>
                <Col span={8} className='client-start-date mr-6'>
                  <label>Plan Start Date</label>
                  <Input
                    type='date'
                    placeholder='Select Date'
                    name='validityStart'
                    onChange={handleDateChange}
                    value={formik1.values.validityStart}
                  // min={new Date().toISOString().split('T')[0]}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.validityStart &&
                      formik1.touched.validityStart
                    )}
                    message={formik1.errors.validityStart}
                  />
                </Col>

                <Col span={8} className='plan-amt'>
                  <label>Plan Amount</label>
                  <Input
                    placeholder='₹'
                    className='indent-3'
                    name='planAmount'
                    type='number'
                    value={formik1.values.planAmount}
                    onChange={formik1.handleChange}
                  />
                  {formik1.values.planAmount && (
                    <span className='absolute  left-3'>₹</span>
                  )}
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.planAmount && formik1.touched.planAmount
                    )}
                    message={formik1.errors.planAmount}
                  />
                </Col>
              </Row>

              <Row className='add-modal-row client-password'>
                <Col span={8} className='mr-6'>
                  <label>Password</label>
                  <Input.Password
                    type='password'
                    name='password'
                    id='password'
                    onChange={formik1.handleChange}
                    value={formik1.values.password}
                  />

                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.password && formik1.touched.password
                    )}
                    message={formik1.errors.password}
                  />
                </Col>
                <Col span={8}>
                  <label>Confirm Password</label>
                  <Input.Password
                    type='password'
                    name='confirmpass'
                    value={formik1.values.confirmpass}
                    id='confirmpass'
                    onChange={formik1.handleChange}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.confirmpass && formik1.touched.confirmpass
                    )}
                    message={formik1.errors.confirmpass}
                  />
                </Col>
              </Row>

              <h4>Constituency</h4>
              <Row className='add-user-modal-radio  mb-5'>
                <Col>
                  <label className='opacity-60 mb-2'>Type</label>
                  <Radio.Group
                    className='radio'
                    value={radioValue}
                    onChange={handleRadioChange}
                  >
                    <Radio value={1}>Assembly</Radio>
                    <Radio value={2}>
                      Parliamentary
                    </Radio>
                    {/* <Radio value={2} disabled>
                      Parliamentary
                    </Radio> */}
                  </Radio.Group>
                </Col>
              </Row>

              <Row className='add-user-modal-radio mb-5'>
                <Col span={8} className='mr-7'>
                  <label className='inline-block'>Select State</label>
                  <Select
                    className='capitalize'
                    id='constituencyState'
                    placeholder='Please Select'
                    size='large'
                    style={{ width: "100%", height: "60px" }}
                    name='constituencyState'
                    value={formik1.values.constituencyState}
                    onChange={(value) => {
                      handleChange(value, "constituencyState");
                      // Reset search term after selection
                      setStateSearchTerm("");
                    }}
                    options={filteredStateOptions}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik1.errors.constituencyState &&
                      formik1.touched.constituencyState
                    )}
                    message={formik1.errors.constituencyState}
                  />
                </Col>
                {activeTab==='assembly' && (
                   <Col span={8} className=''>
                   <label>District</label>
                   <Select
                     className='capitalize'
                     size='large'
                     style={{ width: "100%", height: "60px" }}
                     // showSearch
                     id='constituency_district'
                     placeholder='Please Select'
                     name='constituencyDistrict'
                     value={formik1.values.constituencyDistrict}
                     onChange={(value) => {
                       handleChange(value, "constituencyDistrict");
                       setDistrictSearchTerm("");
                     }}
                     options={filteredDistrictOptions}
                     disabled={!formik1.values.constituencyState}
                     getPopupContainer={(triggerNode) => triggerNode.parentNode}
                     showSearch
                     filterOption={(input, option) =>
                       option.label.toLowerCase().includes(input.toLowerCase())
                     }
                   />
                   <ErrorMessage
                     hasError={Boolean(
                       formik1.errors.constituencyDistrict &&
                       formik1.touched.constituencyDistrict
                     )}
                     message={formik1.errors.constituencyDistrict}
                   />
                 </Col>
                )}   
                  {activeTab==='parliamentary' && (
                   <Col span={8} className=''>
                   <label>Parliamentary</label>
                   <Select
                    className='capitalize'
                    size='large'
                    style={{ width: "100%", height: "60px" }}
                    id='pc_name'
                    showSearch
                    placeholder='Please Select'
                     name='pcName'
                     value={pcName}
                     onChange={(value) => handleChange(value, "pcName")}
                    disabled={!constituencyStates|| !pcOptions.length}
                    options={pcOptions}
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                   />
                   {/* <ErrorMessage
                     hasError={Boolean(
                       formik1.errors.pcName &&
                       formik1.touched.pcName
                     )}
                     message={formik1.errors.pcName}
                   /> */}
                 </Col>
                )}    

              </Row>

              <Row className='add-user-modal-radio mb-0'>
                {activeTab==='assembly'&&(
                <div className="flex justify-center items-center gap-4 w-full">
                  <Col span={8}>
                    <label htmlFor=''>Select Home Constituency</label>
                    <Select
                      size='large'
                      style={{ width: "100%", height: "60px" }}
                      className='constituency'
                      placeholder='Select Constituency'
                      defaultValue='Select Constituency'
                      name='constituencyName'
                      value={
                        formik1.values.constituency.length > 0
                          ? formik1.values.constituencyName
                          : ""
                      }
                      showSearch
                      optionFilterProp='value'
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(value) => {
                        const selectedConstituency =
                          constituencyByState.data.data.data.find(
                            (constituency) => constituency._id === value
                          );
                        formik1.setFieldValue("constituency", [
                          selectedConstituency
                            ? {
                              constituencyId: selectedConstituency._id,
                              constituencyName: selectedConstituency.name,
                              constituencyState: selectedConstituency.state,
                              constituencyDistrict:
                                selectedConstituency.district,
                              constituencyType: selectedConstituency.type
                            }
                            : {}
                        ]);
                        formik1.setFieldValue("constituencyName", value);
                      }}
                      disabled={
                        !formik1.values.constituencyState ||
                        !formik1.values.constituencyDistrict ||
                        !constituencyByState?.data?.data?.data.length
                      }
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      {constituencyByState?.data?.data?.data?.map(
                        (constituency) => (
                          <Select.Option
                            key={constituency._id}
                            value={constituency._id}
                          >
                            {constituency.name}
                          </Select.Option>
                        )
                      )}
                    </Select>
                    <ErrorMessage
                      hasError={Boolean(
                        formik1.errors.constituencyName &&
                        formik1.touched.constituencyName
                      )}
                      message={formik1.errors.constituencyName}
                    />
                  </Col>
                  <Col span={8} className="ml-2">
                    {/* <label>Give Auto Assign Access</label> */}
                    <br />
                   <Input.Group compact>
                    <label style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="urbanRural"
                        value="Rural"
                        checked={formik1.values.urbanRural === "Rural"}
                        onChange={() => formik1.setFieldValue("urbanRural", "Rural")}
                      />{" "}
                      Rural
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="urbanRural"
                        value="Urban"
                        checked={formik1.values.urbanRural === "Urban"}
                        onChange={() => formik1.setFieldValue("urbanRural", "Urban")}
                      />{" "}
                      Urban
                    </label>
                   </Input.Group>
                </Col>
                </div>
                )
                }
              </Row>
              {/* {activeTab==='assembly'&& <Row className="add-user-modal-radio mb-7">
                <Col span={8} className="ml-2">
                    <br />
                   <Input.Group compact>
                    <label style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="urbanRural"
                        value="Rural"
                        checked={formik1.values.urbanRural === "Rural"}
                        onChange={() => formik1.setFieldValue("urbanRural", "Rural")}
                      />{" "}
                      Rural
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="urbanRural"
                        value="Urban"
                        checked={formik1.values.urbanRural === "Urban"}
                        onChange={() => formik1.setFieldValue("urbanRural", "Urban")}
                      />{" "}
                      Urban
                    </label>
                   </Input.Group>
                </Col>
              </Row>} */}

              <h4>Categories</h4>
              <Row className="add-user-modal-radio  mb-7">
                <Col span={8} className="planType mr-6 pb-1">
                  <label>Select Categories</label>
                  <Select
                    size="large"
                    mode="multiple"
                    style={{ width: "100%"}}
                    allowClear
                    placeholder="Select categories"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={formik1.values.categoryIds}
                    onChange={(value) => formik1.setFieldValue("categoryIds", value)}
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat._id,
                    }))}
                  />
                  {formik1.errors.categoryIds && formik1.touched.categoryIds && (
                    <div className="error">{formik1.errors.categoryIds}</div>
                  )}
                </Col>
                <Col span={8} className="ml-8">
                    <label>Give Auto Assign Access</label>
                    <br />
                   <Input.Group compact>
                    <label style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="autoAssignAccess"
                        value="true"
                        checked={formik1.values.autoAssignAccess === true}
                        onChange={() => formik1.setFieldValue("autoAssignAccess", true)}
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="autoAssignAccess"
                        value="false"
                        checked={formik1.values.autoAssignAccess === false}
                        onChange={() => formik1.setFieldValue("autoAssignAccess", false)}
                      />{" "}
                      No
                    </label>
                   </Input.Group>
                </Col>
                <Col span={8} className="ml-8">
                    <label>Allow Medical Camp Form</label>
                    <br />
                   <Input.Group compact>
                    <label style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="medicalCamp"
                        value="true"
                        checked={formik1.values.medicalCamp === true}
                        onChange={() => formik1.setFieldValue("medicalCamp", true)}
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="medicalCamp"
                        value="false"
                        checked={formik1.values.medicalCamp === false}
                        onChange={() => formik1.setFieldValue("medicalCamp", false)}
                      />{" "}
                      No
                    </label>
                   </Input.Group>
                </Col>
                <Col span={8} className="ml-8">
                    <label>Allow Gms Analytics</label>
                    <br />
                   <Input.Group compact>
                    <label style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="gmsAnalytics"
                        value="true"
                        checked={formik1.values.gmsAnalytics === true}
                        onChange={() => formik1.setFieldValue("gmsAnalytics", true)}
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gmsAnalytics"
                        value="false"
                        checked={formik1.values.gmsAnalytics === false}
                        onChange={() => formik1.setFieldValue("gmsAnalytics", false)}
                      />{" "}
                      No
                    </label>
                   </Input.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div className='flex justify-end client-modal-footer'>
            <button type='submit' className='ant-btn primary-btn mr-3'>
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ClientInfoForm;
