import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";
import { ActivityParticipation } from "../../domain/entities/ActivityParticipation";
import ActivityApi from "../datasources/remote/ActivityApi";
import { ActivityMapper } from "../mappers/ActivityMapper";
import { PageRequest } from "../dtos/PageRequest";

export class ActivityRepositoryImpl implements IActivityRepository {
  constructor(private activityApi: typeof ActivityApi) {}

  async create(activity: Activity): Promise<Activity> {
    const dto = ActivityMapper.toCreateDto(activity);
    const response = await this.activityApi.create(dto);
    return ActivityMapper.toEntity(response);
  }

  async update(activity: Activity): Promise<Activity> {
    const dto = ActivityMapper.toUpdateDto(activity);
    const response = await this.activityApi.update(dto);

    // Since the API response might not include all the activity details,
    // we merge the response with the original activity
    return {
      ...activity,
      name: response.name || activity.name,
      description: response.description || activity.description,
      eventTime: new Date(response.eventTime),
      location: response.location || activity.location,
      category: response.category || activity.category,
      targetMoodDescription:
        response.targetMoodDescription || activity.targetMoodDescription,
      updatedAt: new Date(), // Set current time as updatedAt
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.activityApi.delete(id);
    return true;
  }

  async getById(id: string): Promise<Activity> {
    const response = await this.activityApi.getById(id);
    return ActivityMapper.detailedToEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    const pageRequest: PageRequest = { pageIndex: page, pageSize };
    const response = await this.activityApi.getList(pageRequest);

    return {
      items: response.items.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: response.totalCount || 0, // Use response.totalCount instead of count
      totalPages: response.totalCount
        ? Math.ceil(response.totalCount / pageSize)
        : 0, // Calculate pages from totalCount
    };
  }

  async getUserActivities(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    // Since getUserActivities doesn't exist in ActivityApi,
    // we'll use getList and filter on client side (or implement server filtering)
    const pageRequest: PageRequest = { pageIndex: page, pageSize };
    const response = await this.activityApi.getList(pageRequest);

    // Filter activities by userId
    const userActivities = response.items.filter(
      (item) => item.createdByUserId === userId
    );

    return {
      items: userActivities.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: userActivities.length,
      totalPages: Math.ceil(userActivities.length / pageSize),
    };
  }

  async getRecommendedActivities(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    // Since getRecommendedActivities doesn't exist in ActivityApi,
    // we'll use getList as fallback (or implement server endpoint)
    const pageRequest: PageRequest = { pageIndex: page, pageSize };
    const response = await this.activityApi.getList(pageRequest);

    return {
      items: response.items.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: response.totalCount || 0,
      totalPages: response.totalCount
        ? Math.ceil(response.totalCount / pageSize)
        : 0,
    };
  }

  // Note: These methods are placeholders; actual implementation would depend on
  // the ActivityParticipation API endpoints which weren't fully detailed
  async participateInActivity(
    activityId: string,
    userId: string
  ): Promise<ActivityParticipation> {
    // This would typically call an API endpoint to join an activity
    return {
      id: "",
      activityId,
      userId,
      joinedAt: new Date(),
    };
  }

  async leaveActivity(activityId: string, userId: string): Promise<boolean> {
    // This would typically call an API endpoint to leave an activity
    return true;
  }
}
