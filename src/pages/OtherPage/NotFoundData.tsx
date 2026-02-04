import { Empty } from "antd";
import { NotFoundProps } from "../../types/notFound";

const NotFoundData = ({
  title,
  description,
  icon,
  image,
  className = "",
}: NotFoundProps) => {
  return (
    <div className={`text-center py-20 ${className}`}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 120,
        }}
        description={
          <div>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </p>
            {description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {description}
              </p>
            )}
          </div>
        }
      >

      </Empty>
    </div>
  );
};

export default NotFoundData;