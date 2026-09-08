import apiClient from "../apiClient";
import config from "../constants";
import { Service } from "@angular/core";


export interface TimesheetsTask {
  id: number,
  user_id: number,
  project_id: number,
  title: string,
  description: string,
  code: string,
  deleted: boolean,
}


@Service()
export class TasksService {
  async getAll(): Promise<TimesheetsTask[]> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.tasks, {
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

  async create(props: {
    project_id: number,
    title: string,
    code: string,
    description: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.post(config.api.task,
      props,
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


  async delete(task_id: number): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.delete(config.api.task, {
      params: {
        task_id,
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

  async update(params: {
    task_id: number,
    title: string,
    description: string,
    code: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.patch(config.api.task, 
      params,
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

  async get(task_id: number): Promise<TimesheetsTask | null> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.task, {
      params: {
        task_id,
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


export default TasksService;
