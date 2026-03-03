import { useState, useEffect, useCallback } from "react";
import InActivesService from "../services/InActivesService";
import { IInactiveStudent } from "../types/inactives";

interface UseInActivesProps {
  name?: string;
  page: number;
  size: number;
}

const useInActives = ({ name, page, size }: UseInActivesProps) => {
  const [students, setStudents] = useState<IInactiveStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInactiveStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await InActivesService.getAll();

      let filtered = data;

      if (name) {
        filtered = data.filter(
          (s) =>
            s.fulName?.toLowerCase().includes(name.toLowerCase()) ||
            s.phoneNumber?.includes(name)
        );
      }

      setStudents(filtered);
    } catch (err) {
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, [name]);

  const activateStudent = useCallback(
  async (studentId: number): Promise<void> => {
    setActivatingId(studentId);
    setError(null);

    try {
      const res = await InActivesService.activate(studentId);

      if (res.success) {
        await fetchInactiveStudents();
      }
    } catch (err) {
      setError("Studentni aktivlashtirishda xatolik yuz berdi.");
    } finally {
      setActivatingId(null);
    }
  },
  [fetchInactiveStudents]
);

  useEffect(() => {
    fetchInactiveStudents();
  }, [fetchInactiveStudents]);

  const pagination = {
    totalElements: students.length,
    page,
    size,
  };

  return {
    students: students.slice(page * size, (page + 1) * size),
    isLoading: loading,
    activatingId,
    pagination,
    error,
    activateStudent,
  };
};

export default useInActives;