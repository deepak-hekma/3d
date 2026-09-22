import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router';
import { RootRoute } from './routes/__root';
import { IndexRoute } from './routes/index';
import { ConditionsLayout } from './routes/conditions';
import { ConditionsIndexRoute } from './routes/conditions.index';
import { CategoryDetailRoute } from './routes/conditions.$categoryId';
import { ConditionDetailRoute } from './routes/conditions.$categoryId.$conditionId';

// 1. Root Route
const rootRoute = createRootRoute({
  component: RootRoute,
});

// 2. Index Landing Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRoute,
});

// 3. Conditions Parent Layout Route
const conditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'conditions',
  component: ConditionsLayout,
});

// 4. Conditions Index (3D Atlas) Route
const conditionsIndexRoute = createRoute({
  getParentRoute: () => conditionsRoute,
  path: '/',
  component: ConditionsIndexRoute,
});

// 5. Category Detail Route
const categoryDetailRoute = createRoute({
  getParentRoute: () => conditionsRoute,
  path: '$categoryId',
  component: CategoryDetailRoute,
});

// 6. Condition Detail Route
const conditionDetailRoute = createRoute({
  getParentRoute: () => conditionsRoute,
  path: '$categoryId/$conditionId',
  component: ConditionDetailRoute,
});

// Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  conditionsRoute.addChildren([
    conditionsIndexRoute,
    categoryDetailRoute,
    conditionDetailRoute,
  ]),
]);

// Create Router instance
export const router = createRouter({ routeTree });

// Register router type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
