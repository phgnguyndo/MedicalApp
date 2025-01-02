import * as React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import {
  Avatar,
  Typography,
  Grid,
  Box,
  Stack,
  Fade,
  Popper,
} from "@mui/material";
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
import { serverConfig } from "../../config/serverConfig";
import { toast } from "react-toastify";
import { fileTypeFromBuffer } from "file-type";
import { DeleteForeverOutlined } from "@mui/icons-material";
import axios from "axios";
import { pinataConfig } from "../../config/pinataConfig";

export const downLoadFileFromBlobLink = (response: any) => {
  const href = URL.createObjectURL(response);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', `Doi-soat-chi-tiet.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href)
}

export default function DetailPatient() {
  const { id } = useParams<{ id: string }>();

  const { contract, accountAddress } = React.useContext(AppContext);
  const [infoPatient, setInfoPatient] = React.useState<any>();
  const [patientRecord, setPatientRecord] = React.useState<any>([]);
  const [isOpenDetailRecord, setIsOpenDetailRecord] = React.useState(false);
  const [hash, setHashFile] = React.useState();

  const handleCloseDetailReacord = () => {
    setIsOpenDetailRecord(false);
  };

  const getAllPatientRecord = async () => {
    try {
      if (contract) {
        console.log("check id", id);
        const res = await contract?.methods.getAllPatientRecords(id).call();
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
        const res = await contract?.methods.getPatientDetails(id).call();
        const data = {
          name: res["_name"],
          gender: res["_gender"] === "male" ? "Nam" : "Nữ",
          phone: res["_phone"],
          dob: res["_dob"],
          address: id,
          bloodgroup: res["_bloodgroup"],
        };
        setInfoPatient(data);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };
  React.useEffect(() => {
    getAllPatientRecord();
    getDetailPatient();
  }, [id, contract]);

  const handleDownloadfile = async (hash: any) => {
    try {
    //   const response = await fetch(
    //     `${serverConfig.server_download_ipfs}/ipfs/${hash}`
    //   );
        const response = await fetch(
       `${pinataConfig.pinata_server}/ipfs/${hash}?pinataGatewayToken=${pinataConfig.gateway_token}`
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

  // const handleDownloadfile = async (hash: any) => {
  //   // const response = await axios.get( `${pinataConfig.pinata_server}/ipfs/QmeQvjsbch4jmfnKJqW6KQECaBFFeLKkCfZM4gHgZ7qjPX?pinataGatewayToken=${pinataConfig.gateway_token}`)
  //   const response = await fetch(
  //      `${pinataConfig.pinata_server}/ipfs/QmeQvjsbch4jmfnKJqW6KQECaBFFeLKkCfZM4gHgZ7qjPX?pinataGatewayToken=${pinataConfig.gateway_token}`
  //     );
  //   const arrayBuffer = await response.arrayBuffer();
  //   console.log(arrayBuffer)
  //   // downLoadFileFromBlobLink(response)

  // }
  const handleDeleteRecord = async (hash: any) => {
    console.log(hash);
    console.log(id);
    try {
      const res = await contract?.methods
        .deleteRecord(id, hash)
        .send({ from: accountAddress, gas: 3000000 });
      // const response = await fetch(
      //     `${pinataConfig.pinata_server}/pinning/unpin/QmZwCUcz3X3TtyowEdcTZyzi4ZMkKVoUAC6en4TNzMur1w`,
      //     {
      //       method: "DELETE",   
      //       headers: {
      //         Authorization: `Bearer ${pinataConfig.jwt}`,
      //       },  
      //     }
      //   );
        // console.log(response)
      // getAllPatientRecord();
      toast.success("Xoá hồ sơ bệnh án thành công", { autoClose: 1000 });
    } catch (err) {
      toast.error("Xoá hồ sơ bệnh án thất bại", { autoClose: 1000 });
    }
  };

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
        hash={hash}
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
                      <AddPatientRecordDialog
                        getAllPatientRecord={getAllPatientRecord}
                        patientInfo={infoPatient}
                      />
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
                                          handleDownloadfile(doctor.hash)
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
                                        onClick={() => {
                                          setIsOpenDetailRecord(true);
                                          setHashFile(doctor.hash);
                                        }}
                                      />
                                    )}

                                    {localStorage.getItem("role") ===
                                      "doctor" && (
                                      <DeleteForeverOutlined
                                        sx={{
                                          color: "red",
                                          cursor: "pointer",
                                          marginRight: "5px",
                                        }}
                                        onClick={() =>
                                          handleDeleteRecord(doctor.hash)
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
