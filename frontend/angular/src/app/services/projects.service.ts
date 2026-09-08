import apiClient from "../apiClient";
import config from "../constants";
import { Service } from "@angular/core";


export interface TimesheetsProject {
  id: number,
  user_id: number,
  title: string,
  description: string,
  code: string,
  deleted: boolean,
}


@Service()
export class ProjectsService {
  async getAll(): Promise<TimesheetsProject[]> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.projects, {
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
    title: string,
    code: string,
    description: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.post(config.api.project,
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


  async delete(project_id: number): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.delete(config.api.project, {
      params: {
        project_id,
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
    project_id: number,
    title: string,
    description: string,
    code: string,
  }): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.patch(config.api.project, 
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

  async get(project_id: number): Promise<TimesheetsProject | null> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    const result = await apiClient.get(config.api.project, {
      params: {
        project_id,
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


export default ProjectsService;
