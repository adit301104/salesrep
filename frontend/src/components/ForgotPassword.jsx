import React from "react";
import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[#0e172b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="justify-items-center sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src={Logo}
          alt="Autowiz Logo"
          className="h-10 w-auto md:h-10 lg:h-15 mx-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-100">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-xl text-gray-300">
          Enter your Email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0e172b] hover:bg-[#0e172b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reset Password Link
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Go back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
