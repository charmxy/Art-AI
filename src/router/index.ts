import { ComponentType, lazy } from "react";
const Task = lazy(() => import("@/pages/task"));

interface Route {
  path: string;
  component: ComponentType; 
}

export const routes: Route[] = [
  {
    path: "/",
    component: Task, 
  }, 
];

export default routes;
