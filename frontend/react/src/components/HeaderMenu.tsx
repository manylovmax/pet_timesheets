import { NavLink } from "react-router";
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

<div className="flex justify-center">
  <div className="sm:px-16 max-w-[1920px] w-full">
    <div className="hidden sm:flex justify-between py-2 w-full place-items-end gap-4">
      <div className="flex gap-4 place-items-end">
        <NavLink
          to="/timetable"
          className="text-2xl"
        >Timesheets
        </NavLink>
        <NavLink
          to="/timetable"
          className="underline"
        >Timetable
        </NavLink>
        <NavLink
          to="/projects"
          className="underline"
        >Projects
        </NavLink>
      </div>
      <div
        className="cursor-pointer underline select-none"
        onClick={signout}>
        Sign out
      </div>
    </div>
    
    <div className="flex sm:hidden flex-col gap-4">
      <div className="flex gap-4 w-full place-items-end justify-between">
        <NavLink
          to="/timetable"
          className="text-2xl"
        >Timesheets
        </NavLink>
        <div
          className="cursor-pointer underline select-none"
          onClick={signout}>
          Sign out
        </div>
      </div>
      <div className="flex gap-4">
        <NavLink
          to="/timetable"
          className="underline"
        >Timetable
        </NavLink>
        <NavLink
          to="/projects"
          className="underline"
        >Projects
        </NavLink>
      </div>
    </div>
  </div>
</div>
  );
}