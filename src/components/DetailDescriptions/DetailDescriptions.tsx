import React from "react";

type ItemProps = {
  label: string;
  children: React.ReactNode;
};

export const DetailItem: React.FC<ItemProps> = ({ label, children }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <div className="text-base font-medium">{children}</div>
    </div>
  );
};

type WrapperProps = {
  children: React.ReactNode;
};

const DetailDescriptions: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
};

export default DetailDescriptions;
