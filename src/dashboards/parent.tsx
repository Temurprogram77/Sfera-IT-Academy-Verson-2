import { Avatar, Button, Card, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useMyChildren } from "../hooks/useParentChild";

export default function MyChildsCards() {
  const navigate = useNavigate();
  const { children, loading } = useMyChildren();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!children.length) {
    return (
      <div className="px-4 py-10">
        <Empty description="Farzand topilmadi" />
      </div>
    );
  }

  return (
    <div className="px-4">
      <h2 className="mb-5 mt-2 text-black dark:text-white text-xl">
        Farzandlarim
      </h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="text-center">
            <Avatar
              size={102}
              src={child.imgUrl || undefined}
              className="text-[28px] mb-3!"
            >
              {/* imgUrl yo'q bo'lsa ismning birinchi harfi */}
              {!child.imgUrl && child.fulName?.[0]}
            </Avatar>

            <div className="font-semibold text-[15px]">{child.fulName}</div>

            <div className="text-[#888] text-[13px] mb-4">{child.groupName}</div>

            <Button
              type="primary"
              block
              onClick={() => navigate(`/my-childs/${child.id}`)}
            >
              Batafsil
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}