import { useState, useEffect, useCallback } from "react";
import { getStudentGrades } from "../apis/grades";
import { GradeData } from "../types/grades";
import { useAuthContext } from "./useAuthContext";

interface UseGradesReturn {
  grades: GradeData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGrades = (semester?: string): UseGradesReturn => {
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuthContext();

  const fetchGrades = useCallback(async () => {
    if (!userInfo?.userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getStudentGrades(userInfo.userId, semester);
      setGrades(data);
    } catch (err) {
      setError("성적 정보를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.userId, semester]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return { grades, loading, error, refetch: fetchGrades };
};
