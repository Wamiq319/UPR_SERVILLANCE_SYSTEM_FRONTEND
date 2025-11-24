import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const InputField = ({ label, type = "text", placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold mb-2 text-green-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 placeholder-gray-400 transition-all duration-200"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 inset-y-0 pr-4 flex items-center"
          >
            {showPassword ? (
              <HiEyeOff size={20} className="text-green-600" />
            ) : (
              <HiEye size={20} className="text-green-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
