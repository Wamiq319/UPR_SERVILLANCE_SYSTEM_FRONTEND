import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "@/redux/slices/resourcesSLice";
import { Button, InputField } from "@/components";
import logo from "@/assets/LOGO.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FIX: Correct slice
  const { status, error } = useSelector((state) => state.resources);

  // Redirect when user already exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      const user = JSON.parse(stored);
      if (user) navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const user = result.payload.data;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* LEFT PANEL */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-600 to-green-700 items-center justify-center p-10 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-full p-4 shadow-md mb-6">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>

              <h1 className="text-3xl font-bold mb-3">
                AI Surveillance System
              </h1>

              <p className="max-w-xs">
                Secure access to your monitoring & attendance dashboard.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
              Admin Login
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
              >
                {status === "loading" ? "Logging in..." : "Login"}
              </Button>

              {error && (
                <p className="text-center text-red-600 font-medium">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
