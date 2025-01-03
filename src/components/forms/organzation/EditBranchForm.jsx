import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';

const EditBranchForm = ({ branchData, openModalFun, reload }) => {
  const { openNotification } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (branchData) {
      form.setFieldsValue({
        name: branchData.name,
        city: branchData.city,
        subCity: branchData.subCity,
        wereda: branchData.wereda,
        status: branchData.status || 'Active', // Default status to 'Active' if not provided
      });
    }
  }, [branchData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Log the values being sent
      console.log("Values to be updated:", values);

      // Log the endpoint URL
      console.log("Endpoint URL:", `${BACKENDURL}/organization/branch/update/${branchData.IDNO}`);

      // Ensure `branchData.id` exists
      if (!branchData?.id) {
        console.error("Error: branchData.id is undefined");
        openNotification('error', 'Branch ID is missing. Unable to update branch.', 3, 'red');
        setLoading(false);
        return;
      }

      // Perform the PUT request
      const res = await axios.put(`${BACKENDURL}/organzation/branch/update`, {
        id: branchData.id,  
        name: values.name,
        city: values.city,
        subCity: values.subCity,
        wereda: values.wereda,
        status: values.status,  
      });

      // Log the response
      console.log("Response from server:", res.data);

      // Reload and notify on success
      reload();
      setLoading(false);
      openModalFun(false);
      openNotification('success', res.data.message, 3, 'green');
      form.resetFields();
    } catch (error) {
      // Log the error details
      console.error("Error occurred during PUT request:", error);

      setLoading(false);
      openNotification('error', error.response?.data?.message || 'Error updating branch', 3, 'red');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        style={{ margin: '5px' }}
        label="Office Name"
        rules={[
          {
            required: true,
            message: 'Please input Office',
          },
        ]}
        name="name"
      >
        <Input />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Form.Item
          style={{ margin: '5px', width: '47%' }}
          label="City / Region"
          name="city"
          rules={[
            {
              required: true,
              message: 'Please input City',
            },
          ]}
        >
          <Select
            placeholder="Search to Select"
            options={[
              {
                value: 'Addis Abeba',
                label: 'Addis Abeba',
              },
              {
                value: 'Sidama',
                label: 'Sidama',
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          style={{ margin: '5px', width: '47%' }}
          label="Sub City / Zone"
          rules={[
            {
              required: true,
              message: 'Please input Sub City',
            },
          ]}
          name="subCity"
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: 'Arada',
                label: 'Arada',
              },
              {
                value: 'Yeka',
                label: 'Yeka',
              },
              {
                value: 'Bole',
                label: 'Bole',
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          style={{ margin: '5px', width: '47%' }}
          label="Wereda"
          rules={[
            {
              required: true,
              message: 'Please input wereda',
            },
          ]}
          name="wereda"
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '01',
                label: '01',
              },
              {
                value: '02',
                label: '02',
              },
              {
                value: '04',
                label: '04',
              },
            ]}
          />
        </Form.Item>

        {/* Add Status Dropdown */}
        <Form.Item
          style={{ margin: '5px', width: '47%' }}
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: 'Please select status',
            },
          ]}
        >
          <Select
            placeholder="Select Status"
            options={[
              {
                value: 'Active',
                label: 'Active',
              },
              {
                value: 'InActive',
                label: 'InActive',
              },
            ]}
          />
        </Form.Item>
      </div>

      <Form.Item
        style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          loading={loading}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditBranchForm;
