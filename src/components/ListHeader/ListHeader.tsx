import { ReactNode } from "react";
import { Input as AntInput } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/* ===== Props type ===== */
interface ListHeaderProps {
  title: string;
  count: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  buttonText: string;
  onButtonClick: () => void;
  children?: ReactNode;
}

/* ===== Component ===== */
const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  count,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Qidirish...",
  buttonText,
  onButtonClick,
  children,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-base font-medium text-gray-700">
          {title}:{" "}
          <span className="font-bold text-gray-900">{count}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {children}

          <AntInput
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80 h-10 rounded-lg border-gray-300"
            allowClear
          />

          <button
            onClick={onButtonClick}
            className="flex items-center justify-center gap-2 bg-[#18A752] text-white px-5 py-2 h-10 rounded-lg hover:bg-[#118740] transition whitespace-nowrap"
          >
            <span className="text-[30px]">+</span>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListHeader;
