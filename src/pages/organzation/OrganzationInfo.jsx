import {Button, Descriptions, Image, Tooltip} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import {MdReport } from 'react-icons/md';
import ModalForm from '../../modal/Modal';
import { AlertContext } from '../../context/AlertContext';
import { BACKENDURL } from '../../helper/Urls';
import axios from 'axios';
import EditCompanyInfo from '../../components/forms/organzation/EditCompanyInfo';

const OrganzationInfo = () => {

  const {openNotification} = useContext(AlertContext);
  const [businessDetail, setbusinessDetail] = useState ([]);
  const [loadingbusinessDetail, setLoadingbusinessDetail] = useState (false);

  const getbusinessDetail = async () => {
    setLoadingbusinessDetail (true);
    try {
      const res = await axios.get (
        `${BACKENDURL}/organzation/business/info`
      );
      setLoadingbusinessDetail (false);
      setbusinessDetail (res.data.info);
    } catch (error) {
      openNotification ('error', error.response.data.message, 3, 'red');
      setLoadingbusinessDetail (false);
    }
  };

  useEffect (() => {
    getbusinessDetail ();
  }, []);


      const businessInfoData = [
        {key: '1',label: 'Company Name',children:<>{!businessDetail?'':businessDetail.name}</>,span:3,name: 'name',type: 'Input',width: '100%',},
        {key: '2',label: 'Phone',children:<>{!businessDetail?'':businessDetail.phone}</>,span:3,name: 'phone',type: 'Input',width: '49%',},
        {key: '3',label: 'Email',children:<>{!businessDetail?'':businessDetail.email}</>,span:3,name: 'email',type: 'Input',width: '49%',},
        {key: '4',label: 'VAT',children:<>{!businessDetail?'':businessDetail.VAT}</>,span:3,name: 'VAT',type: 'Input',width: '49%',},
        {key: '5',label: 'TIN',children:<>{!businessDetail?'':businessDetail.TIN}</>,span:3,name: 'TIN',type: 'Input',width: '49%',},
        {key: '6',label: 'profile',children:<Image src={`${BACKENDURL}/uploads/new/${!businessDetail?'':businessDetail.profile}`} alt='profile' height={25} />,span:3,name: 'profile',type: 'File',req:'image/*',width: '49%',},
        {key: '7',label: 'license',children:<Image src={`${BACKENDURL}/uploads/new/${!businessDetail?'':businessDetail.license}`} alt='license' height={25} />,span:3,name: 'license',type: 'File',req:'image/*',width: '49%',},
      ];

  const [modalOpen, setModalOpen] = useState (false);

  return (
    <div>
      <ModalForm
          open={modalOpen}
          close={() => setModalOpen (false)}
          title={'Edit Business Info Form'}
          content={<EditCompanyInfo formInfos={businessInfoData} id={!businessDetail?'':businessDetail.id} reload={getbusinessDetail} openModalFun={(e) => setModalOpen(e)}/>}
        />
      
      <Descriptions
        style={{width: '100%'}}
        column={{xs: 1, sm: 1}}
        bordered
        size="small"
        items={businessInfoData}
      />
      <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
        <Tooltip title='Edit Information'><Button onClick={()=>setModalOpen(true)} type='primary'><MdReport color='white'/>Edit Information</Button></Tooltip>
      </div>
    </div>
  );
};

export default OrganzationInfo