import React from "react";
import useApi from "./useApi";
import useGetUserInfo from "./useGetUserInfo";

const useUploadFiles = () => {
  const api = useApi();
  const { userID, userFullName } = useGetUserInfo();  

  // Upload function remains unchanged
  const uploadFiles = async (formData) => {    
    formData.append("uploadedByUserID", userID);
    formData.append("uploadedByUserName", userFullName);
    try {
      const res = await api.post(
        `/api/files/fileUpload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("File uploaded successfully", data);
      return data;
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

  const deleteFiles = async (fileID) => {
    try {
      const res = await api.delete(`/api/files/delete/${fileID}`);
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