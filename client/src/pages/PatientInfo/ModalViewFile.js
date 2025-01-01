import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function ModalViewFile({ isOpen, handleClose }) {
  const docs = [
    // {
    //   uri: `https://drive.usercontent.google.com/download?id=144aJHlbMiY33FNctj0bZdOIUiKMnG6VL&export=download&authuser=0&confirm=t&uuid=144e3544-7c19-4a68-943f-eda5686a47c8&at=APvzH3q_8EfAEXoK6PHpjPNc3ax3:1735696824768`,
    //   fileType: "docx",
    //   fileName: "demo.docx",
    // },
    {
      //   uri: require("../../assets/a.pdf"),
      uri: "http://localhost:3000/NguyenHoangNam_CNTT_proof_stake.pdf",
      fileType: "pdf",
      fileName: "demo.pdf",
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ height: "100%" }}
    >
      <DialogTitle>Xem chi tiết bệnh án</DialogTitle>

      <DialogContent dividers>
        <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
