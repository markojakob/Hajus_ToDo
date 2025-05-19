import { BrowserRouter, Route, Routes } from 'react-router';
import TaskList from './components/views/TaskList';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import Register from './components/views/Register';
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path='/register' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;