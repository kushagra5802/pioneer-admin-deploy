import React,{useContext} from 'react'
import { Button, Checkbox, Modal } from 'antd'
import ClientContext from '../../../context/clientContext';

const RestoreClient = ({ isOpen}) => {

    const clientContext = useContext(ClientContext);



    const handleCancel = () => {
        clientContext.updateStatusModal(false);
    };

    return (
        <>
                    {isOpen && (


            <Modal
                 open={isOpen}        
            //    onSumbit={handleToggleStatus}
                onCancel={handleCancel}
                footer={null}
            >
                <div>
                    <div className='modal-header'>
                        <p>Restore Client</p>
                    </div>
                    <div className='delete-modal-body'>
                        <h6>Are you sure you want to restore this deleted client?</h6>
                    </div>

                    <div className='modal-footer p-4'>
                        <div className='flex justify-between'>
                            <Checkbox className='pt2'><p className='checkbox-text'>Don’t show this again.</p></Checkbox>
                            <Button className='delete-btn' 
                            // onClick={handleToggleStatus}
                            >
                                Restore Client
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
                    )}

        </>
    )
};

export default RestoreClient