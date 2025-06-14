import { useState, useEffect } from "react";
import { MoodReport } from "../../core/domain/entities/MoodReport";
import { GetMoodReportUseCase } from "../../core/domain/usecases/mood/GetMoodReportUseCase";
import { MoodReportRepositoryImpl } from "../../core/data/repositories/MoodReportRepositoryImpl";
import MoodApi from "../../core/data/datasources/remote/MoodApi";

// Repository and Use Case instances
const moodReportRepository = new MoodReportRepositoryImpl(MoodApi);
const getMoodReportUseCase = new GetMoodReportUseCase(moodReportRepository);

export interface MoodReportViewModel {
  data: MoodReport | null;
  isLoading: boolean;
  error: string | null;
  loadMoodReport: () => Promise<void>;
  retry: () => Promise<void>;
}

export function useMoodReportViewModel(): MoodReportViewModel {
  const [data, setData] = useState<MoodReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoodReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMoodReportUseCase.execute(0, 10);
      setData(response);
    } catch (err: any) {
      console.error("Failed to load mood report:", err);
      setError("Ruh hali raporu yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const retry = async () => {
    await loadMoodReport();
  };

  useEffect(() => {
    loadMoodReport();
  }, []);

  return {
    data,
    isLoading,
    error,
    loadMoodReport,
    retry,
  };
}
