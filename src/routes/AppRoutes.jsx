import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Loader from "../components/common/loaders/Loader";

import Login from "../components/auth/login/Login";
// const Login = lazy(() => import("../components/auth/login/Login"));
const Register = lazy(() => import("../components/auth/register/Register"));
const ForgotPassword = lazy(() => import("../components/auth/forgot-password/ForgotPassword"));
const NotFound = lazy(() => import("../components/common/not-found/NotFound"));

import MainPage from "../pages/MainPage";
// const MainPage = lazy(() => import("../pages/MainPage"));
const Dashboard = lazy(() => import("../components/core/dashboard/Dashboard"));
const Problems = lazy(() => import("../components/core/problems/Problems"));
const Playground = lazy(() => import("../components/core/playground/Playground"));
const Solution = lazy(() => import("../components/core/solutions/Solution"));
const UserManagement = lazy(() => import("../components/admin/user-management/UserManagement"));

function AppRoutes() {
  const mainRoute = (
    <PrivateRoute>
      <MainPage />
    </PrivateRoute>
  );

  return (
    <Suspense fallback={<Loader></Loader>}>
      <Routes>
        <Route path="/" element={mainRoute}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="play-ground" element={<Playground />} />
          <Route path="problems" element={<Problems />}>
            {/* <Route index element={<ProblemList />} /> */}
          </Route>
          <Route path="solution/:problemId" element={<Solution />} />
          <Route
            path="user-management"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
