import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import SignUp from "./pages/Auth/SignUp";
import SignInSide from "./pages/Auth/SignInSide";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import DoctorList from "./pages/Profile/DoctorList";
import PatientInfo from "./pages/PatientInfo/PatientInfo";
import PatientList from "./pages/PatientInfo/PatientList";
import Account from "./pages/Account/Account";
import RegisterDoctor from "./pages/Settings/Settings";
import { mockPatientData } from "./mockData";
import SignUpPatient from "./pages/Auth/SignupPatient";
import DetailPatient from "./pages/PatientInfo/DetailPatient";

const USER_TYPES = {
  NORMAL_USER: "Normal User",
  ADMIN_USER: "Admin User",
};

const CURRENT_USER_TYPE = USER_TYPES.ADMIN_USER;

const AdminElement = ({ children }: any) => {
  const role = localStorage.getItem('role');
  if (role) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInSide />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <SignInSide />,
  },
  {
    path: "/signup",
    element: <SignUp type="doctor" />,
  },
  {
    path: "/signup-patient",
    element: <SignUpPatient type="patient" />,
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminElement>
        <Dashboard />
      </AdminElement>
    ),
  },
  {
    path: "/profile",
    element: (
      <AdminElement>
        <Profile />
      </AdminElement>
    ),
  },
  {
    path: "/patient-info/:id",
    element: (
      <AdminElement>
        {/* <PatientInfo patients={mockPatientData} /> */}
        <DetailPatient />
      </AdminElement>
    ),
  },
  {
    path: "/patient-list",
    element: (
      <AdminElement>
        <PatientList data={mockPatientData} />
      </AdminElement>
    ),
  },
  {
    path: "/doctor-list",
    element: (
      <AdminElement>
        <DoctorList />
      </AdminElement>
    ),
  },
  // {
  //   path: "/register-doctor",
  //   element: (
  //     <AdminElement>
  //       <RegisterDoctor />
  //     </AdminElement>
  //   ),
  // },
]);
