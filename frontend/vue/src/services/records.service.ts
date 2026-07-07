import config from "@/constants";
import axios from "axios";

// Prevent Axios from throwing errors globally
axios.defaults.validateStatus = () => true;

interface TimesheetsRecord {
  id: number,
  user_id: number,
  minutes: number,
  date: string,
  deleted: boolean,
}

export class RecordsService {
  async getAllRecords(): Promise<TimesheetsRecord[]> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const userId = localStorage.getItem(config.constants.userIdLSKey);
    const result = await axios.get(config.api.records, {
      params: {
        userId,
      },
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('result', result);

    if (result?.data?.success) {
      return result?.data?.data;
    } else {
      alert(result?.data?.message);
    }

    return [];
  }

}


export default RecordsService;
