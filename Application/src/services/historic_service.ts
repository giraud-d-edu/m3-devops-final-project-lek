import { HistoricProps } from "../models/historic";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
export class HistoricService {
  // ------------------------------------------ //
  // -----------getHistoricGridShot------------ //
  // ------------------------------------------ //
  async getHistoricGridShot(
    jwt: string,
    limit: number
  ): Promise<HistoricProps> {
    try {
      const response = await axios.get(`${API_BASE_URL}/myGameGrid`, {
        headers: { Authorization: API_KEY + ":" + jwt },
        params: {
          numberOfLine: limit.toString(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get historic of gridshot : ${error.message}`
      );
    }
  }

  // ------------------------------------------ //
  // -----------getHistoricTracking------------ //
  // ------------------------------------------ //
  async getHistoricTracking(
    jwt: string,
    limit: number
  ): Promise<HistoricProps> {
    try {
      const response = await axios.get(`${API_BASE_URL}/myGameTracking`, {
        headers: { Authorization: API_KEY + ":" + jwt },
        params: {
          numberOfLine: limit.toString(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error while trying to get historic of gridshot : ${error.message}`
      );
    }
  }
}
