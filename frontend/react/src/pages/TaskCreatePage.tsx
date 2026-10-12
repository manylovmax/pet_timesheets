import { NavLink, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import ProjectsService, { type TimesheetsProject } from "../services/projects.service";
import TextareaComponent from "../components/TextareaComponent";
import InputComponent from "../components/InputComponent";
import clsx from "clsx";
import TasksService from "../services/tasks.service";

const projectsService = new ProjectsService();
const tasksService = new TasksService();

export default function TaskCreatePage() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<TimesheetsProject | null>(null);

  useEffect(() => {
    const onInit = async (): Promise<void> => {
      const getPtojectResult = await projectsService.get(Number(id));
      if (getPtojectResult) {
        setProject(getPtojectResult);
      }
    };

    onInit();
  }, []);

  const [title, setTitle] = useState<string>('');
  const [titleErrors, setTitleErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!title)
      errors.push('Title is required');

    setTitleErrors(errors);
  }, [title]);

  const [code, setCode] = useState<string>('');
  const [codeErrors, setCodeErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!code)
      errors.push('Code is required');

    setCodeErrors(errors);
  }, [code]);

  const [isValid, setIsValid] = useState<boolean>(false);
  useEffect(() => {
    setIsValid(!(titleErrors.length || codeErrors.length));
  }, [titleErrors, codeErrors]);

  const [description, setDescription] = useState<string>('');


  const create = async (): Promise<void> => {
    if (isValid && project?.id) {
      const result = await tasksService.create({
        project_id: project?.id,
        title,
        code,
        description
      });
      if (result)
        navigate('/project/' + project?.id);
      }
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center w-[360px] sm:w-[400px]">
          <div>Create a task for project {project?.title}</div>
          <InputComponent
            label="Title"
            type="text"
            onInputChange={value => setTitle(value)}  
            value={title}
            errors={titleErrors}
          />
          <InputComponent
            label="Code"
            type="text"
            onInputChange={value => setCode(value)}
            value={code}  
            errors={codeErrors}
          />
          <TextareaComponent 
            label="Description"
            value={description}
            onChange={value => setDescription(value)}
          />

          <div className="flex gap-4 justify-between w-full">
            <NavLink
              to={"/project/" + project?.id}
              className="underline cursor-pointer"
            >To project
            </NavLink>
            <div 
              className={clsx("select-none", {
                'underline': isValid,
                'cursor-pointer': isValid,
              })}
              onClick={create}
            >Create</div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}