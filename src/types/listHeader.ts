import { OptionType } from "dayjs";
import { ReactNode } from "react";

export interface ListHeaderProps {
  title: string;
  count: number | undefined;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
   selectOption?: OptionType[];
  buttonText?: string;
  onButtonClick?: () => void;
  onSelectChange?: (value: number) => void;
  selectValue?: number | string;
  children?: ReactNode;
  buttonStyle?: React.CSSProperties;
}