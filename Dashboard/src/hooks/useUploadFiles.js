import axios from 'axios';
import React from 'react'

const useUploadFiles = () => {
    const uploadFiles = async(formData) => {
        try {            
            // let url = '/upload';  // Default restricted route
            // if (token) {
            //     url = `/share/upload?token=${token}`;  // Unrestricted route if token is available
            // }
            const res = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = await res.data
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('File uploaded successfully', data);
            return data
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
                    throw new Error("Order ID is required");
                } else if (error.response.status === 409) {
                    console.log("Error: Order ID already exists");
                    throw new Error("Order ID already exists");
                } else if (error.response.status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error("Internal Server Error");
                } else {
                    console.log("Error: ", error.response.data.error);
                    throw new Error(error.response.data.error); // Re-throw any other error
                }
            } else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }
        }
    }

    const downloadFiles = async(file, download) => {        
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_LOCALHOST}/api/files/download/${file._id}?download=${download}`,
            {
              responseType: "blob", // Important to get the file as a blob
            }
          );

          // Get the content type from the response headers
          const contentType = response.headers["content-type"];
          console.log("File Content-Type:", contentType); // This will show something like 'application/pdf'

          // Create a blob link for the file and trigger the download
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: contentType })
          );

          const a = document.createElement("a");
          a.href = url;
          if (download) {
            a.setAttribute("download", file.fileName);
          } // Set the file name for download
          else {
            a.target = "_blank"; // Open in a new tab
          }
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
    }

    return {uploadFiles, downloadFiles}
}

export default useUploadFiles