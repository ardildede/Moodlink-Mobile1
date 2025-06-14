import ApiService from "./ApiService";
import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import {
  CreateFollowCommand,
  CreatedFollowResponse,
  UpdateFollowCommand,
  UpdatedFollowResponse,
  DeletedFollowResponse,
  GetByIdFollowResponse,
  GetListFollowResponse,
  GetFollowingApiResponse,
  DeleteFollowCommand,
} from "../../dtos/FollowDto";

const FollowApi = {
  create: async (
    command: CreateFollowCommand
  ): Promise<CreatedFollowResponse> => {
    const { data } = await ApiService.post<CreatedFollowResponse>(
      API_ENDPOINTS.FOLLOWS,
      command
    );
    return data;
  },

  followUser: async (command: CreateFollowCommand): Promise<any> => {
    const { data } = await ApiService.post(API_ENDPOINTS.FOLLOWS, command);
    return data;
  },

  unfollowUser: async (command: DeleteFollowCommand): Promise<any> => {
    const { data } = await ApiService.delete(API_ENDPOINTS.FOLLOWS, {
      data: command,
    });
    return data;
  },

  unfollowById: async (followId: string): Promise<DeletedFollowResponse> => {
    const { data } = await ApiService.delete<DeletedFollowResponse>(
      API_ENDPOINTS.FOLLOW_BY_ID(followId)
    );
    return data;
  },

  update: async (
    command: UpdateFollowCommand
  ): Promise<UpdatedFollowResponse> => {
    const { data } = await ApiService.put<UpdatedFollowResponse>(
      API_ENDPOINTS.FOLLOWS,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedFollowResponse> => {
    const { data } = await ApiService.delete<DeletedFollowResponse>(
      API_ENDPOINTS.FOLLOW_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdFollowResponse> => {
    const { data } = await ApiService.get<GetByIdFollowResponse>(
      API_ENDPOINTS.FOLLOW_BY_ID(id)
    );
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListFollowResponse> => {
    const { data } = await ApiService.get<GetListFollowResponse>(
      API_ENDPOINTS.FOLLOWS,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },

  getFollowing: async (
    userId: string,
    pageRequest: PageRequest
  ): Promise<GetFollowingApiResponse> => {
    console.log("FollowApi.getFollowing called with:");
    console.log("- userId:", userId);
    console.log("- pageRequest:", pageRequest);

    const url = API_ENDPOINTS.GET_FOLLOWING(userId);
    console.log("- API URL:", url);

    try {
      // İlk önce query parametre olmadan deneyelim (kullanıcının curl isteği gibi)
      console.log("🔍 Trying without query parameters first...");
      const { data } = await ApiService.get<GetFollowingApiResponse>(url);

      console.log("FollowApi.getFollowing response (no params):");
      console.log("- Raw response data:", JSON.stringify(data, null, 2));
      console.log("- Following count:", data?.totalFollowingCount);
      console.log("- Following array length:", data?.following?.length);

      return data;
    } catch (error) {
      console.error("❌ API call failed (no params):", error);

      // Parametre olmadan çalışmadıysa parametreli deneyelim
      console.log("🔍 Trying with query parameters...");
      try {
        const params = {
          PageIndex: pageRequest.pageIndex,
          PageSize: pageRequest.pageSize,
        };
        console.log("- Query params:", params);

        const { data } = await ApiService.get<GetFollowingApiResponse>(url, {
          params,
        });

        console.log("FollowApi.getFollowing response (with params):");
        console.log("- Raw response data:", JSON.stringify(data, null, 2));
        console.log("- Following count:", data?.totalFollowingCount);
        console.log("- Following array length:", data?.following?.length);

        return data;
      } catch (secondError) {
        console.error("❌ API call failed (with params):", secondError);
        throw secondError;
      }
    }
  },
};

export default FollowApi;
