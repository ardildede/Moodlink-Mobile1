import { MoodReport } from "../entities/MoodReport";

export interface IMoodReportRepository {
  /**
   * Gets mood-based recommended activities report
   */
  getMoodReport(pageIndex: number, pageSize: number): Promise<MoodReport>;
}
