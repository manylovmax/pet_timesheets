import config from "@/constants";
import axios from "axios";

export interface Tokens {
  access: string
  refresh: string
}

export class AuthService {
  async login(password: string, email: string): Promise<Tokens> {
    const result = await axios.post(config.api.login, {

    })
  }
}


export default AuthService;