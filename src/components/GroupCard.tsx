// src/components/attendance/GroupCard.tsx
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Button from './ui/button/Button';
import ComponentCard from './common/ComponentCard';

interface GroupCardProps {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  teacherName,
  studentCount,
}) => {
  return (
    <div className="h-full">
      <ComponentCard title={name} className="h-full">
        <div className="space-y-4">
          <div className="flex items-center text-gray-600 text-sm">
            <BookOutlined style={{ fontSize: 16, marginRight: 8 }} />
            <span>{teacherName}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <UserOutlined style={{ fontSize: 16, marginRight: 8 }} />
            <span>{studentCount} talaba</span>
          </div>
          
          <Link to={`/attendance/group/${id}`}>
            <Button
              variant="primary"
              size="md"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Batafsil
            </Button>
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
};

export default GroupCard;