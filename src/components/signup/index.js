import { UserAddOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Input, Button, Form, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use React Router's Link and useNavigate

export default function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFinish = async (values) => {
    setLoading(true); // Set loading to true when signup starts
    try {
      const response = await axios.post('https://trello-backend-seven.vercel.app/api/user/', {
        name: values.fullName,
        email: values.email,
        password: values.password,
      });

      // Handle success
      message.success(response.data.message);
      navigate('/'); // Redirect to home page after successful signup
    } catch (error) {
      // Handle error
      if (error.response && error.response.status === 400) {
        message.error('Email already exists. Please use a different email.');
      } else {
        message.error('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false after signup completes or fails
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 transition-colors duration-300 hover:text-indigo-600">
          <UserAddOutlined className="mr-2" />
          Sign Up
        </h2>
        <Form
          form={form}
          name="register"
          onFinish={handleFinish}
          className="mt-8 space-y-6"
          scrollToFirstError
        >
          {/* Full Name */}
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input
              prefix={<UserAddOutlined />}
              placeholder="Full Name"
            />
          </Form.Item>

          {/* Email Address */}
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email Address"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading} // Set loading state to button
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-black text-center">
          Already have an account?{' '}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
