import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DocViewer, {
  DocViewerRenderers,
  PDFRenderer,
} from "@cyntler/react-doc-viewer";
import { serverConfig } from "../../config/serverConfig";
import { renderAsync } from "docx-preview";
import { fileTypeFromBuffer } from "file-type";
import { pdfjs } from "react-pdf";
import { pinataConfig } from "../../config/pinataConfig";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function ModalViewFile({ hash, isOpen, handleClose }) {
  console.log(`${serverConfig.server_download_ipfs}/ipfs/${hash}`);
  const [fileType, setFileType] = React.useState(null);
  const viewerRef = React.useRef(null);
  const fetchFile = async () => {
    // const response = await fetch(
    //   `${serverConfig.server_download_ipfs}/ipfs/${hash}`
    // );
    const response = await fetch(
      `${pinataConfig.pinata_server}/ipfs/${hash}?pinataGatewayToken=${pinataConfig.gateway_token}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch the file");
    }
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const type = await fileTypeFromBuffer(uint8Array);
    setFileType(type["ext"]);
    if (type["ext"] === "docx" || type["ext"] === "doc") {
      renderAsync(arrayBuffer, viewerRef.current).catch((error) => {
        console.error(error);
      });
    }
  };

  React.useEffect(() => {
    if (hash) {
      fetchFile();
    }
  }, [hash]);

  const docs = [
    {
      //   uri: require("../../assets/a.pdf"),
      // uri: `${serverConfig.server_download_ipfs}/ipfs/${hash}`,
      uri: `${pinataConfig.pinata_server}/ipfs/QmeQvjsbch4jmfnKJqW6KQECaBFFeLKkCfZM4gHgZ7qjPX?pinataGatewayToken=${pinataConfig.gateway_token}`,
      fileType: "pdf",
      fileName: "bệnh án",
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
        {fileType === "pdf" ? (
          <DocViewer documents={docs} pluginRenderers={[PDFRenderer]} />
        ) : (
          ""
        )}

        <div
          ref={viewerRef}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            height: "500px",
            overflow: "scroll",
          }}
        ></div>
        {/* {fileType === "pdf" ? (
          <Document
            file={`${serverConfig.server_download_ipfs}/ipfs/${hash}`}
          />
        ) : (
          ""
        )} */}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
