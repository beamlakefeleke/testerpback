import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';

const EditDepartmentForm = ({ openModalFun, reload, departmentData }) => {
  const { openNotification } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [branchData, setBranchData] = useState([]);
  const [loadingBranch, setLoadingBranch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBranch(true);
      try {
        const branchRes = await axios.get(`${BACKENDURL}/organzation/branch/all`);
        setBranchData(branchRes.data.branchs);

        if (departmentData) {
          form.setFieldsValue({
            name: departmentData.name,
            branch: departmentData.branch.id,
            status: departmentData.status,  // Set the initial status if available
          });
        }
        setLoadingBranch(false);
      } catch (error) {
        openNotification('error', error.response?.data?.message || 'Error fetching data', 3, 'red');
        setLoadingBranch(false);
      }
    };

    fetchData();
  }, [departmentData, form, openNotification]);

  const branchOptions = branchData.length
    ? branchData.map((branch) => ({
        value: branch.id,
        label: branch.name, 
      }))
    : [];

  const onFinish = async (values) => {
    console.log('Form values:', values);
    setLoading(true);
    try {
      const res = await axios.put(
        `${BACKENDURL}/organzation/department/update`, // Update endpoint
        {
          id: departmentData.id,
          name: values.name,
          branch: values.branch,
          status: values.status || 'Active',  // Allow dynamic status change
        }
      );
      reload();
      setLoading(false);
      openModalFun(false);
      openNotification('success', res.data.message, 3, 'green');
      form.resetFields();
    } catch (error) {
      setLoading(false);
      console.error("Error occurred:", error);
      openNotification('error', error.response?.data?.message || 'Error updating department', 3, 'red');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
    >
      <Form.Item
        style={{ margin: '5px', width: '100%' }}
        label="Office"
        name="branch"
        rules={[{ required: true, message: 'Please select an Office' }]}
      >
        <Select
          placeholder="Search to Select"
          options={branchOptions}
          loading={loadingBranch}
          disabled={loadingBranch || !departmentData}
        />
      </Form.Item>

      <Form.Item
        style={{ margin: '5px' }}
        label="Department Name"
        rules={[{ required: true, message: 'Please input the Name' }]}
        name="name"
      >
        <Input disabled={!departmentData} />
      </Form.Item>

      <Form.Item
        style={{ margin: '5px' }}
        label="Status"
        name="status"
      >
        <Select
          placeholder="Select Status"
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'InActive', label: 'InActive' },
          ]}
          disabled={!departmentData}
        />
      </Form.Item>

      <Form.Item
        style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading || !departmentData}
          loading={loading}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditDepartmentForm;
