import { createBrowserRouter, createContext, redirect, type LoaderFunctionArgs } from "react-router";
import AuthService, { type User } from "./services/auth.service";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import RecordsPage from "./pages/RecordsPage";
import RecordCreatePage from "./pages/RecordCreatePage";
import RecordUpdatePage from "./pages/RecordUpdatePage";
import TestPage from "./pages/TestPage";
import TimetablePage from "./pages/TimetablePage";

export const userContext = createContext<User | null>(null);

const authService = new AuthService();

const authMiddleware = async ({ context }) => {
  const user = await authService.self();
  if (!user) {
    throw redirect("/signin");
  }
  context.set(userContext, user);
}

export async function userLoader({
  context,
}: LoaderFunctionArgs) {
  const user = context.get(userContext);
  return { user };
}


const router = createBrowserRouter([
    {
      path: "/",
      loader: () => redirect("/timetable"), 
    },
    {
      path: "/timetable",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: TimetablePage,
    },
    {
      path: "/signin",
      Component: SigninPage,
    },
    {
      path: "/signup",
      Component: SignupPage,
    },
    {
      path: "/record-create",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: RecordCreatePage,
    },
    {
      path: "/record-update/:id",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: RecordUpdatePage,
    },
    {
      path: "/test",
      Component: TestPage,
    },
  ]
);
export default router;