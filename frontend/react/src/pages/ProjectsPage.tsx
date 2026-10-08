import type { TableColumn } from "../components/TableComponent";
import { useState, useEffect } from 'react';
import TableComponent from "../components/TableComponent";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import { ProjectsService, type TimesheetsProject } from "../services/projects.service";
import { minutesToString } from "../utils/time";

const projectsService = new ProjectsService();
const columns: Array<TableColumn> = [
  {
    label: 'Title',
    attribute: 'title',
  },
  {
    label: 'Spent time',
    attribute: 'spent_time',
  },
  {
    label: 'Comment',
    attribute: 'comment',
  },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TimesheetsProject[]>([]);
  const mapProjects = (projects: TimesheetsProject[]): Record<string, string>[] => {
      return projects.map(p => ({
      'id': `${p.id}`,
      'user_id': `${p.user_id}`,
      'code': p.code,
      'title': p.title,
      'description': p.description,
      'spent_time': minutesToString(p.total_minutes ?? 0), 
    }));
  };
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  
  useEffect(() => {
    const onInit = async (): Promise<void> => {
      const result = await projectsService.getAll();
      setProjects(result);
      setRows(mapProjects(result));
    };

    onInit();
  }, []);

  const deleteProject = async function(index: number) {
    if (await projectsService.delete(projects[index].id)) {
      const result = await projectsService.getAll();
      setProjects(result);
      setRows(mapProjects(result));
    }
  }

  const updateProject = function(index: number) {
    navigate('/project/' + index +'/update');
  }
  
  const openProjectPage = function(index: number) {
    navigate('/project/' + index);
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex place-items-end gap-4">
          <div className="text-2xl">Projects</div>
          <NavLink
            to="/project/create"
            className="underline"
          >Create
          </NavLink>
        </div>
        <TableComponent
          columns={columns}
          openObjectPageColumnAttribute="title"
          rows={rows}
          onDelete={deleteProject}
          onUpdate={updateProject}
          onOpen={openProjectPage}
        />
      </div>
    </MainLayout>
  );
}