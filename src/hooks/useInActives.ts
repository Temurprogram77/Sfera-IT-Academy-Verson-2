import { useState, useEffect, useCallback } from "react";
import InActivesService from "../services/InActivesService";
import { IInactiveStudent } from "../types/inactives";

interface UseInActivesProps {
  name?: string;
  page: number;
  size: number;
}

const useInActives = ({ name, page, size }: UseInActivesProps) => {
  const [allStudents, setAllStudents] = useState<IInactiveStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInactiveStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await InActivesService.getAll();
      setAllStudents(data);
    } catch (err) {
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activateStudent = useCallback(
    async (studentId: number): Promise<void> => {
      setActivatingId(studentId);
      setError(null);
      try {
        await InActivesService.activate(studentId);
        const data = await InActivesService.getAll();
        setAllStudents(data);
      } catch (err) {
        setError("Studentni aktivlashtirishda xatolik yuz berdi.");
      } finally {
        setActivatingId(null);
      }
    },
    []
  );

  useEffect(() => {
    fetchInactiveStudents();
  }, [fetchInactiveStudents]);

  const filtered = name
    ? allStudents.filter(
        (s) =>
          s.fulName?.toLowerCase().includes(name.toLowerCase()) ||
          s.phoneNumber?.includes(name)
      )
    : allStudents;

  const pagination = {
    totalElements: filtered.length,
    page,
    size,
  };

  return {
    students: filtered.slice(page * size, (page + 1) * size),
    isLoading,
    activatingId,
    pagination,
    error,
    activateStudent,
  };
};

export default useInActives;