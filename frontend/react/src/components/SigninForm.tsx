import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";
import AuthService from "../services/auth.service";

const authService = new AuthService();

export default function SigninForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const onEmailChange = (value: string) => {
    setEmail(value);
  }
  const [password, setPassword] = useState('');
  const onPasswordChange = (value: string) => {
    setPassword(value);
  }

  const login = async (): Promise<void>  => {
    if (await authService.signin(password, email))
      navigate('/records');
  }
  
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
      <div>Sign in</div>
      <InputComponent 
        label="Email"
        type="email"
        onInputChange={onEmailChange}  
      />
      <InputComponent 
        label="Password"
        type="password"
        onInputChange={onPasswordChange}  
      />
      <button 
        className="bg-green-300 rounded-2xl px-2 uppercase"
        onClick={login}
      >submit
      </button>
      <NavLink
        to="/signup"
        className="underline"
      >Signup
      </NavLink>
    </div>
  )
}