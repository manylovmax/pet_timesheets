import apiClient from "../apiClient";
import config from "../constants";
import { Service } from "@angular/core";


export interface TimesheetsRecord {
  id: number,
  user_id: number,
  minutes: number,
  date: string,
  comment: string,
  deleted: boolean,
}


@Service()
export class RecordsService {
  async getAllRecords(): Promise<TimesheetsRecord[]> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.records, {
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
    comment: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.post(config.api.record,
      {
        'minutes': props.minutes,
        'date': props.date,
        'comment': props.comment,
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
    const result = await apiClient.delete(config.api.record, {
      params: {
        record_id: recordId,
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

  async updateRecord(params: {
    recordId: number,
    minutes: number,
    date: string,
    comment: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.patch(config.api.record, 
      {
        record_id: params.recordId,
        minutes: params.minutes,
        date: params.date,
        comment: params.comment,
      },
      {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!result?.data?.success) 
      alert(result?.data?.message);

    return result?.data?.success;
  }

  async getRecord(recordId: number): Promise<TimesheetsRecord | null> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.record, {
      params: {
        recordId,
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

    return null;
  }

}


export default RecordsService;
