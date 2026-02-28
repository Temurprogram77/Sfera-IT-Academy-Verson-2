import { useState, useEffect, useCallback } from "react";
import InActivesService from "../services/InActivesService";
import { IInactiveStudent } from "../types/inactives";

// Parametrlarni qabul qilish (qidiruv va sahifalash uchun)
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
      const res = await InActivesService.getAll();
      
      let data: IInactiveStudent[] = [];

      if (Array.isArray(res)) {
        data = res;
      } else if (res && Array.isArray(res)) {
        data = res;
      }

      // Qidiruv mantiqi (agar API-da qidiruv bo'lmasa, front-da filter qilamiz)
      if (name) {
        data = data.filter(s => 
          s.fulName?.toLowerCase().includes(name.toLowerCase()) || 
          s.phoneNumber?.includes(name)
        );
      }

      setStudents(data);
    } catch (err) {
      console.error("API xatosi:", err);
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, [name]); // name o'zgarganda qayta chaqiriladi

  const activateStudent = useCallback(async (studentId: number) => {
    setActivatingId(studentId);
    try {
      const res = await InActivesService.activate(studentId);
      if (res) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      }
      return res;
    } catch (err) {
      setError("Studentni aktivlashtirishda xatolik yuz berdi.");
    } finally {
      setActivatingId(null);
    }
  }, []);

  useEffect(() => {
    fetchInactiveStudents();
  }, [fetchInactiveStudents]);

  // PAGINATION mantiqini yasaymiz
  const pagination = {
    totalElements: students.length,
    page: page,
    size: size,
  };

  return {
    students: students.slice(page * size, (page + 1) * size), // Faqat kerakli qismini kesib beramiz
    isLoading: loading, // Komponent isLoading kutyapti, shuning uchun nomini o'zgartirdik
    activatingId,
    pagination, // Endi pagination mavjud
    error,
    fetchInactiveStudents,
    activateStudent,
  };
};

export default useInActives;