import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";
import AuthService from "../services/auth.service";
import clsx from "clsx";

const authService = new AuthService();

export default function SignupForm() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [fullnameErrors, setFullnameErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!fullname)
      errors.push('Full name is required');
  
    setFullnameErrors(errors);
  }, [fullname]);
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!email)
      errors.push('Email is required');
  
    setEmailErrors(errors);
  }, [email]);
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!password)
      errors.push('Password is required');
  
    setPasswordErrors(errors);
  }, [password]);
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordRepeatErrors, setPasswordRepeatErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!passwordRepeat)
      errors.push('Password is required');

    if (passwordRepeat !== password)
      errors.push('Passwords don\'t match');
  
    setPasswordRepeatErrors(errors);
  }, [passwordRepeat, password]);


  const [isValid, setIsValid] = useState<boolean>(false);
  useEffect(() => {
    setIsValid(!(
      passwordErrors?.length || 
      passwordRepeatErrors?.length || 
      emailErrors?.length ||
      fullnameErrors?.length
    ));
  }, [passwordErrors, emailErrors, passwordRepeatErrors, fullnameErrors]);

  const signup = async (): Promise<void>  => {
    if (!isValid)
      return;

    if (await authService.signup({password, email, fullname}))
      navigate('/timetable');
  }
  
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
      <div>Sign up</div>
      <InputComponent 
        label="Full name"
        type="text"
        value={fullname}
        errors={fullnameErrors}
        onInputChange={value => setFullname(value)}  
      />
      <InputComponent 
        label="Email"
        type="email"
        value={email}
        errors={emailErrors}
        onInputChange={value => setEmail(value)}  
      />
      <InputComponent 
        label="Password"
        type="password"
        value={password}
        errors={passwordErrors}
        onInputChange={value => setPassword(value)}  
      />
      <InputComponent 
        label="Repeat password"
        type="password"
        value={passwordRepeat}
        errors={passwordRepeatErrors}
        onInputChange={value => setPasswordRepeat(value)}  
      />
      <div className="flex gap-4 justify-between w-full">
        <NavLink
          to="/signin"
          className="underline select-none cursor-pointer"
        >Sign in
        </NavLink>
        <div 
          className={clsx("select-none", {
            'underline': isValid,
            'cursor-pointer': isValid,
          })}
          onClick={signup}
        >Submit</div>
      </div>
    </div>
  )
}