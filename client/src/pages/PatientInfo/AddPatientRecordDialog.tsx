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
import { useForm, Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import avartar from "../../assets/avatar-blank.png";
import { AppContext } from "../context/AppContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { pinataConfig } from "../../config/pinataConfig";
import axios from 'axios'

import { serverConfig } from "../../config/serverConfig";
type FormValues = {
  _dname: string;
  _reason: string;
  _visitedDate: string;
  _ipfs: any;
  addr: string;
};
const CryptoJS = require("crypto-js");
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const encryptFile = (fileBuffer: ArrayBuffer, key: string): string => {
  try {
    // Chuyển đổi ArrayBuffer thành chuỗi Base64
    const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
    const base64String = CryptoJS.enc.Base64.stringify(wordArray);

    // Mã hóa chuỗi Base64 bằng AES với khóa
    return CryptoJS.AES.encrypt(base64String, key).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
};

export default function AddPatientRecordDialog({
  patientInfo,
  getAllPatientRecord,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const { contract, accountAddress } = React.useContext(AppContext);
  const [files, setFiles] = React.useState<File[]>([]);
  const [urls, setUrls] = React.useState<string[]>([]);
  const [showIcon, setShowIcon] = React.useState<boolean>(true);

  const inputFile = React.useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    // setUrl(avartar);
    setUrls([]);
    setFiles([]);
    setShowIcon(true);
  };

  const onSubmit = async (data: FormValues) => {
    //get info docter
    const docterInfo = await contract.methods
      .getDoctorByAddress(accountAddress)
      .call();
    let docketName = "";
    if (docterInfo) docketName = docterInfo[1];
    console.log(docketName);
    try {
      if (files.length === 0) {
        toast.error("Vui lòng nhập file", { autoClose: false });
        return;
      }
  
      const cryptoKey = process.env.REACT_APP_CRYPTO_KEY;
      if (!cryptoKey) {
        toast.error("Missing CRYPTO_KEY in environment variables.");
        return;
      }
  
      // Đọc file dưới dạng ArrayBuffer
      const fileBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as ArrayBuffer);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(files[0]);
      });
  
      // Mã hóa file
      const encryptedFile = encryptFile(fileBuffer, cryptoKey);
  
      // Tạo FormData với file mã hóa
      const formData = new FormData();
      formData.append("file", new Blob([encryptedFile], { type: "text/plain" }));
  
      // Upload file mã hóa lên IPFS
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataConfig.api_key,
            pinata_secret_api_key: pinataConfig.api_secret,
          },
        }
      );
  
      if (response.status === 200) {
        const formattedDate = dayjs(data._visitedDate).format("DD-MM-YYYY");
        const dataSubmit = {
          ...data,
          _dname: docketName,
          _ipfs: response.data["IpfsHash"], // Hash IPFS của file mã hóa
          addr: patientInfo?.address,
          _visitedDate: formattedDate,
        };
  
        if (contract) {
          await contract.methods
            .addRecord(
              dataSubmit._dname,
              dataSubmit._reason,
              dataSubmit._visitedDate,
              dataSubmit._ipfs,
              dataSubmit.addr
            )
            .send({ from: accountAddress, gas: 3000000 });
  
          getAllPatientRecord();
          toast.success("Thêm mới bệnh án thành công", { autoClose: 1000 });
        }
        handleClose();
      } else {
        toast.error("Thêm mới bệnh án thất bại", { autoClose: 1000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Thêm mới bệnh án thất bại", { autoClose: 1000 });
    }
  };

  const onImportFileClick = () => {
    inputFile.current?.click();
  };

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const fileNames = filesArray.map((file) => file.name);

      setFiles((prevFiles) => [...prevFiles, ...filesArray]);
      setUrls((prevUrls) => [...prevUrls, ...fileNames]);
      setShowIcon(false);
    }
  };

  // State to store files and their URLs

  const setInputFileRef = (node: HTMLInputElement | null) => {
    inputFile.current = node;
  };

  return (
    <div style={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <h3>Hồ sơ bệnh án</h3>
        {(localStorage.getItem("role") === "doctor" ||
          localStorage.getItem("role") === "owner") && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Thêm bệnh án<nav></nav>
          </Button>
        )}
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
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={6}>
                    <TextField
                      margin="dense"
                      id="_dname"
                      label="Tên bác sĩ"
                      type="_dname"
                      fullWidth
                      variant="outlined"
                      {...register("_dname", {
                        required: "Vui lòng nhập tên bác sĩ",
                      })}
                      // error={!!errors.name}
                      helperText={errors._dname?.message}
                    />
                  </Grid> */}
                  <Grid item xs={8}>
                    <TextField
                      margin="dense"
                      id="_reason"
                      label="Lý do"
                      type="_reason"
                      fullWidth
                      variant="outlined"
                      placeholder="Nhập lý do"
                      {...register("_reason", {
                        required: "Hãy nhập tuổi",
                      })}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name="_visitedDate"
                      control={control}
                      rules={{ required: "Vui lòng chọn ngày khám" }}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker {...field} label="Chọn ngày khám" />
                          </DemoContainer>
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid style={{ marginTop: "10px" }} item xs={12}>
                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  container
                  spacing={2}
                >
                  {urls.map((url, index) => (
                    <Grid item xs={12} key={index}>
                      <span style={{ color: "rgb(102, 179, 255)" }}>{url}</span>{" "}
                    </Grid>
                  ))}

                  {/* Hiển thị icon upload nếu chưa có ảnh */}
                  {showIcon && (
                    <CloudUploadOutlinedIcon
                      sx={{
                        fontSize: "60px",
                        opacity: 0.7,
                        cursor: "pointer",
                      }}
                      onClick={onImportFileClick}
                    />
                  )}

                  <input
                    type="file"
                    id="file"
                    ref={setInputFileRef}
                    style={{ display: "none" }}
                    onChange={handleOnChangeFile}
                    multiple
                  />
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