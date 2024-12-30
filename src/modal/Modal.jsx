import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const ModalForm = ({open,close,title,content,mr}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      close(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    close(false);
  };
  return (
      <Modal
        title={title}
        style={{marginTop:mr?mr:0}}
        closeIcon={()=>null}
        width={700}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={false}
      >
        {content}
      </Modal>
  );
};
export default ModalForm;