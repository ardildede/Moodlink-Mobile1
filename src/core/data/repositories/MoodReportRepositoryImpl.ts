import { IMoodReportRepository } from "../../domain/repositories/IMoodReportRepository";
import { MoodReport } from "../../domain/entities/MoodReport";
import MoodApi from "../datasources/remote/MoodApi";
import { MoodMapper } from "../mappers/MoodMapper";

export class MoodReportRepositoryImpl implements IMoodReportRepository {
  constructor(private moodApi: typeof MoodApi) {}

  async getMoodReport(
    pageIndex: number,
    pageSize: number
  ): Promise<MoodReport> {
    const response = await this.moodApi.getMoodReport(pageIndex, pageSize);
    return MoodMapper.toEntity(response);
  }
}
