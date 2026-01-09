import { Button } from "antd";
import { ReactNode } from "react";

interface IconButtonProps {
  icon?: ReactNode;
  text: string;
  onClick?: () => void;
  type?: "default" | "primary" | "dashed" | "link" | "text" ;
  className?: string;
}

const IconButton = ({ icon, text, onClick, type = "primary", className = "" }: IconButtonProps) => {
  return (
    <Button
      type={type}
      icon={icon}
      onClick={onClick}
      className={className}
    >
      {text}
    </Button>
  );
};

export default IconButton;
