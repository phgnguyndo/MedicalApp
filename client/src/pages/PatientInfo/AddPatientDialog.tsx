import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import avartar from "../../assets/avatar-blank.png";
import { AppContext } from "../context/AppContext";

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPatientDialog({
  patients,
  setPatients,
  handleChange,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const { contract, accountAddress } = React.useContext(AppContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setUrl(avartar);
  };

  const onSubmit = async (data: FormValues) => {
    if (contract) {
      const res = await contract?.methods
        .addRecord(
          data.name,
          data.age,
          data.gender,
          data.bloodType,
          data.allergies,
          data.diagnosis,
          data.treatment,
          ""
        )
        .send({ from: accountAddress, gas: 3000000 });
    }
    // setPatients((prevState: any) => [...prevState, data]);
    handleClose();
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

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchInput handleChange={handleChange} />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Thêm bệnh nhân<nav></nav>
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Thêm bệnh án</DialogTitle>

          <DialogContent dividers>
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
                      // error={!!errors.name}
                      helperText={errors.name?.message}
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
                      // error={!!errors.bloodType}
                      // helperText={errors.bloodType?.message}
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
                      // error={!!errors.allergies}
                      // helperText={errors.allergies?.message}
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
                      // error={!!errors.diagnosis}
                      // helperText={errors.diagnosis?.message}
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
                      // error={!!errors.treatment}
                      // helperText={errors.treatment?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Huỷ</Button>
            <Button type="submit" variant="contained">
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
