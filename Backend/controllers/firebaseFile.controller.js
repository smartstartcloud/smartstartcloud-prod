import File from '../models/files.model.js';
import Assignment from '../models/assignment.models.js';
import firebaseConfig from '../utils/firebaseConfig.js';
import { getStorage, ref, getDownloadURL,uploadBytesResumable} from "firebase/storage";



const storage = getStorage();

export const fileUpload = async (req, res) => {
    try {
        const {orderID} = req.body;
        const storageRef = ref(storage, req.file.originalname);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const donwloadURL= await getDownloadURL(snapshot.ref);

        // Save the file data to MongoDB
        const newFile = new File({
            orderID: orderID, // Use orderID as token
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileData: req.file.buffer,
            fileUrl: donwloadURL
        });
        
        await newFile.save();
        
        // Add the new file ID to the assignment's `assignmentFile` array
        const assignment = await Assignment.findOne({ orderID });
        assignment.assignmentFile.push(newFile._id);
        // Save the updated assignment
        await assignment.save();

        res.status(201).json({ message: "File uploaded successfully", fileId: newFile._id });
    } catch (error) {
        return res.status(400).send(error.message)
    }
}


export const fileDownload = async (req, res) => {
    try {
        const { fileID } = req.params;
        const file = await File.findById(fileID);
        if (!file) {
          return res.status(404).json({ message: 'File not found' });
        }
        res.setHeader('Content-Disposition', `attachment; filename=${file.fileName}`);
        res.send({ url: file.fileUrl });

      } catch (error) {
        res.status(500).json({ message: 'Error downloading file', error: error.message });
      }

    }
/*
    try {
        const listRef = ref(storage, '');

        listAll(listRef)
        .then(async (res) => {
          const { items } = res;
          const urls = await Promise.all(
            items.map((item) => getDownloadURL(item))
          );
          console.log(urls);
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
    }

*/

