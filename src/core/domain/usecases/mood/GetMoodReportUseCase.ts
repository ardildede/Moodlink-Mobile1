import { IMoodReportRepository } from "../../repositories/IMoodReportRepository";
import { MoodReport } from "../../entities/MoodReport";

export class GetMoodReportUseCase {
  constructor(private moodReportRepository: IMoodReportRepository) {}

  async execute(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<MoodReport> {
    if (pageIndex < 0) {
      throw new Error("Page index cannot be negative");
    }

    if (pageSize <= 0) {
      throw new Error("Page size must be greater than 0");
    }

    return this.moodReportRepository.getMoodReport(pageIndex, pageSize);
  }
}
