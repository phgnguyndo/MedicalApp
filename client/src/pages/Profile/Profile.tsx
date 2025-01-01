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
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { AppContext } from "../context/AppContext";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { fileTypeFromBuffer } from "file-type";
import { toast } from "react-toastify";
import { serverConfig } from "../../config/serverConfig";
import ModalViewFile from "../PatientInfo/ModalViewFile";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function Profile() {
  const role = localStorage.getItem("role");

  const { contract, accountAddress } = React.useContext(AppContext);
  const [infoData, setInfoData] = React.useState<any[]>([]);
  const [patientRecord, setPatientRecord] = React.useState<any>([]);
  const [isOpenDetailRecord, setIsOpenDetailRecord] = React.useState(false);
  const [hash, setHashFile] = React.useState();

  const handleCloseDetailReacord = () => {
    setIsOpenDetailRecord(false);
  };
  const [profile, setProfile] = React.useState<any>({
    avatarUrl: "https://i.pravatar.cc/300",
  });

  const { avatarUrl, name, specialization, biography } = profile;

  const getDetailInfoDoctor = async () => {
    try {
      if (contract) {
        const res = await contract?.methods
          .getDoctorByAddress(accountAddress)
          .call();
        console.log(res);
        const data = {
          contact: res?.contact,
          faculty: res?.faculty,
          avatarUrl: "https://i.pravatar.cc/300",
          specialization: role === "doctor" ? "Bác sĩ" : "Bệnh nhân",
          hname: res?.hname,
          name: res?.name,
          biography:
            "Chúng tôi cố không bao giờ quên đi rằng y học là vì con người. Y học không phải là vì lợi nhuận. Lợi nhuận theo sau, và nếu chúng tôi nhớ được điều đó, lợi nhuận không bao giờ không xuất hiện. ",
        };
        setProfile(data);
        setInfoData([
          {
            icon: <BadgeOutlinedIcon />,
            title: "Tên bác sĩ",
            value: res?.name,
          },
          {
            icon: <PhoneIcon />,
            title: "Số tiện thoại",
            value: res?.contact,
          },
          {
            icon: <MapsHomeWorkOutlinedIcon />,
            title: "Bệnh viện",
            value: res?.hname,
          },
          {
            icon: <MedicalServicesIcon />,
            title: "Khoa",
            value: res?.faculty,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllPatientRecord = async () => {
    try {
      if (contract) {
        const res = await contract?.methods
          .getAllPatientRecords(accountAddress)
          .call();
        const { ids, dnames, ipfsHashes, reasons, visitedDates } = res;
        const data = Array.isArray(dnames)
          ? dnames.map((item, index) => {
              return {
                dname: dnames[index],
                reason: reasons[index],
                visitedDate: visitedDates[index],
                hash: ipfsHashes[index],
              };
            })
          : [];

        setPatientRecord(data);
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDetailPatient = async () => {
    try {
      if (contract) {
        const res = await contract?.methods
          .getPatientDetails(accountAddress)
          .call();
        //get reaccord patient
        getAllPatientRecord();
        const data = {
          avatarUrl: "https://i.pravatar.cc/300",
          specialization: role === "doctor" ? "Bác sĩ" : "Bệnh nhân",
          name: res?._name,
          // biography:
          //   "Chúng tôi cố không bao giờ quên đi rằng y học là vì con người. Y học không phải là vì lợi nhuận. Lợi nhuận theo sau, và nếu chúng tôi nhớ được điều đó, lợi nhuận không bao giờ không xuất hiện. ",
        };
        setProfile(data);
        setInfoData([
          {
            icon: <BadgeOutlinedIcon />,
            title: "Tên bệnh nhân",
            value: res?._name,
          },
          {
            icon: <PhoneIcon />,
            title: "Số tiện thoại",
            value: res?._contact,
          },
          {
            icon: <WcOutlinedIcon />,
            title: "Giới tính",
            value: res?._gender,
          },
          {
            icon: <CakeOutlinedIcon />,
            title: "Ngày sinh",
            value: res?._dob,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadfile = async (hash: any) => {
    try {
      const response = await fetch(
        `${serverConfig.server_download_ipfs}/ipfs/${hash}`
      );
      const arrayBuffer = await response.arrayBuffer();

      console.log(arrayBuffer);

      //check typ file
      const uint8Array = new Uint8Array(arrayBuffer);
      const type: any = await fileTypeFromBuffer(uint8Array);
      let name = "";
      if (type?.ext === "pdf") {
        name = "benhan.pdf";
      } else {
        name = "benhan.docx";
      }
      const blob = new Blob([arrayBuffer]);
      console.log(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      console.log(url);
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Tải file thành công", { autoClose: 1000 });
    } catch (error) {
      console.log(error);
      toast.error("Tải file thất bại", { autoClose: 1000 });
    }
  };

  React.useEffect(() => {
    getDetailInfoDoctor();
    getDetailPatient();
  }, [contract]);

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Thông tin cá nhân" />
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
        <ModalViewFile
          isOpen={isOpenDetailRecord}
          handleClose={handleCloseDetailReacord}
          hash={hash}
        />

        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 445,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={2} direction="column" alignItems="center">
                  <Stack>
                    <Avatar
                      src={avatarUrl}
                      sx={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Stack>
                  <Stack>
                    <Typography variant="h4">{name}</Typography>
                    <Typography variant="h6">{specialization}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={8}>
              <Box
                sx={{
                  flexGrow: 0,
                }}
              >
                <Grid container spacing={2}>
                  {infoData.map((item, index) => (
                    <Grid key={index} item xs={12} md={6} lg={6}>
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
                            <Stack>
                              <IconButton
                                size="large"
                                aria-label="icon"
                                color="secondary"
                              >
                                {item.icon}
                              </IconButton>
                              {item.title && (
                                <Typography
                                  component="h2"
                                  align="center"
                                  variant="h6"
                                  color="primary"
                                  gutterBottom
                                >
                                  {item.title}
                                </Typography>
                              )}
                              <Typography
                                component="p"
                                align="center"
                                variant="h5"
                              >
                                {item.value}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {role === "patient" ? (
            <Grid mt={4} ml={0.8} container spacing={3}>
              <h3>Hồ sơ bệnh án</h3>
              <TableContainer component={Paper}>
                <Table aria-label="patient table">
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
                          <TableCell>{doctor?.visitedDate || ""}</TableCell>
                          <TableCell>
                            {localStorage.getItem("role") === "patient" && (
                              <DownloadOutlinedIcon
                                sx={{
                                  color: "rgb(102, 179, 255)",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => handleDownloadfile(doctor.hash)}
                              />
                            )}

                            {localStorage.getItem("role") === "patient" && (
                              <RemoveRedEyeOutlinedIcon
                                sx={{
                                  color: "rgb(102, 179, 255)",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => {
                                  setIsOpenDetailRecord(true);
                                  setHashFile(doctor.hash);
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            ""
          )}
        </Container>
      </Box>
    </Box>
  );
}
