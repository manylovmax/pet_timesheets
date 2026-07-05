import config from "@/constants";
import axios, { AxiosError } from "axios";

export interface Tokens {
  access: string
  refresh: string
}

export class AuthService {
  async login(password: string, email: string): Promise<boolean> {
    const result = await axios.post(config.api.login, {email, password}).catch((error: AxiosError) => {
      console.error('Ошибка логина ' + error.message);
    });

    if (result?.data?.success) {
      localStorage.set(config.constants.accessTokenLSKey, result?.data?.access_token);
      localStorage.set(config.constants.refreshTokenLSKey, result?.data?.refresh_token);
      return true
    };

    return false;
  }

  async verify(accessToken: string): Promise<boolean> {
    try {
      const result = await axios.post(config.api.verify, {'access-token': accessToken});
      if (result?.status == 200) {
        return true;
      };
    } catch (error: unknown) {
      console.log('Ошибка логина ' + `${error}`);
    }

    return false;
  }
}


export default AuthService;