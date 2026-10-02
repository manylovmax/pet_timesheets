import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";
import AuthService from "../services/auth.service";
import clsx from "clsx";

const authService = new AuthService();

export default function SigninForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const onEmailChange = (value: string) => {
    setEmail(value);
  }
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!email)
      errors.push('Email is required');
  
    setEmailErrors(errors);
  }, [email]);

  const [password, setPassword] = useState('');
  const onPasswordChange = (value: string) => {
    setPassword(value);
  }
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!password)
      errors.push('Password is required');
  
    setPasswordErrors(errors);
  }, [password]);

  const [isValid, setIsValid] = useState<boolean>(false);
  useEffect(() => {
    setIsValid(!(passwordErrors?.length || emailErrors?.length));
  }, [passwordErrors, emailErrors]);

  const login = async (): Promise<void>  => {
    if (!isValid)
      return;

    if (await authService.signin(password, email))
      navigate('/records');
  }
  
  return (
<div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
  <div>Sign in</div>
  <InputComponent 
    value={email}
    label="Email"
    type="email"
    onInputChange={onEmailChange}  
    errors={emailErrors}
  />
  <InputComponent
    value={password} 
    label="Password"
    type="password"
    onInputChange={onPasswordChange}
    errors={passwordErrors}  
  />

  <div className="flex gap-4 justify-between w-full">
    <NavLink
      to="/signup"
      className="underline select-none cursor-pointer"
    >Sign up
    </NavLink>
    <div 
      className={clsx("select-none", {
        'underline': isValid,
        'cursor-pointer': isValid,
      })}
      onClick={login}
    >Submit</div>
  </div>
</div>
  )
}