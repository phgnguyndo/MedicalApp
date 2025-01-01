import * as React from "react";
import Paper from "@mui/material/Paper";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Avatar, Grid, Box } from "@mui/material";
import { mockDoctorsData } from "../../mockData";
import AddDoctorDialog from "./AddDoctorDialog";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { List } from "echarts";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
interface Doctor {
  name: string;
  hname: string;
  faculty: string;
  contract: string;
}
export default function DoctorList() {
  const [doctors, setDoctors] = React.useState<any>([]);
  const { contract, accountAddress } = React.useContext(AppContext);

  const handleDelete = (id: any) => {};

  const getAllDoctor = async () => {
    const res = await contract.methods.getAllDoctors().call();
    const { ids, names, hospitals, faculties, contacts, addresses } = res;
    console.log(res);
    const data = Array.isArray(ids)
      ? ids.map((item, index) => {
          return {
            address: addresses[index],
            name: names[index],
            hname: hospitals[index],
            faculty: faculties[index],
            contact: contacts[index],
          };
        })
      : [];
    setDoctors(data);
  };

  React.useEffect(() => {
    getAllDoctor();
  }, [contract]);

  const handleGrantAccess = async (address: any) => {
    try {
      const res = await contract.methods
        .grantAccess(address)
        .send({ from: accountAddress, gas: 3000000 });
      toast.success("Uỷ quyền điều trị thành công", {
        autoClose: 1000,
      });
    } catch (err) {
      toast.error("Uỷ quyền điều trị thất bại", {
        autoClose: 1000,
      });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Danh sách bác sĩ" />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container sx={{ mt: 4, mb: 4 }}>
          <AddDoctorDialog doctors={doctors} setDoctors={setDoctors} />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="patient table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align="center">#</TableCell> */}
                    <TableCell>Tên bác sĩ</TableCell>
                    <TableCell>Bệnh viện</TableCell>
                    <TableCell>Khoa</TableCell>
                    <TableCell>Liên hệ</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.length > 0 &&
                    doctors.map((doctor: any, index: any) => (
                      <TableRow
                        key={index}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {/* <TableCell align="center">{doctor.id}</TableCell> */}

                        <TableCell>{doctor?.name || ""}</TableCell>
                        <TableCell>{doctor?.hname || ""}</TableCell>
                        <TableCell>{doctor?.faculty || ""}</TableCell>
                        <TableCell>{doctor?.contact || ""}</TableCell>
                        <TableCell>
                          <DeleteOutlineOutlinedIcon
                            sx={{
                              color: "red",
                              cursor: "pointer",
                              marginRight: "5px",
                            }}
                            onClick={() => handleDelete(doctor.id)}
                          />
                          {localStorage.getItem("role") === "patient" && (
                            <HandshakeOutlinedIcon
                              sx={{
                                color: "rgb(102, 179, 255)",
                                cursor: "pointer",
                                marginRight: "5px",
                              }}
                              onClick={() => handleGrantAccess(doctor.address)}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
