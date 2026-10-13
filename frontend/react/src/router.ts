import { createBrowserRouter, createContext, redirect, type LoaderFunctionArgs } from "react-router";
import AuthService, { type User } from "./services/auth.service";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import RecordCreatePage from "./pages/RecordCreatePage";
import TimetablePage from "./pages/TimetablePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectUpdatePage from "./pages/ProjectUpdatePage";
import ProjectCreatePage from "./pages/ProjectCreatePage";
import ProjectPage from "./pages/ProjectPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskUpdatePage from "./pages/TaskUpdatePage";

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
      path: "/signin",
      Component: SigninPage,
    },
    {
      path: "/signup",
      Component: SignupPage,
    },
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
      path: "/projects",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: ProjectsPage,
    },
    {
      path: "/project/create",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: ProjectCreatePage,
    },
    {
      path: "/project/:id/update",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: ProjectUpdatePage,
    },
    {
      path: "/project/:id",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: ProjectPage,
    },
    {
      path: "/project/:id/create-task",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: TaskCreatePage,
    },
    {
      path: "/project/:id/update-task/:taskId",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: TaskUpdatePage,
    },
    {
      path: "/record/create",
      middleware: [authMiddleware],
      loader: userLoader,
      Component: RecordCreatePage,
    },
  ]
);
export default router;