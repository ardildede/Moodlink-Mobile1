import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Post } from "../../core/domain/entities/Post";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  DrawerNavigator: undefined;
  UserProfile: { userId: string; userName?: string };
  PostDetails: { postId: string; post?: Post };
  ThemeSelection: undefined;
  ChangePassword: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Search: undefined;
  Notifications: undefined;
  DirectMessages: undefined;
  Profile: undefined;
  MentalHealthReport: undefined;
  Settings: undefined;
};

export type HomeTabParamList = {
  ForYou: undefined;
  Following: undefined;
};

// Auth ekranları için prop tipleri
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

// Main Stack
export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

// Drawer
export type HomeScreenProps = DrawerScreenProps<DrawerParamList, "Home">;

// Home Tabs (Top)
export type ForYouFeedScreenProps = CompositeScreenProps<
  MaterialTopTabScreenProps<HomeTabParamList, "ForYou">,
  DrawerScreenProps<DrawerParamList>
>;

export type FollowingFeedScreenProps = CompositeScreenProps<
  MaterialTopTabScreenProps<HomeTabParamList, "Following">,
  DrawerScreenProps<DrawerParamList>
>;

export type HomeDrawerParamList = DrawerParamList;
