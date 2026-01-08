import { ReactNode } from "react";
import { Input as AntInput } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  searchPlaceholder = "search",
  buttonText,
  onButtonClick,
  children,
}) => {
  const { t } = useTranslation()
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-[#1d2939] dark:bg-black p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-base font-medium dark:text-white text-gray-700">
          {title}:{" "}
          <span className="font-bold dark:text-white text-gray-900">{count}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {children}

          <AntInput
            placeholder={t(searchPlaceholder)}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80 h-10 rounded-lg border-gray-300"
            allowClear
          />

          <button
            onClick={onButtonClick}
            className="flex items-center justify-center gap-2 bg-[#18A752]  text-white px-5 py-2 h-10 rounded-lg hover:bg-[#118740] transition whitespace-nowrap dark:bg-black dark:border-[#1d2939] dark:border-2"
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
