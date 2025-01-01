import React, { useEffect } from "react";
import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  TablePagination,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AddPatientDialog from "./AddPatientDialog";
import { mockPatientData } from "../../mockData";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function PatientList({ data }: any) {
  const { contract, accountAddress } = useContext(AppContext);
  const [patients, setPatients] = React.useState<any>([]);
  const navigate = useNavigate();
  const [searchedPatients, setSearchedPatients] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChange = (e: any) => {
    const data: any = patients.filter((item: any) =>
      item.fullName.toLowerCase().match(e.target.value)
    );
    setSearchedPatients(data);
    setPage(0); // Reset page to the first page when searching
  };

  const patientList = searchedPatients.length > 0 ? searchedPatients : patients;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to the first page when changing rows per page
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, patientList.length - page * rowsPerPage);

  const handleEdit = (id: any) => {
    navigate(`/patient-info/${id}`);
  };

  const handleDelete = async (id: any) => {
    // const updatedPatients = patients.filter((patient: any) => patient.id!== id);
    // setPatients(updatedPatients);
    await contract?.methods.deleteRecord(id).send({ from: accountAddress });
  };

  const getAllPatient = async () => {
    if (contract) {
      const res = await contract?.methods.getAllPatients().call();
      const { ids, names, phones, genders, dobs, bloodgroups, addresses } = res;
      console.log(addresses);
      const data = Array.isArray(ids)
        ? ids.map((item, index) => {
            return {
              id: item,
              name: names[index],
              phone: phones[index],
              gender: genders[index],
              dob: dobs[index],
              bloodgroup: bloodgroups[index],
              address: addresses[index],
            };
          })
        : [];
      setPatients(data);
    }
  };

  useEffect(() => {
    getAllPatient();
  }, [contract]);

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Danh sách bệnh nhân" />
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
          {/* <AddPatientDialog
            patients={patients}
            setPatients={setPatients}
            handleChange={handleChange}
          /> */}
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="patient table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell>Tên bệnh nhân</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Nhóm máu</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? patientList.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : patientList
                  ).map((patient: any, index: any) => (
                    <TableRow
                      key={index}
                      // component={Link}
                      // to={`/patient-info/${patient.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <TableCell align="center">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.dob}</TableCell>
                      <TableCell>{patient.bloodgroup}</TableCell>
                      <TableCell>
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            color: "red",
                            cursor: "pointer",
                            marginRight: "5px",
                          }}
                          onClick={() => handleDelete(patient.id)}
                        />
                        <BorderColorOutlinedIcon
                          sx={{
                            color: "rgb(102, 179, 255)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEdit(patient.address)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={patientList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default PatientList;
