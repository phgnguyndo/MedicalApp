import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DocViewer, { PDFRenderer } from "@cyntler/react-doc-viewer";
import { renderAsync } from "docx-preview";
import { fileTypeFromBuffer } from "file-type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CryptoJS = require("crypto-js");
export default function ModalViewFile({ hash, isOpen, handleClose }) {
  const [fileType, setFileType] = React.useState(null);
  const [docs, setDocs] = React.useState([]);
  const viewerRef = React.useRef(null);
  

  const fetchAndDecryptFile = async () => {
    try {
      console.log("Fetching file from IPFS...");
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      if (!response.ok) throw new Error("Failed to fetch file");

      // Tải file
      const encryptedData = await response.text(); // Dữ liệu mã hóa dạng chuỗi
      console.log("Encrypted data (first 100 chars):", encryptedData.slice(0, 100));

      // Giải mã file
      const cryptoKey = process.env.REACT_APP_CRYPTO_KEY;
      if (!cryptoKey) throw new Error("Missing CRYPTO_KEY in .env");

      const decryptedArrayBuffer = decryptFile(encryptedData, cryptoKey);
      console.log("Decrypted ArrayBuffer size:", decryptedArrayBuffer.length);

      // Phát hiện loại file
      const type = await fileTypeFromBuffer(decryptedArrayBuffer);
      console.log("File type detected:", type);

      if (!type || !type.ext) throw new Error("File type detection failed");
      setFileType(type.ext);

      // Hiển thị file
      if (type.ext === "docx" || type.ext === "doc") {
        renderAsync(decryptedArrayBuffer.buffer, viewerRef.current).catch(
          (error) => console.error("DOCX rendering error:", error)
        );
      } else if (type.ext === "pdf") {
        const blob = new Blob([decryptedArrayBuffer], { type: "application/pdf" });
        const objectURL = URL.createObjectURL(blob);
        setDocs([{ uri: objectURL, fileType: "pdf", fileName: "Document" }]);
      }
    } catch (error) {
      console.error("Error fetching or decrypting file:", error);
    }
  };

  React.useEffect(() => {
    if (hash) fetchAndDecryptFile();
  }, [hash]);

  const handleDownload = () => {
    try {
      if (!fileType) {
        throw new Error("File type not detected.");
      }
  
      // Tạo Blob từ dữ liệu đã giải mã
      const blob = new Blob([decryptedArrayBuffer], {
        type: fileType === "pdf" ? "application/pdf" : "application/octet-stream",
      });
  
      // Tạo URL tải
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `file.${fileType}`;
      link.click();
  
      // Dọn dẹp URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải file về.");
    }
  };
  
  

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Xem chi tiết bệnh án</DialogTitle>
      <DialogContent>
        {fileType === "pdf" ? (
          <DocViewer documents={docs} pluginRenderers={[PDFRenderer]} />
        ) : (
          <div ref={viewerRef} style={{ height: "500px", overflow: "auto" }}></div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

// Hàm giải mã
const decryptFile = (encryptedData, cryptoKey) => {
  try {
    // Giải mã AES
    const decryptedBase64 = CryptoJS.AES.decrypt(encryptedData, cryptoKey).toString(
      CryptoJS.enc.Utf8
    );

    // Chuyển từ Base64 -> Uint8Array
    const decryptedArrayBuffer = Uint8Array.from(atob(decryptedBase64), (c) =>
      c.charCodeAt(0)
    );
    return decryptedArrayBuffer;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
};
