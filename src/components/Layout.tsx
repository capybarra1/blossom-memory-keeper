import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 状态栏安全区域背景 - 与Header颜色一致 */}
      <div className="fixed top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-[#75B798] z-50"></div>
      
      {/* 主要内容区域 */}
      <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Layout;