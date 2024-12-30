import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SickIcon from "@mui/icons-material/Sick";

const primarynavList = [
  {
    link: "/dashboard",
    label: "Thống kê",
    icon: <DashboardIcon />,
  },
  {
    link: "/profile",
    label: "Thông tin cá nhân",
    icon: <AccountCircleIcon />,
  },
  {
    link: "/doctor-list",
    label: "Danh sách bác sĩ",
    icon: <PeopleIcon />,
  },
  {
    link: "/patient-list",
    label: "Danh sách bệnh nhân",
    icon: <SickIcon />,
  },
  // {
  //   link: "/appointments",
  //   label: "Appointments",
  //   icon: <BookOnlineIcon />,
  // },
  // {
  //   link: "/calender",
  //   label: "Calender",
  //   icon: <CalendarMonthIcon />,
  // },
  // {
  //   link: "/kanban",
  //   label: "Kanban",
  //   icon: <ViewKanbanIcon />,
  // },
  // {
  //   link: "/account",
  //   label: "Account",
  //   icon: <ManageAccountsIcon />,
  // },
];
export const mainListItems = (
  <React.Fragment>
    {primarynavList.map((data: any, index: any) => (
      <Link
        key={index}
        to={data.link}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>{data.icon}</ListItemIcon>
          <ListItemText primary={data.label} />
        </ListItemButton>
      </Link>
    ))}
  </React.Fragment>
);

