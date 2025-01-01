import * as React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Avatar, Typography, Grid, Box, Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from "@mui/material";
import PatientInfo from "./PatientInfo";
import AddPatientRecordDialog from "./AddPatientRecordDialog";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ModalViewFile from "./ModalViewFile";

const infoData = [
  {
    icon: <EmailIcon />,
    title: "Email",
    value: "test@test.com",
  },
  {
    icon: <PhoneIcon />,
    title: "Contact no",
    value: "+11 123456789",
  },
  {
    icon: <PeopleIcon />,
    title: "Successful Patients",
    value: "200",
  },
  {
    icon: <MedicalServicesIcon />,
    title: "Experience",
    value: "10+ years",
  },
];

const profileData = {
  avatarUrl: "https://i.pravatar.cc/300",
  name: "Dr. John Doe",
  specialization: "Cardiologist",
  email: "john.doe@example.com",
  contactNo: "+1 123-456-7890",
  experience: "10 years",
  patients: "1000+",
  biography:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor velit eu orci aliquam ultrices. Etiam quis purus euismod, faucibus leo eu, vestibulum odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor velit eu orci aliquam ultrices. Etiam quis purus euismod, faucibus leo eu, vestibulum odio.",
};

export default function DetailPatient() {
  const { id } = useParams<{ id: string }>();
  const { contract, accountAddress } = React.useContext(AppContext);
  const [infoPatient, setInfoPatient] = React.useState<any>();
  const [patientRecord, setPatientRecord] = React.useState<any>([]);
  const [isOpenDetailRecord, setIsOpenDetailRecord] = React.useState(false);
  const handleCloseDetailReacord = () => {
    setIsOpenDetailRecord(false);
  };

  const getAllPatientRecord = async () => {
    try {
      console.log("check id", id);
      const res = await contract.methods.getAllPatientRecords(id).call();
      const { ids, dnames, ipfsHashes, reasons, visitedDates } = res;
      const data = Array.isArray(dnames)
        ? dnames.map((item, index) => {
            return {
              dname: dnames[index],
              reason: reasons[index],
              visitedDate: visitedDates[index],
            };
          })
        : [];

      setPatientRecord(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDetailPatient = async () => {
    try {
      const res = await contract.methods.getPatientDetails(id).call();
      const data = {
        name: res["_name"],
        gender: res["_gender"] === "male" ? "Nam" : "Nữ",
        phone: res["_phone"],
        dob: res["_dob"],
        address: id,
        bloodgroup: res["_bloodgroup"],
      };
      setInfoPatient(data);
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };
  React.useEffect(() => {
    getAllPatientRecord();
    getDetailPatient();
  }, [id]);

  const handleDownloadfile = (hash: any) => {};
  return (
    <Box sx={{ display: "flex" }}>
      <Appbar
        appBarTitle={`Thông tin chi tiết bệnh nhân #${
          infoPatient?.name || ""
        } `}
      />
      <ModalViewFile
        isOpen={isOpenDetailRecord}
        handleClose={handleCloseDetailReacord}
      />
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

        <Container sx={{ mt: 4, mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{
                  flexGrow: 0,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: 150,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid style={{ margin: "4px" }} spacing={3} container>
                            <Grid item xs={4}>
                              <Typography variant="body1">
                                <strong>Tên bệnh nhân:</strong>{" "}
                                {infoPatient?.name || ""}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              <Typography variant="body1">
                                <strong>Giới tính:</strong>{" "}
                                {infoPatient?.gender || ""}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              <Typography variant="body1">
                                <strong>Số điện thoại:</strong>{" "}
                                {infoPatient?.phone || ""}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              <Typography variant="body1">
                                <strong>Ngày sinh:</strong>{" "}
                                {infoPatient?.dob || ""}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              <Typography variant="body1">
                                <strong>Nhóm máu:</strong>{" "}
                                {infoPatient?.bloodgroup || ""}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex" }}>
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
                  <Container sx={{ mt: 2, mb: 4 }}>
                    {/* <AddDoctorDialog
                      doctors={doctors}
                      setDoctors={setDoctors}
                    /> */}

                    <Grid
                      container
                      spacing={2}
                      sx={{ marginleft: "10px", marginTop: "0px" }}
                    >
                      <AddPatientRecordDialog patientInfo={infoPatient} />
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          aria-label="patient table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Tên bác sĩ</TableCell>
                              <TableCell>Lý do bệnh án</TableCell>
                              <TableCell>Thời gian khám</TableCell>
                              <TableCell>Hành động</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {patientRecord.length > 0 &&
                              patientRecord.map((doctor: any, index: any) => (
                                <TableRow
                                  key={index}
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  {/* <TableCell align="center">{doctor.id}</TableCell> */}

                                  <TableCell>{doctor?.dname || ""}</TableCell>
                                  <TableCell>{doctor?.reason || ""}</TableCell>
                                  <TableCell>
                                    {doctor?.visitedDate || ""}
                                  </TableCell>
                                  <TableCell>
                                    {localStorage.getItem("role") ===
                                      "doctor" && (
                                      <DownloadOutlinedIcon
                                        sx={{
                                          color: "rgb(102, 179, 255)",
                                          cursor: "pointer",
                                          marginRight: "5px",
                                        }}
                                        onClick={() =>
                                          handleDownloadfile(doctor.address)
                                        }
                                      />
                                    )}

                                    {localStorage.getItem("role") ===
                                      "doctor" && (
                                      <RemoveRedEyeOutlinedIcon
                                        sx={{
                                          color: "rgb(102, 179, 255)",
                                          cursor: "pointer",
                                          marginRight: "5px",
                                        }}
                                        onClick={() =>
                                          setIsOpenDetailRecord(true)
                                        }
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
