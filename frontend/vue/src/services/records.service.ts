import config from "@/constants";
import axios from "axios";

// Prevent Axios from throwing errors globally
axios.defaults.validateStatus = () => true;

export interface TimesheetsRecord {
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

    if (result?.data?.success) {
      return result?.data?.data;
    } else {
      alert(result?.data?.message);
    }

    return [];
  }

  async createRecord(props: {
    minutes: number,
    date: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const userId = localStorage.getItem(config.constants.userIdLSKey);
    const result = await axios.post(config.api.record,
      {
        'user_id': userId,
        'minutes': props.minutes,
        'date': props.date,
      },
      {
        headers: {
          'access-token': accessToken,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!result?.data?.success && result?.status === 200) {
      alert(result?.data?.message);
    } else if (result?.status === 422) {
      alert('Validation error');
    }

    return result?.data?.success;
  }


  async deleteRecord(recordId: number): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const userId = localStorage.getItem(config.constants.userIdLSKey);
    const result = await axios.delete(config.api.record, {
      params: {
        record_id: recordId,
        user_id: userId,
      },
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!result?.data?.success) 
      alert(result?.data?.message);

    return result?.data?.success;
  }

}


export default RecordsService;
