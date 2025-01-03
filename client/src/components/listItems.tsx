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
    role: ["owner", "doctor", "patient"],
  },
  {
    link: "/profile",
    label: "Thông tin cá nhân",
    icon: <AccountCircleIcon />,
    role: ["owner", "doctor", "patient"],
  },
  {
    link: "/doctor-list",
    label: "Danh sách bác sĩ",
    icon: <PeopleIcon />,
    role: ["owner", "doctor", "patient"],
  },
  {
    link: "/patient-list",
    label: "Danh sách bệnh nhân",
    icon: <SickIcon />,
    role: ["owner", "doctor"],
  },
];
export const mainListItems = (
  <React.Fragment>
    {primarynavList.map((data: any, index: any) => {
      const role = localStorage.getItem("role");
      const check = data.role.includes(role);
      return (
        check && (
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
        )
      );
    })}
  </React.Fragment>
);
