import React, { useEffect, useState } from 'react';
import { Card, Spin, message, Input, Button, Modal, Form, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

function Index() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [form] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false); // New state for loading in the Edit modal

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token){
            message.error("Please log in first");
            navigate('/');
        }
        const response = await axios.get('https://trello-backend-seven.vercel.app/api/task', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedTasks = sortOrder === 'latest'
          ? response.data.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : response.data.tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setTasks(sortedTasks);
        message.success(response.data.message);
      } catch (error) {
        message.error('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [sortOrder]);

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery)
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    const formattedDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    form.setFieldsValue({
      ...task,
      dueDate: formattedDueDate,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (values) => {
    try {
      setEditLoading(true); // Set loading state to true when editing starts
      const token = localStorage.getItem('token');
      await axios.put(`https://trello-backend-seven.vercel.app/api/task/${currentTask._id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Task updated successfully!');
      setIsEditModalOpen(false);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === currentTask._id ? { ...task, ...values } : task))
      );
    } catch (error) {
      message.error('Failed to update task.');
    } finally {
      setEditLoading(false); // Reset loading state after the request is completed
    }
  };

  const openDeleteModal = (task) => {
    setCurrentTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://trello-backend-seven.vercel.app/api/task/${currentTask._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Task deleted successfully!');
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== currentTask._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error('Failed to delete task.');
    }
  };

  const showDetails = (task) => {
    Modal.info({
      title: 'Task Details',
      content: (
        <div>
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {task.status}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <Button
          type="primary"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
          onClick={() => navigate('/add-task')}
        >
          Add Task
        </Button>
        <Search
          placeholder="Search tasks by title..."
          onSearch={handleSearch}
          enterButton
          style={{ width: '60%' }}
        />
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          style={{ width: '150px' }}
        >
          <Option value="latest">Latest</Option>
          <Option value="oldest">Oldest</Option>
        </Select>
        <Button
          type="primary"
          className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : filteredTasks.length === 0 ? (
        <p className="text-xl text-gray-600">No tasks available</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {['Not Started', 'In Progress', 'Completed'].map((status) => (
            <div
              key={status}
              className={`border rounded-lg p-4 shadow-lg ${
                status === 'Not Started' ? 'bg-blue-50' : status === 'In Progress' ? 'bg-yellow-50' : 'bg-green-50'
              }`}
            >
              <h2 className={`text-xl font-semibold mb-4 ${
                status === 'Not Started' ? 'text-blue-700' : status === 'In Progress' ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {status}
              </h2>
              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Card
                    key={task._id}
                    title={task.title}
                    bordered={false}
                    className="shadow-md rounded-md transform transition-transform hover:scale-105 mb-4"
                    extra={
                      <>
                        <EyeOutlined onClick={() => showDetails(task)} style={{ marginRight: 8 }} />
                        <EditOutlined onClick={() => openEditModal(task)} style={{ marginRight: 8 }} />
                        <DeleteOutlined onClick={() => openDeleteModal(task)} />
                      </>
                    }
                  >
                    <p>{task.description}</p>
                    <p className="text-gray-600 mt-2">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p className={`mt-2 ${status === 'Not Started' ? 'text-red-600' : status === 'In Progress' ? 'text-yellow-600' : 'text-green-600'}`}>Status: {task.status}</p>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Edit Task"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={editLoading} // This will show a loading spinner on the "OK" button
      >
        <Form form={form} onFinish={handleEdit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Task"
        visible={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDelete}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
}

export default Index;
