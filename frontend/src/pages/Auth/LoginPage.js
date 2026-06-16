import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  }, [navigate, setIsAuthenticated]);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">LeadOpsCRM</h1>
        <p className="text-center text-gray-600 mb-8">Lead Management System</p>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            This system requires SSO authentication. Please use your organization credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
