import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import NewTicket from './pages/NewTicket';
import Register from './pages/Register';
import Ticket from './pages/Ticket';
import Tickets from './pages/Tickets';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Home />} />
              <Route path='/new-ticket' element={<NewTicket />} />
              <Route path='/tickets' element={<Tickets />} />
              <Route
                path='/ticket/'
                element={<Navigate to='/tickets' replace />}
              />
              <Route path='/ticket/:ticketID' element={<Ticket />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
