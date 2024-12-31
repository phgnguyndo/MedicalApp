import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import { Link, useParams } from "react-router-dom";
import avartar from "../../assets/avatar-blank.png";
import React, { useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  age: number;
  gender: string;
  bloodType: any;
  allergies: string;
  diagnosis: string;
  treatment: string;
  imageHash: string;
};

const PatientInfo = ({ patients }: any) => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const { contract, accountAddress } = React.useContext(AppContext);

  const viewRecord = async () => {
    if (id && accountAddress) {
      try {
        const res = await contract.methods.getRecord(accountAddress, id).call();
        const recordJson = {
          timestamp: res[0],
          name: res[1],
          age: res[2],
          gender: res[3],
          bloodType: res[4],
          allergies: res[5],
          diagnosis: res[6],
          treatment: res[7],
          imageHash: res[8],
        };

        console.log("Fetched record:", recordJson);
        reset({
          name: recordJson.name || undefined,
          age: recordJson.age || 0,
          gender: recordJson.gender || undefined,
          bloodType: recordJson.bloodType || undefined,
          allergies: recordJson.allergies || undefined,
          diagnosis: recordJson.diagnosis || undefined,
          treatment: recordJson.treatment || undefined,
        });
      } catch (error) {
        console.error("Error fetching record:", error);
      }
    } else {
      alert("Please provide a valid record ID.");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: undefined,
      age: 0,
      gender: undefined,
      bloodType: undefined,
      allergies: undefined,
      diagnosis: undefined,
      treatment: undefined,
    },
  });

  const handleClose = () => {
    setOpen(false);
    reset();
    setUrl(avartar);
  };

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    // const res = await contract.methods
    //   .addRecord(
    //     data.name,
    //     data.age,
    //     data.gender,
    //     data.bloodType,
    //     data.allergies,
    //     data.diagnosis,
    //     data.treatment,
    //     ""
    //   )
    //   .send({ from: accountAddress, gas: 3000000 });
    // // setPatients((prevState: any) => [...prevState, data]);
    // handleClose();
  };

  const onImportFileClick = () => {
    inputFile.current?.click();
  };
  const handleOnChangeFile = (e: any) => {
    setFile(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  };

  // const [url, setUrl] = React.useState(data_detail?.avartar ? `${import.meta.env.VITE_BASE_URL}${data_detail.avartar}` : avartar)
  const [url, setUrl] = React.useState<any>(avartar);
  const inputFile = React.useRef<HTMLInputElement | null>(null);
  const setInputFileRef = (node: HTMLInputElement | null) => {
    inputFile.current = node;
  };

  useEffect(() => {
    viewRecord();
  }, [reset]);
  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Thông tin chi tiết bệnh án" />
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
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box
                    component="img"
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                    alt="image"
                    src={url}
                    style={{ cursor: "pointer" }}
                    onClick={onImportFileClick}
                  />

                  <input
                    type="file"
                    id="file"
                    ref={setInputFileRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleOnChangeFile(e)}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="name"
                        label="Tên bệnh nhân"
                        type="fullName"
                        fullWidth
                        variant="outlined"
                        {...register("name", {
                          required: "Hãy nhập tên",
                        })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="age"
                        label="Tuổi"
                        type="age"
                        fullWidth
                        variant="outlined"
                        placeholder="Nhập tuổi"
                        {...register("age", {
                          required: "Hãy nhập tuổi",
                        })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                          labelId="gender"
                          id="gender"
                          label="Giới tính"
                          {...register("gender")}
                        >
                          <MenuItem value={"male"}>Nam</MenuItem>
                          <MenuItem value={"female"}>Nữ</MenuItem>
                          <MenuItem value={"other"}>Khác</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="bloodType"
                        label="Nhóm máu"
                        type="bloodType"
                        fullWidth
                        variant="outlined"
                        {...register("bloodType", {
                          required: "Hãy nhập nhóm máu",
                        })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="allergies"
                        label="Dị ứng"
                        type="allergies"
                        fullWidth
                        variant="outlined"
                        {...register("allergies")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="diagnosis"
                        label="Chuẩn đoán"
                        type="diagnosis"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: 18"
                        {...register("diagnosis", {
                          required: "Hãy nhập chuẩn đoán",
                        })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        margin="dense"
                        id="treatment"
                        label="Phương pháp điều trị"
                        type="treatment"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: Dr. Smith"
                        {...register("treatment", {
                          required: "Hãy nhập phương pháp điều trị",
                        })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button onClick={handleClose}>Huỷ</Button>
                  <Button type="submit" variant="contained">
                    Lưu
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default PatientInfo;
