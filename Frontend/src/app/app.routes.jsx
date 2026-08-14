import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/auth/register", element: <Register /> },
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
]);
