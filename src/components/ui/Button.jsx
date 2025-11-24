import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) => {
  const baseClasses = `
    px-5 py-3 font-semibold text-sm md:text-base
    bg-green-600 text-white rounded-lg
    hover:bg-green-700 active:scale-[0.97]
    transition-all duration-200 shadow-sm select-none
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
