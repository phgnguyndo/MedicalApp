import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import BasicDatePicker from "../../components/DatePicker";
import dayjs from "dayjs";
type FormValues = {
  name: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string;
};

export default function SignUpPatient({ type }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const { contract, accountAddress } = useContext(AppContext);

  const onSubmit = async (data: FormValues) => {
    try {
      const formattedDate = dayjs(data["dob"]).format("DD-MM-YYYY");
      data = {
        ...data,
        dob: formattedDate,
      };
      if (contract) {
        const res = await contract?.methods
          .addPatient(
            data.name,
            data.phone,
            data.gender,
            data.dob,
            data.bloodGroup
          )
          .send({ from: accountAddress, gas: 3000000 });
        localStorage.setItem("role", "patient");
        navigate(`/dashboard`);
        toast.success("Đăng ký tài khoản bệnh nhân thành công", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký tài khoản bệnh nhân  thất bại", { autoClose: 1000 });
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: "80vh" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký
        </Typography>
        <Box sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  label="Tên bệnh nhân"
                  //autoFocus
                  {...register("name", {
                    required: "Vui lòng nhập tên bệnh nhân",
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Số điện thoại"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel id="gender">Giới tính</InputLabel>
                  <Select id="gender" label="Giới tính" {...register("gender")}>
                    <MenuItem value={"male"}>Nam</MenuItem>
                    <MenuItem value={"female"}>Nữ</MenuItem>
                    <MenuItem value={"other"}>Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //required
                  fullWidth
                  label="Nhóm máu"
                  id="bloodGroup"
                  {...register("bloodGroup", {
                    required: "Vui lòng nhập nhóm máu",
                  })}
                  error={!!errors.bloodGroup}
                  helperText={errors.bloodGroup?.message}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TextField
                  fullWidth
                  label="Ngày sinh"
                  id="dob"
                  {...register("dob", {
                    required: "Vui lòng nhập ngày sinh",
                  })}
                  error={!!errors.dob}
                  helperText={errors.dob?.message}
                /> */}
                {/* <BasicDatePicker /> */}
                <Controller
                  name="dob"
                  control={control}
                  rules={{ required: "Vui lòng chọn ngày" }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker {...field} label="Chọn ngày sinh" />
                      </DemoContainer>
                    </LocalizationProvider>
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  to={"/login"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  Bản đã có tài khoản? Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </form>
          <DevTool control={control} /> {/* set up the dev tool */}
        </Box>
      </Box>
    </Container>
  );
}
