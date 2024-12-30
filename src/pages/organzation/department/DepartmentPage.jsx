import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../context/AlertContext';
import axios from 'axios';
import ModalForm from '../../../modal/Modal';
import { Button } from 'antd';
import { BACKENDURL } from '../../../helper/Urls';
import DepartmentTable from '../../../components/tables/organzation/department/DepartmentTable';
import NewDepartmentForm from '../../../components/forms/organzation/NewDepartmentForm';

const DepartmentPage = () => {
  const {openNotification} = useContext(AlertContext);

  const [branchData,setBranchData]=useState([])
  const [loading,setLoading]=useState(false)

  const getBranchData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get(`${BACKENDURL}/organzation/department/all`);
      setLoading (false);
      setBranchData(res.data.departments)
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
          Register Department
        </Button>
        <Button type='default' onClick={getBranchData} loading={loading}>
          Reload
        </Button>
        <ModalForm
          open={modalOpen}
          close={() => setModalOpen (false)}
          title={'New Department Form'}
          content={<NewDepartmentForm reload={()=>getBranchData()} openModalFun={(e) => setModalOpen (e)}/>}
        />
      </div>
      <DepartmentTable loading={loading} reload={()=>getBranchData()} branchData={branchData}/>
    </div>
  )
}

export default DepartmentPage