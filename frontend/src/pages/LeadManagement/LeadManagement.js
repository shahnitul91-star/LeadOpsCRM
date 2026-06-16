import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Table, Button, Modal, Form, Input, Drawer, Badge, Tag, message } from 'antd';
import { EyeOutlined, CommentOutlined } from '@ant-design/icons';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndLeads();
  }, []);

  const fetchUserAndLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, leadsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/users/me`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/leads`, { headers }),
      ]);

      setUser(userRes.data.data);
      setLeads(leadsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLead = async (lead) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/leads/${lead._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedLead(response.data.data);
      setDrawerVisible(true);
    } catch (error) {
      console.error('Error fetching lead:', error);
      message.error('Failed to load lead details');
    }
  };

  const handleAddComment = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/leads/${selectedLead._id}/comments`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Comment added successfully');
      form.resetFields();
      setModalVisible(false);
      fetchUserAndLeads();
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
  };

  const columns = [
    { title: 'Lead ID', dataIndex: 'leadId', key: 'leadId' },
    { title: 'Name', dataIndex: 'firstName', key: 'firstName', render: (text, record) => `${text} ${record.lastName}` },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Open' ? 'blue' : 'green'}>{status}</Tag> },
    { title: 'Disposition', dataIndex: 'disposition', key: 'disposition' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewLead(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={user?.role?.name} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Leads</h1>
        <Table columns={columns} dataSource={leads} loading={loading} rowKey="_id" />
      </div>

      <Drawer
        title="Lead Details"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {selectedLead && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Lead ID</p>
              <p className="text-lg font-semibold">{selectedLead.leadId}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-lg font-semibold">{selectedLead.firstName} {selectedLead.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg">{selectedLead.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <Tag color={selectedLead.status === 'Open' ? 'blue' : 'green'}>{selectedLead.status}</Tag>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Disposition</p>
              <p className="text-lg">{selectedLead.disposition}</p>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Comments</h3>
                <Button type="primary" size="small" onClick={() => setModalVisible(true)}>
                  Add Comment
                </Button>
              </div>
              <div className="space-y-2">
                {selectedLead.comments && selectedLead.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">by {comment.userId?.firstName} {comment.userId?.lastName}</p>
                    <p>{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Activity Log</h3>
              <div className="space-y-2">
                {selectedLead.activityLog && selectedLead.activityLog.map((log, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
                    <p className="font-semibold">{log.action}</p>
                    <p className="text-gray-600">by {log.performedBy?.firstName} {log.performedBy?.lastName}</p>
                    <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title="Add Comment"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddComment} layout="vertical">
          <Form.Item name="text" label="Comment" rules={[{ required: true, message: 'Please enter a comment' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Add Comment
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadManagement;
