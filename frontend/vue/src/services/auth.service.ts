import config from "@/constants";
import axios, { AxiosError } from "axios";

// Prevent Axios from throwing errors globally
axios.defaults.validateStatus = () => true;

export interface Tokens {
  access: string
  refresh: string
}

export class AuthService {
  async signin(password: string, email: string): Promise<boolean> {
    const result = await axios.post(config.api.login, {email, password});

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
      const result = await axios.post(config.api.verify, undefined, 
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
      console.log('Verify error: ' + `${error}`);
    }

    return false;
  }


  async signup(props: {
    password: string, 
    email: string,
    fullname: string,
  }): Promise<boolean> {
    const result = await axios.post(config.api.signup, props);

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
      const result = await axios.post(config.api.logout, undefined, 
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
}


export default AuthService;