import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ items }) => {
  const limitedItems = items.slice(0, 5);

  return (
    <div className="mb-4">
      <Breadcrumb
        items={limitedItems.map((item) => ({
          title: item.path ? (
            <Link to={item.path}>{item.title}</Link>
          ) : (
            item.title
          ),
        }))}
      />
    </div>
  );
};

export default AppBreadcrumb;
