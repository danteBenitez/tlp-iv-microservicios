// routes.d.ts
declare module './routes.js' {
  interface Route {
    path: string;
    name: string;
    component: React.ComponentType<any>;
    layout: string;
    isPrivate?: boolean;
    icon: string;
  }

  const routes: Route[];
  export default routes;
}