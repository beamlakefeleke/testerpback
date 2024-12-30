import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../context/AlertContext';
import axios from 'axios';
import ModalForm from '../../../modal/Modal';
import { Button } from 'antd';
import { BACKENDURL } from '../../../helper/Urls';
import BranchTable from '../../../components/tables/organzation/branch/BranchTable';
import NewBranchForm from '../../../components/forms/organzation/NewBranchForm';

const BranchPage = () => {
  const {openNotification} = useContext(AlertContext);

  const [branchData,setBranchData]=useState([])
  const [loading,setLoading]=useState(false)

  const getBranchData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get(`${BACKENDURL}/organzation/branch/all`);
      setLoading (false);
      setBranchData(res.data.branchs)
    } catch (error) {
      openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  }

  useEffect(()=>{
    getBranchData()
  },[])


  const [modalOpen, setModalOpen] = useState (false);

  return (
    <div>
      <div style={{height: '50px',display:'flex',gap:'10px'}}>
        <Button type="primary" onClick={() => setModalOpen (true)}>
          Register Office
        </Button>
        <Button type='default' onClick={getBranchData} loading={loading}>
          Reload
        </Button>
        <ModalForm
          open={modalOpen}
          close={() => setModalOpen (false)}
          title={'New Office Form'}
          content={<NewBranchForm reload={()=>getBranchData()} openModalFun={(e) => setModalOpen (e)}/>}
        />
      </div>
      <BranchTable loading={loading} reload={()=>getBranchData()} branchData={branchData}/>
    </div>
  )
}

export default BranchPage