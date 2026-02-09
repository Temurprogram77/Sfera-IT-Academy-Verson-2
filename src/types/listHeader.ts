import { ReactNode } from "react";

export interface ListHeaderProps {
  title: string;
  count: number | undefined;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  buttonText: string;
  onButtonClick: () => void;
  children?: ReactNode;
}