import React, { useEffect } from "react";
import { ProfileCard } from "./components/ProfileCard";
import { BaseLayout } from "../../layout/BaseLayout";
import { Navbar } from "../generalComponents/Navbar";
import { useAuth } from "../../providers/AuthProvider";

export const ProfilePage: React.FC = () => {
  const { user, accessToken } = useAuth();
  
  useEffect(() => {
    
      const checkRefreshSpotifyToken = async () => {
        if (!user || !accessToken) {
          return; // User or accessToken missing
        }
        try {
          const response = await fetch(`/api/spotify/refresh`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken,
            },
          });
          if (response.status === 404) {
            return;
          }
          if (!response.ok) {
            return;
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      checkRefreshSpotifyToken();
  }, [user, accessToken]);

  return (
    <BaseLayout>
      <Navbar />
      <ProfileCard />
    </BaseLayout>
  );
};
