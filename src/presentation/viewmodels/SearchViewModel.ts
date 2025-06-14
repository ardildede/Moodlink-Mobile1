import { useState } from "react";
import { User } from "../../core/domain/entities/User";

export interface SearchViewModelState {
  searchQuery: string;
  activeTab: "users" | "posts";
  users: User[];
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: "users" | "posts") => void;
  handleFollow: (userId: string) => void;
}

export const useSearchViewModel = (): SearchViewModelState => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "ahmet@example.com",
      userName: "ahmet_y",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      bio: "Yazılım geliştirici | Müzik tutkunu 🎵",
      createdDate: new Date(),
      followers: 1250,
      following: 150,
      isFollowing: false,
      moodCompatibility: "85%",
    },
    {
      id: "2",
      email: "zeynep@example.com",
      userName: "zeynep_k",
      firstName: "Zeynep",
      lastName: "Kaya",
      bio: "Sanat ve tasarım | Yaratıcılık ✨",
      createdDate: new Date(),
      followers: 890,
      following: 200,
      isFollowing: true,
      moodCompatibility: "92%",
    },
    {
      id: "3",
      email: "mehmet@example.com",
      userName: "mehmet_c",
      firstName: "Mehmet",
      lastName: "Çelik",
      bio: "Doğa fotoğrafları | Seyahat 📸",
      createdDate: new Date(),
      followers: 2100,
      following: 300,
      isFollowing: false,
      moodCompatibility: "78%",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollow = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followers: user.isFollowing
                ? user.followers - 1
                : user.followers + 1,
            }
          : user
      )
    );
  };

  return {
    searchQuery,
    activeTab,
    users: filteredUsers,
    setSearchQuery,
    setActiveTab,
    handleFollow,
  };
};
