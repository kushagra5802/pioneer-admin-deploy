import React from 'react'
import { Input, Select, Row, Col, Button } from "antd";
import ErrorMessage from "../../Forms/ErrorMessage";
import stateCityMapping from '../../../assets/data/Indian_Cities_In_States.json'
const { TextArea } = Input;

const MainOfficeForm = ({ formik2, isAddMode, handlePrevious }) => {

    // Define state and city options based on the stateCityMapping
    const stateOptions = Object.keys(stateCityMapping)
        .map((officeState) => ({
            value: officeState,
            label: officeState,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const cityOptions = formik2.values.headOffice.officeState
        ? stateCityMapping[formik2.values.headOffice.officeState]?.map((city) => ({
            value: city,
            label: city,
        }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [];
    return (
        <>
            <form onSubmit={formik2.handleSubmit}>
                <div className="client-info">
                    <div className="modal-title">
                        <h3>{isAddMode ? "Add New Client" : "Edit Client"}</h3>
                    </div>
                    <div className="modal-wrapper-body">
                        <div className="modal-wrapper-content">
                            <h4>Main Office Address</h4>
                            <Row className="add-modal-row">
                                <Col span={8} className="mr-8">
                                    <label>State</label>
                                    <Select
                                        size='large'
                                        id='officeState'
                                        placeholder='Please Select'
                                        style={{ width: '100%', height: "60px" }}
                                        name='headOffice.officeState'
                                        value={formik2.values.headOffice.officeState}
                                        onChange={(value) => {
                                            // Clear city value when state changes
                                            formik2.setFieldValue('headOffice.officeCity', '');
                                            formik2.setFieldValue('headOffice.officeState', value);
                                        }}
                                        options={stateOptions}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    />
                                    <ErrorMessage
                                        hasError={Boolean(formik2.errors.headOffice && formik2.touched.headOffice && formik2.errors.headOffice.officeState)}
                                        message={formik2.errors.headOffice && formik2.errors.headOffice.officeState}
                                    />
                                </Col>
                                <Col span={8}>
                                    <label>City</label>
                                    <Select
                                        size="large"
                                        id="city"
                                        placeholder="Please Select"
                                        style={{ width: '100%', height: "60px" }}
                                        name="headOffice.officeCity"
                                        value={formik2.values.headOffice.officeCity}
                                        onChange={(value) => formik2.setFieldValue('headOffice.officeCity', value)}
                                        options={cityOptions}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    />
                                    <ErrorMessage
                                        hasError={Boolean(formik2.errors.headOffice && formik2.touched.headOffice && formik2.errors.headOffice.officeCity)}
                                        message={formik2.errors.headOffice && formik2.errors.headOffice.officeCity}
                                    />
                                </Col>
                            </Row>
                            <Row className='add-modal-row py-7'>
                                <Col span={8}>
                                    <label htmlFor=''>Office Name</label>
                                    <Input
                                        style={{ width: "100%", height: "48px" }}
                                        size='large'
                                        className='officeName'
                                        placeholder='Select Office Name'
                                        name='headOffice.officeName'
                                        value={formik2.values.headOffice.officeName}
                                        onChange={(e) => formik2.setFieldValue('headOffice.officeName', e.target.value)}
                                    />
                                    <ErrorMessage
                                        hasError={Boolean(formik2.errors.headOffice && formik2.touched.headOffice && formik2.errors.headOffice.officeName)}
                                        message={formik2.errors.headOffice && formik2.errors.headOffice.officeName}
                                    />
                                </Col>
                            </Row>
                            <Row className="add-modal-row">
                                <Col span={17}>
                                    <label>Address</label>
                                    <TextArea
                                        rows={2}
                                        style={{ marginTop: "10px", width: "100%" }}
                                        id="address"
                                        name="headOffice.location"
                                        onChange={(e) => {
                                            formik2.handleChange(e);
                                            const newLocation = {
                                                ...formik2.values.headOffice,
                                                location: e.target.value,
                                            };
                                            formik2.setFieldValue("headOffice", newLocation);

                                        }}
                                        value={formik2.values.headOffice.location}
                                    />
                                    <ErrorMessage
                                        hasError={Boolean(formik2.errors.headOffice && formik2.touched.headOffice && formik2.errors.headOffice.location)}
                                        message={formik2.errors.headOffice && formik2.errors.headOffice.location}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className="prev-submit-btn flex justify-between pb-4 client-modal-footer">
                        <Button
                            type='submit'
                            className="prev-button ml-3"
                            onClick={handlePrevious}
                        >
                            Previous
                        </Button>

                        <button
                            type="submit"
                            className="ant-btn primary-btn mr-3"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default MainOfficeForm