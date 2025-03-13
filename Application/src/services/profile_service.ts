import { StatProfileProps } from "../models/stat";
import { ValidationErrors } from "../models/auth";
import { ProfileProps } from "../models/profile";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export class ProfileService {
  // ----------------------------------------- //
  // ---------getProfileCurrentUser----------- //
  // ----------------------------------------- //
  async getProfileCurrentUser(jwt: string): Promise<ProfileProps> {
    try {
      const response = await axios.get(`${API_BASE_URL}/myProfile`, {
        headers: { Authorization: API_KEY + ":" + jwt },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error while trying to get profile : ${error.message}`);
    }
  }

  // -------------------------------------- //
  // -----------getProfileStats------------ //
  // -------------------------------------- //
  async getProfileStats(jwt: string): Promise<Array<StatProfileProps>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/myStats`, {
        headers: { Authorization: API_KEY + ":" + jwt },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get profile stats : ${error.message}`
      );
    }
  }

  // ---------------------------------------- //
  // -----------submitProfileEdit------------ //
  // ---------------------------------------- //
  async submitProfileEdit(
    profileDatas: ProfileProps,
    jwt: string
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileDatas, {
        headers: {
          Authorization: API_KEY + ":" + jwt,
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(
        `Error while trying to update profile : ${error.message}`
      );
    }
  }

  // -------------------------------------- //
  // -----------validateProfile------------ //
  // -------------------------------------- //
  validateProfile(profileDatas: ProfileProps): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!profileDatas.avatar) {
      errors.avatar = "User must have an avatar";
    }
    if (!profileDatas.email) {
      errors.email = "Email adress is required";
    }
    if (!profileDatas.pseudo) {
      errors.username = "Username is required";
    }
    return errors;
  }
}
