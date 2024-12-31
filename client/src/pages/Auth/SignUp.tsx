import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
type FormValues = {
  name: string;
  hospital: string;
  faculty: string;
  contact: string;
  license: string;
};

export default function SignUp({ type }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const { contract, accountAddress } = useContext(AppContext);

  const onSubmit = async (data: FormValues) => {
    if (type === "doctor") {
      try {
        const res = await contract.methods
          .addDoctor(
            data.name,
            data.hospital,
            data.faculty,
            data.contact,
            data.license
          )
          .send({ from: accountAddress, gas: 3000000 });
        localStorage.setItem("role", "doctor");
        navigate(`/dashboard`);

        toast.success("Đăng ký tài khoản bác sĩ thành công", {
          autoClose: 1000,
        });
      } catch (error) {
        console.log(error);
        toast.error("Đăng ký tài khoản bác sĩ  thất bại", { autoClose: 1000 });
      }
    } else {
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
                  //autoComplete="given-name"
                  //name="firstName"
                  //required
                  fullWidth
                  id="name"
                  label="Tên bác sĩ"
                  //autoFocus
                  {...register("name", {
                    required: "Vui lòng nhập tên bác sĩ",
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //required
                  fullWidth
                  id="hospital"
                  label="Bệnh viện"
                  //name="lastName"
                  //autoComplete="family-name"
                  {...register("hospital", {
                    required: "Vui lòng nhập bệnh viện",
                  })}
                  error={!!errors.hospital}
                  helperText={errors.hospital?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="faculty"
                  label="Khoa"
                  {...register("faculty", {
                    required: "Vui lòng nhập khoa",
                  })}
                  error={!!errors.faculty}
                  helperText={errors.faculty?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  type="contact"
                  id="contact"
                  {...register("contact", {
                    required: "Vui lòng nhập số điện thoại",
                  })}
                  error={!!errors.contact}
                  helperText={errors.contact?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //required
                  fullWidth
                  label="Chứng chỉ hành nghề"
                  type="number"
                  id="license"
                  {...register("license", {
                    required: "Vui lòng nhập chứng chỉ hành nghề",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Chỉ được nhập số",
                    },
                  })}
                  error={!!errors.license}
                  helperText={errors.license?.message}
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
