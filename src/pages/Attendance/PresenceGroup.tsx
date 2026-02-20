import { useState, useEffect, useMemo } from "react";
import { Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";

import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import ListHeader from "../../components/ListHeader/ListHeader";

import { SelectedCell } from "../../types/type";
import { useAttendanceStream, useDaysInMonth, useSendAttendance } from "../../services/attendancehook";
import { calcStudentRate, calcMonthStats, calcTodayStats, getStudentName } from "../../utils/attendance";

import StatsBar from "../../components/attendance/StatsBar";
import AttendanceTable from "../../components/attendance/Attendancetable";
import DescriptionModal, { openStatusSelector } from "../../components/attendance/DescriptionModal";

const PresenceGroup = () => {
  const now = dayjs();

  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { groups, loading: groupsLoading } = useGroups({ page: 0, size: 100 });
  const { students, loading: studentsLoading } = useGroupDetails(selectedGroupId ?? 0);

  const attendance = useAttendanceStream(selectedGroupId);
  const { loadingCell, sendAttendance } = useSendAttendance(selectedGroupId);
  const daysInMonth = useDaysInMonth(year, month);

  // Birinchi guruhni auto-tanlash
  useEffect(() => {
    if (groups?.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups]);

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  // O'tgan kunlar (bugun ham kiradi)
  const pastDays = useMemo(
    () => daysInMonth.filter((d) => !d.isAfter(now, "day")),
    [daysInMonth]
  );

  // Qidiruv filtri
  const filteredStudents = useMemo(
    () => students.filter((s: any) =>
      getStudentName(s).toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [students, searchTerm]
  );

  const studentIds = useMemo(
    () => filteredStudents.map((s: any) => s.id as number),
    [filteredStudents]
  );

  // Oylik statistika
  const monthStats = useMemo(
    () => calcMonthStats(attendance, studentIds, pastDays),
    [attendance, studentIds, pastDays]
  );

  // Bugungi statistika — har bir o'quvchi faqat 1 marta
  const todayStats = useMemo(
    () => calcTodayStats(attendance, studentIds, now),
    [attendance, studentIds]
  );

  // Past davomatlilar (75% dan past)
  const lowAttendanceStudents = useMemo(
    () =>
      filteredStudents
        .map((s: any) => ({ ...s, rate: calcStudentRate(attendance, s.id, pastDays) }))
        .filter(({ rate }: { rate: number }) => rate > 0 && rate < 75),
    [filteredStudents, attendance, pastDays]
  );

  // Hujayra bosilganda
  const handleCellClick = (studentId: number, date: Dayjs) => {
    openStatusSelector({
      studentId,
      date,
      onKeldi: (id, d) => sendAttendance(id, d, "KELDI"),
      onAbsent: (id, d, status) => {
        setSelectedCell({ studentId: id, date: d, status });
        setModalOpen(true);
      },
    });
  };

  // Sabab bilan saqlash
  const handleDescriptionOk = () => {
    if (!description.trim()) return toast.warning("Sabab yozing");
    if (!selectedCell) return;

    sendAttendance(
      selectedCell.studentId,
      selectedCell.date,
      selectedCell.status,
      description,
      () => {
        setModalOpen(false);
        setDescription("");
        setSelectedCell(null);
      }
    );
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setDescription("");
    setSelectedCell(null);
  };

  const handleGroupChange = (groupId: number) => {
    setSelectedGroupId(groupId);
    setSearchTerm("");
  };

  if (groupsLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 24px" }}>
      <ListHeader
        title="Davomat"
        count={filteredStudents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="O'quvchi qidirish..."
        selectOption={groups.map((g) => ({ value: g.id, label: g.name }))}
        onSelectChange={handleGroupChange}
        selectValue={selectedGroupId ?? undefined}
      />

      <StatsBar monthStats={monthStats} todayStats={todayStats} />

      <AttendanceTable
        students={filteredStudents}
        loading={studentsLoading}
        daysInMonth={daysInMonth}
        now={now}
        month={month}
        year={year}
        groupName={groups.find((g) => g.id === selectedGroupId)?.name ?? ""}
        attendance={attendance}
        loadingCell={loadingCell}
        pastDays={pastDays}
        onCellClick={handleCellClick}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <DescriptionModal
        open={modalOpen}
        description={description}
        onDescriptionChange={setDescription}
        onOk={handleDescriptionOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default PresenceGroup;