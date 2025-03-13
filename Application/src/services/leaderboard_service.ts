import { LeaderboardProps } from "../models/leaderboard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export class LeaderboardService {
  // ------------------------------------------- //
  // -----------getLimitsLeaderboard------------ //
  // ------------------------------------------- //
  async getLimitsLeaderboard(
    category: string,
    jwt: string
  ): Promise<LeaderboardProps> {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard/${category}`, {
        headers: { Authorization: API_KEY + ":" + jwt },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get limits of leaderboard : ${error.message}`
      );
    }
  }

  // ----------------------------------------------------- //
  // -----------getFriendLeaderboardWithLimits------------ //
  // ----------------------------------------------------- //
  async getFriendLeaderboardWithLimits(
    category: string,
    jwt: string,
    min: number,
    max: number
  ): Promise<LeaderboardProps> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/leaderBoardWithFriendWithLimit/${category}`,
        {
          headers: { Authorization: API_KEY + ":" + jwt },
          params: {
            limitMin: min.toString(),
            limitMax: max.toString(),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get leaderboard with limits stats : ${error.message}`
      );
    }
  }

  // ----------------------------------------------------- //
  // -----------getFriendLeaderboardWithLimits------------ //
  // ----------------------------------------------------- //
  async getFriendLimitsLeaderboard(
    category: string,
    jwt: string
  ): Promise<LeaderboardProps> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/leaderboardWithFriend/${category}`,
        {
          headers: { Authorization: API_KEY + ":" + jwt },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get limits of leaderboard : ${error.message}`
      );
    }
  }

  // ----------------------------------------------- //
  // -----------getLeaderboardWithLimits------------ //
  // ----------------------------------------------- //
  async getLeaderboardWithLimits(
    category: string,
    jwt: string,
    min: number,
    max: number
  ): Promise<LeaderboardProps> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/leaderBoardWithLimit/${category}`,
        {
          headers: { Authorization: API_KEY + ":" + jwt },
          params: {
            limitMin: min.toString(),
            limitMax: max.toString(),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get leaderboard with limits stats : ${error.message}`
      );
    }
  }
}
