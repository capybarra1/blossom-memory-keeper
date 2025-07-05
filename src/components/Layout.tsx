import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] h-full">
      {children}
    </div>
  );
};

export default Layout;