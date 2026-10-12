import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import ProjectsService from "../services/projects.service";
import TextareaComponent from "../components/TextareaComponent";
import InputComponent from "../components/InputComponent";
import clsx from "clsx";

const projectsService = new ProjectsService();

export default function ProjectCreatePage() {
  const navigate = useNavigate();

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
    if (isValid) {
      const result = await projectsService.create({
        title,
        code,
        description
      });
      if (result)
        navigate('/projects');
      }
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center w-[360px] sm:w-[400px]">
          <div>Create a project</div>
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
              to="/projects"
              className="underline cursor-pointer"
            >To projects
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