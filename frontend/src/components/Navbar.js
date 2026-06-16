import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-2xl font-bold">
            LeadOpsCRM
          </Link>
          <div className="hidden md:flex gap-6">
            <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link to="/leads" className="hover:bg-blue-700 px-3 py-2 rounded">
              My Leads
            </Link>
            {['Super Admin', 'Admin', 'Manager'].includes(userRole) && (
              <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
