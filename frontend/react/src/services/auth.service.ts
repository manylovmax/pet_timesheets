import config from "../constants";
import apiClient from "../apiClient";


export interface Tokens {
  access: string
  refresh: string
}

export interface User {
  id: number,
  email: string,
  fullname: string,
}


export class AuthService {
  async signin(password: string, email: string): Promise<boolean> {
    const result = await apiClient.post(config.api.login, {email, password});

    if (result?.data?.success) {
      localStorage.setItem(config.constants.accessTokenLSKey, result?.data?.access_token);
      localStorage.setItem(config.constants.refreshTokenLSKey, result?.data?.refresh_token);
      return true
    } else {
      alert(result?.data?.message);
    }

    return false;
  }

  async verify(): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    try {
      const result = await apiClient.get(config.api.verify, 
        {
          headers: {
            'access-token': accessToken,
            'Content-Type': 'application/json'
          }
      });
      if (result?.status == 200) {
        return true;
      };
    } catch (error: unknown) {
      console.error('Verify error: ' + `${error}`);
    }

    return false;
  }

  async signup(props: {
    password: string, 
    email: string,
    fullname: string,
  }): Promise<boolean> {
    const result = await apiClient.post(config.api.signup, props);

    if (result?.data?.success) {
      localStorage.setItem(config.constants.accessTokenLSKey, result?.data?.access_token);
      localStorage.setItem(config.constants.refreshTokenLSKey, result?.data?.refresh_token);
      return true
    } else {
      alert(result?.data?.message);
    }

    return false;
  }

  async signout(): Promise<boolean> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
    try {
      const result = await apiClient.post(config.api.logout, undefined, 
        {
          headers: {
            'access-token': accessToken,
            'Content-Type': 'application/json'
          }
      });
      if (result?.status == 200) {
        return true;
      };
    } catch (error: unknown) {
      console.error('Signout error: ' + `${error}`);
    }

    return false;
  }

  async self(): Promise<User | null> {
    const accessToken = localStorage.getItem(config.constants.accessTokenLSKey);
      const result = await apiClient.get(config.api.self, 
        {
          headers: {
            'access-token': accessToken,
            'Content-Type': 'application/json'
          }
      });
      if (result?.status == 200) {
        return result?.data?.data;
      } else {
        alert(result?.data?.message);
      }

    return null;
  }
}


export default AuthService;