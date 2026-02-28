import React, { useState } from "react";
import { Spin } from "antd";
import useInActives from "../../hooks/useInActives";
import { IInactiveStudent } from "../../types/inactives";

import ListHeader from "../../components/ListHeader/ListHeader";
import TableComponent from "../../components/Table/Table";
import NotFoundData from "../OtherPage/NotFoundData";

const Avatar = ({ src, name }: { src: string | null; name: string }) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-indigo-800/40 text-indigo-200 flex items-center justify-center text-sm font-semibold ring-2 ring-indigo-500/30">
      {initials || "?"}
    </div>
  );
};

const InActives = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    students,
    pagination,
    isLoading,
    error,
    activatingId,
    activateStudent,
  } = useInActives({
    name: search || undefined,
    page: currentPage,
    size: pageSize,
  });

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(newPageSize);
  };

  const columnsConfig = [
    {
      key: "avatarAndName",
      title: "Talaba",
      render: (_: any, record: IInactiveStudent) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.imgUrl ?? null} name={record.fulName ?? ""} />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{record.fulName || "Mavjud emas"}</div>
            <div className="text-xs text-gray-500">{record.phoneNumber || "Mavjud emas"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "group",
      title: "Guruh",
      render: (_: any, record: IInactiveStudent) =>
        record.groupName ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-900/30 text-indigo-300">
            {record.groupName}
          </span>
        ) : "Mavjud emas",
    },
    {
      key: "action",
      title: "Amal",
      align: "right" as const,
      render: (_: any, record: IInactiveStudent) => {
        const isThisActivating = activatingId === record.id;
        return (
          <button
            onClick={() => activateStudent(record.id)}
            disabled={isThisActivating}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              isThisActivating ? "bg-gray-700 text-gray-400" : "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
            }`}
          >
            {isThisActivating ? "Yuklanmoqda..." : "Aktivlashtirish"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <ListHeader
        title="Inactive Talabalar"
        count={pagination.totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Qidirish..."
        buttonText=""
      />

      {isLoading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : students.length === 0 ? (
        <NotFoundData title="Talabalar topilmadi" description="" />
      ) : (
        <TableComponent<IInactiveStudent>
          data={students}
          itemName="Talaba"
          searchKeys={["fulName", "phoneNumber"]}
          columnsConfig={columnsConfig}
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: pagination.totalElements,
            onChange: handlePageChange,
            showSizeChanger: true,
          }}
          className="w-full text-left text-sm" // <-- Endi xato bermaydi
        />
      )}
    </div>
  );
};

export default InActives;