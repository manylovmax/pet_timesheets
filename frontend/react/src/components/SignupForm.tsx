import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";
import AuthService from "../services/auth.service";

const authService = new AuthService();

export default function SignupForm() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const onFullnameChange = (value: string) => {
    setFullname(value);
  }
  const [email, setEmail] = useState('');
  const onEmailChange = (value: string) => {
    setEmail(value);
  }
  const [password, setPassword] = useState('');
  const onPasswordChange = (value: string) => {
    setPassword(value);
  }
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value);
  }

  const signup = async (): Promise<void>  => {
    if (password !== passwordRepeat) {
      alert("Passwords don't match.");
      return;
    }
    if (await authService.signup({password, email, fullname}))
      navigate('/records');
  }
  
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
      <div>Sign in</div>
      <InputComponent 
        label="Fullname"
        type="text"
        onInputChange={onFullnameChange}  
      />
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
      <InputComponent 
        label="Repeat password"
        type="password"
        onInputChange={onPasswordRepeatChange}  
      />
      <button 
        className="bg-green-300 rounded-2xl px-2 uppercase"
        onClick={signup}
      >submit
      </button>
      <NavLink
        to="/signin"
        className="underline"
      >Signin
      </NavLink>
    </div>
  )
}