import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Tabs, Button, Modal, Form, Input, Select, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, userDataRes, rolesRes, deptRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/users/me`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/roles`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/departments`, { headers }),
      ]);

      setUser(userRes.data.data);
      setUsers(userDataRes.data.data);
      setRoles(rolesRes.data.data);
      setDepartments(deptRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/users`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('User created successfully');
      form.resetFields();
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Failed to create user');
    }
  };

  const userColumns = [
    { title: 'Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: ['role', 'name'], key: 'role' },
    { title: 'Department', dataIndex: ['department', 'name'], key: 'department' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (isActive ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={user?.role?.name} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs
          items={[
            {
              key: '1',
              label: 'Users',
              children: (
                <div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                    className="mb-4"
                  >
                    Add User
                  </Button>
                  <Table columns={userColumns} dataSource={users} loading={loading} rowKey="_id" />
                </div>
              ),
            },
          ]}
        />

        <Modal
          title="Create New User"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateUser} layout="vertical">
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select Role">
                {roles.map((role) => (
                  <Select.Option key={role._id} value={role._id}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="departmentId" label="Department">
              <Select placeholder="Select Department">
                {departments.map((dept) => (
                  <Select.Option key={dept._id} value={dept._id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Create User
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPanel;
