import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full bg-[#75B798] px-6 pt-2 pb-6">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-white text-base opacity-80">{subtitle}</p>}
    </div>
  );
};

export default Header;