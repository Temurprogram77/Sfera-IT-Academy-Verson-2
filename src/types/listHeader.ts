import { ReactNode } from "react";
export type SelectOption = {
  label: string;
  value: string | number;
};
export interface ListHeaderProps {
  title: string;
  count: number | undefined;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectOption?: SelectOption[];
  buttonText?: string;
  onButtonClick?: () => void;
  onSelectChange?: (value: number) => void;
  selectValue?: number | string;
  children?: ReactNode;
  buttonStyle?: React.CSSProperties;
}
