import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useApi from "./useApi";
import useGetUserInfo from "./useGetUserInfo";
import { app } from "../utils/firebaseConfig";

const storage = getStorage(app);

const useUploadFiles = () => {
  const api = useApi();
  const { userID, userFullName } = useGetUserInfo();  

  // Upload function remains unchanged
  const uploadFiles = async (formData, setProgress) => {
    if (!formData.has("file")) throw new Error("No file selected");
    const file = formData.get("file"); // Extract file from formData

    try {
      // 🔹 Validate required properties BEFORE uploading to Firebase
      const requiredFields = ["referenceCollection", "fileCategory"];
      for (const field of requiredFields) {
        if (!formData.has(field) || !formData.get(field).trim()) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      // Step 1: Upload File to Firebase Storage
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress.toFixed(2)); // Update progress UI
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(new Error("File upload failed"));
          },
          async () => {
            // Step 2: Get File Download URL
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File uploaded to Firebase:", fileUrl);

            // Step 3: Append file URL to existing formData
            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileUrl", fileUrl);
            formData.append("uploadedByUserID", userID);
            formData.append("uploadedByUserName", userFullName);

            // Step 4: Send Updated FormData to Backend
            const res = await api.post(`/api/files/fileUpload`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data;
            if (data.error) throw new Error(data.error);

            console.log("File metadata saved successfully:", data);
            resolve(data);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  // ✅ Updated downloadFiles using useApi
  const downloadFiles = async (file, download) => {
    try {
      const response = await api.get(
        `/api/files/fileDownload/${file._id}?download=${download}`,
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Get content type from headers
      const contentType = response.headers["content-type"];
      console.log("File Content-Type:", contentType);

      // Create a blob URL for downloading or opening
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const a = document.createElement("a");
      a.href = url;

      if (download) {
        a.setAttribute("download", file.fileName);
      } else {
        a.target = "_blank"; // Open in a new tab
      }

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw new Error("File download failed");
    }
  };

  const handleGenerateShareableLink = async (orderID) => {
    try {
      const response = await api.post(`/api/files/shareable-link`, { orderID });
      const data = response.data;
      
      // Generate the shareable link
      const currentUrl = window.location.href.split("?")[0];
      const url = new URL(currentUrl);
      const baseURL = `${url.protocol}//${url.host}/globalLink`;
      data.shareableLink = `${baseURL}?token=${data.shareableLink}`;
      
      return data;
    } catch (error) {
      console.error("Error generating shareable link:", error);
      throw new Error(error.message);
    }
  };

  const deleteFiles = async (fileID, studentID=null) => {
    try {
      const res = await api.delete(`/api/files/delete/${studentID}/${fileID}`);
      const data = await res.data;
      
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("File Deleted successfully", data);
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("File deletion failed");
    }
  };

  return {
    uploadFiles,
    downloadFiles, // ✅ Now using useApi
    handleGenerateShareableLink,
    deleteFiles,
  };
};

export default useUploadFiles;