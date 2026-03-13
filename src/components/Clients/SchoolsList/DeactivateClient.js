import React, { useContext } from 'react'
import { Button, Modal } from 'antd'
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import useAxiosInstance from '../../../lib/useAxiosInstance';
import ClientContext from '../../../context/schoolContext';

const DeactivateClient = ({ isStatusModal, editData }) => {

    const clientContext = useContext(ClientContext);

    const axiosInstance = useAxiosInstance();
    const queryClient = useQueryClient();

    const toggleReportStatusMutation = useMutation(
        async () => {
            // Destructure and exclude _id, status, and clientPassword
            const { _id, status, clientPassword, ...otherFields } = editData;

            const updatedClient = {
                ...otherFields,
                status: status === 'deactivate' ? 'active' : 'deactivate',
            };

            const response = await axiosInstance.put(`/api/clients/${_id}`, updatedClient);

            return response.data;
        },
        {
            onSuccess: (data) => {
                handleCancel();
                queryClient.invalidateQueries('clients');
                queryClient.invalidateQueries('allSearchClients');
                // toast.success(`Client ${data.data.status} successfully`);
                const msg = data.data.status === 'deactivate' ? 'deactivated' : 'activated';
                toast.success(`Client ${msg} successfully`);
            },
            onError: (error) => {
                toast.error('An error occurred while updating report status');
            },
        }
    );
    const handleToggleStatus = () => {
        toggleReportStatusMutation.mutate();
    };

    const handleCancel = () => {
        clientContext.updateStatusModal(false);
    };

    return (
        <>

            <Modal open={isStatusModal}
                onSumbit={handleToggleStatus}
                onCancel={handleCancel}
                footer={null}
            >
                <div>
                    {/* <div className='modal-header'>
                        <p>{editData.status === 'active' ? 'Deactivate' : 'Activate'} Client</p>
                    </div> */}
                    <div className='modal-title'>
                        <h3>{editData.status === 'active' ? 'Deactivate' : 'Activate'} Client</h3>
                    </div>
                    <div className='delete-modal-body'>
                        <h6>Are you sure you want to {editData.status === 'active' ? 'deactivate' : 'activate'} this client?</h6>
                    </div>

                    <div className='modal-footer p-4'>
                        <div className='flex justify-end'>
                            <Button className='delete-btn' onClick={handleToggleStatus}>
                                {editData.status === 'active' ? 'Deactivate' : 'Activate'} Client
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    )
};

export default DeactivateClient