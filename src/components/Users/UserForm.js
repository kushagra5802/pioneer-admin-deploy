import React, { useContext } from "react";
import { Modal, Input, Select, Row, Col, Radio } from "antd";
import { EyeInvisibleOutlined,EyeOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import useAxiosInstance from "../../lib/useAxiosInstance";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import UserContext from "../../context/userContext";

const UserForm = ({ isOpen, isAddMode }) => {
  const userContext = useContext(UserContext);

  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const adminUser=JSON.parse(localStorage.getItem("admin-user"));
  
   const showPasswordFields =
    isAddMode || userContext.editData?._id === adminUser?._id;
  
  const FormSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .min(3, "First Name is minimum 3 character")
      .max(50, "First Name is maximum 50 character"),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .min(3, "Last Name is minimum 3 character")
      .max(50, "Last Name is maximum 50 character"),
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Valid email is required")
      .matches(
        "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        "Valid email is required"
      )
      .min(10, "Email is minimum 10 character")
      .max(100, "Email is maximum 100 character"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone must be 10 digit")
      .max(10, "Phone must be 10 digit"),
    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(8, "Password is minimum 8 characters"),
    confirmPassword: Yup.string()
      .trim()
      .required("Please confirm password")
      .oneOf([Yup.ref("password"), null], "Password must match"),
    role: Yup.string().required("Role is required")
  });

  const formik = useFormik({
    initialValues: {
      firstName: isAddMode ? "" : userContext.editData.firstName,
      lastName: isAddMode ? "" : userContext.editData.lastName,
      email: isAddMode ? "" : userContext.editData.email,
      phone: isAddMode ? null : Number(userContext.editData.phone),
      password: isAddMode ? null : userContext.editData.userPassword || "",
      confirmPassword: isAddMode ? null : userContext.editData.userPassword || "",
      role: isAddMode ? null : userContext.editData.role,
      userstatus: isAddMode ? "" : userContext.editData.userstatus,
      createdAt: isAddMode ? "" : userContext.editData.createdAt
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: (values, onSubmitProps) => {
      handleSubmit(values, onSubmitProps);
    }
  });

  const handleSubmit = async (value) => {
    if (isAddMode) {
      handleCreateUser.mutate(value);
    } else {
      handleUpdateUser.mutate(value);
    }
  };

  const handleCreateUser = useMutation(
    (formData) =>
      axiosInstance
        .post(`api/users`, formData)
        .then((response) => response.data),
    {
      onSuccess: (data) => {
        handleSuccess(data);
      },
      onError: (error) => {
        handleError(error);
      }
    }
  );

  const handleUpdateUser = useMutation(
    (formData) =>
      axiosInstance
        .put(`api/users/${userContext.editData._id}`, formData)
        .then((response) => response.data),
    {
      onSuccess: (data) => {
        handleSuccess(data);
      },
      onError: (error) => {
        handleError(error);
      }
    }
  );

  const handleSuccess = (data) => {
    queryClient.invalidateQueries("allUsers");
    closeModal();
    toast.success(`${data?.message}`);
  };

  const handleError = (error) => {
    if (error?.response?.data?.message) {
      let msg = error.response.data.message;
      if (msg.includes("email")) {
        formik.setFieldError("email", msg);
      } else {
        toast.error(error.response.data.message);
        closeModal();
      }
    } else {
      toast.error("Something went wrong.");
      closeModal();
    }
  };

  const closeModal = () => {
    userContext.updateOpenModal(false);
    userContext.updateAddMode(true);
    formik.resetForm();
  };

  return (
    <>
      {isOpen && (
        <Modal
          className='add-user-modal'
          open={isOpen}
          onCancel={closeModal}
          width={1040}
          maskClosable={false}
          footer={[
            <button
              key='add-user'
              form='user-form'
              type='submit'
              className='add-user-btn'
            >
              {isAddMode ? "Add New User" : "Save Changes"}
            </button>
          ]}
        >
          <form id='user-form' onSubmit={formik.handleSubmit}>
            <div className='user-info-modal'>
              <div className='modal-title'>
                <h3>{isAddMode ? "Add New User" : "Edit User"}</h3>
              </div>
              <div className='modal-wrapper-body'>
                <div className='modal-wrapper-content'>
                  <h4>User Information</h4>

                  <Row className='add-modal-row'>
                    <Col span={8} className='mr-6'>
                      <label htmlFor=''>First Name</label>
                      <Input
                        type='text'
                        placeholder='John'
                        name='firstName'
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.firstName && formik.touched.firstName
                        )}
                        message={formik.errors.firstName}
                      />
                    </Col>

                    <Col span={8}>
                      <label htmlFor=''>Last Name</label>
                      <Input
                        type='text'
                        placeholder='Smith'
                        name='lastName'
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.lastName && formik.touched.lastName
                        )}
                        message={formik.errors.lastName}
                      />
                    </Col>
                  </Row>

                  <Row className='add-modal-row'>
                    <Col span={8} className='mr-6'>
                      <label htmlFor=''>Email</label>
                      <Input
                        type='text'
                        placeholder='john.smith@abc.com'
                        name='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.email && formik.touched.email
                        )}
                        message={formik.errors.email}
                      />
                    </Col>

                    <Col span={8}>
                      <label htmlFor=''>Phone</label>
                      <Input
                        type='number'
                        placeholder='1234567890'
                        addonBefore='+91'
                        name='phone'
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.phone && formik.touched.phone
                        )}
                        message={formik.errors.phone}
                      />
                    </Col>
                  </Row>
                  <Row className='add-modal-row client-password'>
                    <Col span={8} className='mr-6'>
                      <label htmfor=''>Password</label>
                      <Input.Password
                        type='password'
                        name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        iconRender={(visible) => {
                        // Disable visibility toggle if editing someone else's account
                        return isAddMode || userContext.editData._id === adminUser._id ? 
                          (visible ? <EyeOutlined />: <EyeInvisibleOutlined />) : 
                          null;
                      }}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.password && formik.touched.password
                        )}
                        message={formik.errors.password}
                      />
                    </Col>
                    <Col span={8} className='mr-6'>
                      <label htmfor=''>Confirm Password</label>
                      <Input.Password
                        type='password'
                        name='confirmPassword'
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        iconRender={(visible) => {
                        return isAddMode || userContext.editData._id === adminUser._id ? 
                          (visible ? <EyeOutlined />: <EyeInvisibleOutlined />) : 
                          null;
                      }}
                      />
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.confirmPassword &&
                            formik.touched.confirmPassword
                        )}
                        message={formik.errors.confirmPassword}
                      />
                    </Col>
                  </Row>

                  <Row className='add-modal-row'>
                    <Col span={8} className='mr-6'>
                      <label>Role</label>
                      <Select 
                        style={{ width: "100%"}}
                        placeholder='Select Role'
                        name='role'
                        onChange={(value) =>
                          formik.setFieldValue("role", value)
                        }
                        value={formik.values.role}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      >
                        <Select.Option value='superadmin'>
                          Super Admin
                        </Select.Option>
                        <Select.Option value='clientManager'>
                          Client Manager
                        </Select.Option>
                        <Select.Option value='admin'>Admin</Select.Option>
                        <Select.Option value='accounts'>
                          Accountant
                        </Select.Option>
                        {/* <Select.Option value='agent'>Agent</Select.Option> */}
                      </Select>
                      <ErrorMessage
                        hasError={Boolean(
                          formik.errors.role && formik.touched.role
                        )}
                        message={formik.errors.role}
                      />
                    </Col>
                  </Row>

                  {!isAddMode && (
                    <Row className='add-user-modal-radio'>
                      <Col>
                        <label className='opacity-60'>Status</label>
                        <Radio.Group
                          className='mt-1 opacity-100'
                          value={formik.values.userstatus}
                          onChange={(e) =>
                            formik.setFieldValue("userstatus", e.target.value)
                          }
                        >
                          <Radio value='active'>Active</Radio>
                          <Radio value='suspended'>Suspended</Radio>
                        </Radio.Group>
                      </Col>
                    </Row>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UserForm;
