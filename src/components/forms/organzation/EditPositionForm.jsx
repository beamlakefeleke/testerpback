import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Spin, message } from 'antd';
import axios from 'axios';
import { BACKENDURL } from '../../../helper/Urls';

const EditPositionForm = ({ Data, reload, openModalFun }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Fetch department options
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsRes = await axios.get(`${BACKENDURL}/organzation/department/all`);
        setDepartments(departmentsRes.data.departments);
      } catch (error) {
        message.error('Failed to fetch departments.');
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.put(`${BACKENDURL}/organzation/position/update`, {
        id: Data.id,
        name: values.name,
        department: values.department,
        status: values.status,
      });
      setLoading(false);
      message.success('Position updated successfully');
      reload();
      openModalFun(false); // Close the modal
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || 'Failed to update position';
      message.error(errorMsg);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: Data.name,
          department: Data.departmentId,
          status: Data.status,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Position Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the position name' }]}
        >
          <Input placeholder="Enter position name" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select placeholder="Select a department">
            {departments.map((dept) => (
              <Select.Option key={dept.id} value={dept.id}>
                {dept.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select a status">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="InActive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Position
          </Button>
          <Button type="default" onClick={() => openModalFun(false)} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EditPositionForm;
