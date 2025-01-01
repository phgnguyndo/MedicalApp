import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
type FormValues = {
  name: string;
  license: number;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddDoctorDialog({ doctors, setDoctors }: any) {
  const [open, setOpen] = React.useState(false);
  const { contract, accountAddress } = React.useContext(AppContext);
  const role = localStorage.getItem("role");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (contract) {
        const res = await contract?.methods
          .registerDoctor(data.name, data.license)
          .send({ from: accountAddress, gas: 3000000 });
        handleClose();
        toast.success("Đăng ký chứng chỉ bác sĩ thành công", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.error("Không đủ quyền đăng ký bác sĩ", { autoClose: 1000 });
    }
  };

  // const handleGetRole = async () => {
  //   const res = await contract.methods.user(accountAddress).call();

  //   if (parseInt(res) === 0) {
  //     localStorage.setItem("role", "doctor");
  //   }

  //   if (parseInt(res) === 2) {
  //     localStorage.setItem("role", "owner");
  //   }

  //   if (parseInt(res) === 1) {
  //     localStorage.setItem("role", "patient");
  //   }
  // };

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchInput />
        {role === "owner" ? (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Đăng ký bác sĩ
          </Button>
        ) : (
          ""
        )}
        {/* <Button onClick={() => handleGetRole()}>Role</Button> */}
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Đăng ký bác sĩ</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Tên bác sĩ"
              type="name"
              fullWidth
              variant="outlined"
              {...register("name", {
                required: "Vui lòng nhập tên bác sĩ",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              //required
              fullWidth
              label="Chứng chỉ hành nghề"
              type="number"
              id="license"
              placeholder="9838434"
              //autoComplete="new-password"
              {...register("license", {
                required: "Vui lòng nhập chứng chỉ hành nghề",
                pattern: {
                  value: /^[0-9]+$/, // Ensure only numbers are allowed
                  message: "Chỉ được nhập số",
                },
              })}
              error={!!errors.license}
              helperText={errors.license?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Huỷ bỏ</Button>
            <Button type="submit" variant="contained">
              Thêm mới
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
