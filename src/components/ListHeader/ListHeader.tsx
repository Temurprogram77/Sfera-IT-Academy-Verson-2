import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton/IconButton";
import InputComponent from "../Input/Input";
import { ListHeaderProps } from "../../types/listHeader";
import SelectComponent from "../Select/Select";

const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  count,
  searchValue,
  onSearchChange,
  searchPlaceholder = "search",
  selectOption,
  buttonText,
  onButtonClick,
  children,
  onSelectChange,
  selectValue,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-[#1d2939] dark:bg-black p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-base font-medium dark:text-white text-gray-700">
          {title}:{" "}
          <span className="font-bold dark:text-white text-gray-900">
            {count}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {children}
          <InputComponent
            placeholder={t(searchPlaceholder)}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80"
          />
          {selectOption && (
            <SelectComponent
              options={selectOption}
              placeholder="Guruhlarni tanlang"
              className="min-w-[200px]"
              onChange={onSelectChange}
              value={selectValue}
            />
          )}
          {buttonText && onButtonClick && (
            <IconButton
              icon={<PlusOutlined />}
              text={buttonText}
              onClick={onButtonClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListHeader;
