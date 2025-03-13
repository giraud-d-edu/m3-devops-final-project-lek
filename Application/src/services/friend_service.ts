import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
export class FriendService {
  // ------------------------------------ //
  // -----------requestFriend------------ //
  // ------------------------------------ //
  async requestFriend(username: string, jwt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/requestFriend`,
        { username: username.trim() },
        { headers: { Authorization: API_KEY + ":" + jwt } }
      );
      if (response) {
        return "Friend request sended !";
      }
      return "Coundn't send the request";
    } catch (error: any) {
      return "Coundn't send the request";
    }
  }

  // -------------------------------------------- //
  // -----------getFriendsAndRequests------------ //
  // -------------------------------------------- //
  async getFriendsAndRequests(jwt: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/myFriend`, {
        headers: { Authorization: API_KEY + ":" + jwt },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Error while trying to get friends : ${error.message}`);
    }
  }

  // ------------------------------------------ //
  // -----------acceptFriendRequest------------ //
  // ------------------------------------------ //
  async acceptFriendRequest(requestId: string, jwt: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/acceptFriendRequest`,
        { requestId: requestId.toString() },
        {
          headers: { Authorization: `${API_KEY}:${jwt}` },
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(`Error while trying to accept friend : ${error.message}`);
    }
  }

  // ------------------------------------------ //
  // -----------refuseFriendRequest------------ //
  // ------------------------------------------ //
  async refuseFriendRequest(requestId: string, jwt: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/refuseFriendRequest`,
        { requestId: requestId.toString() },
        {
          headers: { Authorization: `${API_KEY}:${jwt}` },
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(`Error while trying to refuse friend : ${error.message}`);
    }
  }
}
