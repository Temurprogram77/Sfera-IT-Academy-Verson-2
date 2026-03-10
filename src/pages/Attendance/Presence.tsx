// components/Presence.tsx  (yoki pages/Presence/Presence.tsx)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Input, Empty } from 'antd';
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CalendarOutlined,     // davomat uchun mosroq icon
} from '@ant-design/icons';
import { useAllGroups } from '../../hooks/useGroups'; // yo'lni loyihangizga moslashtiring

const PRIMARY_COLOR = '#00A67D';

const getColor = (name: string) => {
  const colors = [
    '#00A67D', '#6366f1', '#f59e0b', '#ec4899',
    '#3b82f6', '#10b981', '#f97316', '#8b5cf6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Presence: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { groups, loading, error } = useAllGroups();

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.teacherName || '').toLowerCase().includes(search.toLowerCase()) ||
      (g.categoryName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          Guruhlarni yuklashda xatolik yuz berdi
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
            Davomat / Ishtirok
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Davomatni yuritish uchun kerakli guruhni tanlang
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Guruh, o'qituvchi yoki yo'nalish bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            className="rounded-xl shadow-sm"
            allowClear
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex justify-center py-20">
            <Empty
              description={
                search
                  ? 'Qidiruv bo‘yicha guruh topilmadi'
                  : 'Hozircha guruhlar mavjud emas'
              }
            />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {filteredGroups.length} ta guruh topildi
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGroups.map((group) => {
                const color = getColor(group.name || group.id.toString());

                return (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/presence/${group.id}`)} // yoki /attendance/${group.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden group hover:-translate-y-1"
                  >
                    {/* Rangli chiziq */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

                    <div className="p-5">
                      {/* Yuqori qism */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: color }}
                          >
                            {group.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate group-hover:text-[#00A67D] transition-colors">
                              {group.name}
                            </h3>
                            {group.categoryName && (
                              <span
                                className="text-xs px-2.5 py-0.5 rounded-full text-white font-medium mt-1 inline-block"
                                style={{ backgroundColor: `${color}cc` }}
                              >
                                {group.categoryName}
                              </span>
                            )}
                          </div>
                        </div>

                        <RightOutlined
                          className="text-gray-300 group-hover:text-[#00A67D] transition-colors mt-1.5 flex-shrink-0"
                          style={{ fontSize: 14 }}
                        />
                      </div>

                      {/* Ma'lumotlar */}
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                          <UserOutlined style={{ color: PRIMARY_COLOR }} />
                          <span className="truncate">
                            {group.teacherName || 'O‘qituvchi belgilanmagan'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                          <TeamOutlined style={{ color: PRIMARY_COLOR }} />
                          <span>
                            {group.studentCount ?? 0} ta o‘quvchi
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                          <ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />
                          <span>
                            {group.categoryName ?? 0}
                          </span>
                        </div>
                      </div>

                      {/* Pastki qism */}
                      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          Davomat yuritish
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          Kirish →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Presence;