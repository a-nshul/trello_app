import React, { useState } from 'react';
import { MailOutlined, LockOutlined, GoogleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Input, Button, Checkbox, Form, message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // React Router for navigation

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('https://trello-backend-seven.vercel.app/api/user/login', {
        email: values.email,
        password: values.password,
      });

      message.success('Login successful!');
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/task'); // Navigate to the dashboard page
    } catch (error) {
      message.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions for Google and GitHub login
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Implement Google OAuth login
    setGoogleLoading(false);
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-center text-gray-900 transition-colors duration-300 hover:text-indigo-600">
          <UserAddOutlined className="mr-2" />
          Login
        </h2>
        <Form
          name="login"
          onFinish={handleFinish}
          className="mt-8 space-y-6"
        >
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
              placeholder="Email address"
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
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" size="large" loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center ">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center space-x-2" 
            size="large"
            loading={googleLoading} 
            style={{ background: '#DB4437', color: '#FFFFFF' }}
          >
            <GoogleOutlined />
            <span>Sign in with Google</span>
          </Button>
        </div>

        <div className="text-black text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
