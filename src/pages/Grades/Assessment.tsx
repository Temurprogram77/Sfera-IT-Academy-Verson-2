import { Row, Col, Card, Button, Spin } from "antd";
import { UserOutlined, BookOutlined } from "@ant-design/icons";
import { useGroups } from "../../hooks/useGroups";
import { Group } from "../../types/group";
import NotFoundData from "../OtherPage/NotFoundData";
import { useNavigate } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();

  const { groups, loading } = useGroups();

  const handleView = (id: number) => {
    navigate(`/assessment/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <NotFoundData
        title="Guruhlar topilmadi"
        description="Hozircha hech qanday guruh mavjud emas"
      />
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
      
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Baholash</h1>
      <p className="text-gray-500 mb-8">
        Baholash uchun guruhni tanlang
      </p>

      <Row gutter={[24, 24]}>
        {groups.map((group: Group) => (
          <Col key={group.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => handleView(group.id)}
              className="h-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                {/* Group Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h3>

                {/* Teacher */}
                <div className="flex items-center text-gray-500 text-sm">
                  <BookOutlined style={{ marginRight: 8 }} />
                  {group.teacherName || "Belgilanmagan"}
                </div>

                {/* Students */}
                <div className="flex items-center text-gray-500 text-sm">
                  <UserOutlined style={{ marginRight: 8 }} />
                  {group.studentCount ?? 0} o‘quvchi
                </div>

                {/* Button */}
                <Button
                  type="primary"
                  block
                  className="mt-2 bg-green-600 hover:bg-green-700 border-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(group.id);
                  }}
                >
                  Baholash
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Assessment;
