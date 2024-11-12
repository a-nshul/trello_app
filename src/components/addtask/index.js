import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Option } = Select;

function Index() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [statusDisabled, setStatusDisabled] = useState(true); // Toggle for enabling/disabling status field
  const navigate = useNavigate();

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Please log in to access this page.');
      navigate('/'); // Redirect to login page if not logged in
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const taskData = {
        ...values,
        status: values.status || 'Not Started', // Set default status to 'Not Started'
      };

      const token = localStorage.getItem('token');
      await axios.post(
        'https://trello-backend-seven.vercel.app/api/task',
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success(`Task added successfully! Status: ${taskData.status}`);
      navigate('/task'); // Redirect to the main task page after adding a task
    } catch (error) {
      message.error('Failed to add task!');
    } finally {
      setLoading(false);
    }
  };

  // Toggle status field enable/disable state
  const toggleStatusField = () => setStatusDisabled(!statusDisabled);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Task</h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please input the task title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Task Description"
            rules={[{ required: true, message: 'Please input the task description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select the due date!' }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* Toggle Button to Enable/Disable Task Status Field with Icon */}
          <div className="mb-4 text-right">
            <Button
              type="link"
              icon={statusDisabled ? <LockOutlined /> : <UnlockOutlined />}
              onClick={toggleStatusField}
            >
              {statusDisabled ? 'Enable Status Selection' : 'Disable Status Selection'}
            </Button>
          </div>

          {/* Task Status with conditional enable/disable */}
          <Form.Item
            name="status"
            label="Task Status"
            initialValue="Not Started"
          >
            <Select disabled={statusDisabled} defaultValue="Not Started">
              <Option value="Not Started">Not Started</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-between">
            <Button type="default" onClick={() => navigate('/task')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Task
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Index;
