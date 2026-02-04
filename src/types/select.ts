export interface SelectComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
}