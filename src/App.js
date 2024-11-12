import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup/index';
import Login from './components/login/Login';
import Task from './components/fetchtask/index';
import AddTask from './components/addtask/index';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    // Wrap the Router with GoogleOAuthProvider to provide OAuth context
    <GoogleOAuthProvider clientId="989966998842-27rsddtqij1eu6mmenivi5jjn8jtsucc.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/task" element={<Task />} />
          <Route path="/add-task" element={<AddTask />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
