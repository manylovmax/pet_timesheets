import type { TableColumn } from "../components/TableComponent";
import { useState, useEffect } from 'react';
import TableComponent from "../components/TableComponent";
import { NavLink, useParams } from "react-router";
import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import { ProjectsService, type TimesheetsProject } from "../services/projects.service";
import { minutesToString } from "../utils/time";
import { TasksService, type TimesheetsTask } from "../services/tasks.service";

const projectsService = new ProjectsService();
const tasksService = new TasksService();

const columns: Array<TableColumn> = [
  {
    label: 'Title',
    attribute: 'title',
  },
  {
    label: 'Code',
    attribute: 'code',
  },
  {
    label: 'Description',
    attribute: 'description',
  },
  {
    label: 'Spent time',
    attribute: 'spent_time',
  },
];

export default function ProjectPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<TimesheetsProject | null>(null);
  const [tasks, setTasks] = useState<TimesheetsTask[]>([]);
  const mapTasks = (projects: TimesheetsTask[]): Record<string, string>[] => {
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
      const getPtojectResult = await projectsService.get(Number(id));
      if (getPtojectResult) {
        setProject(getPtojectResult);
        const getAllForPtojectResult = await tasksService.getAllForProject(getPtojectResult?.id);
        setTasks(getAllForPtojectResult);
        setRows(mapTasks(getAllForPtojectResult));
      }
    };

    onInit();
  }, []);

  const deleteTask = async function(index: number) {
    if (await tasksService.delete(tasks[index].id) && project?.id) {
      const result = await tasksService.getAllForProject(project?.id);
      setTasks(result);
      setRows(mapTasks(result));
    }
  }

  const updateTask = function(index: number) {
    navigate('/project/' + project?.id +'/update-task/' + tasks[index]?.id);
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex place-items-end gap-4">
          <div>Project</div>
          <div className="flex place-items-end gap-4">
            <div className="text-2xl">{ project?.title }</div>
            <div>({ project?.code })</div>
          </div>
        </div>
        <div >{ project?.description }</div>
        <NavLink
          to={"/project/" + project?.id + "/create-task"}
          className="underline cursor-pointer"
        >Create task
        </NavLink>
        <div>Tasks</div>
        <TableComponent
          columns={columns}
          rows={rows}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </MainLayout>
  );
}