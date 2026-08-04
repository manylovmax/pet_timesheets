import { LogOut } from 'lucide-react';
import AuthService from '../services/auth.service';
import { useNavigate } from "react-router";

const authService = new AuthService();


export default function HeaderMenu() {
  const navigate = useNavigate();

  const signout = async (): Promise<void> => {
    if (await authService.signout())
      navigate('/signin');
  }

  return (
    <div className="flex justify-between w-full px-16 py-2">
      <div className="text-2xl">Timesheets</div>
      <div
        className="cursor-pointer"
        onClick={signout}>
        <LogOut size="32" color="black" strokeWidth="1" />
      </div>
    </div>
  );
}