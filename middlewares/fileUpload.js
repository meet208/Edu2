const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');
const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/udemyclone';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const uniqueName=(new Date().getTime() + "-" + file.originalname)
        // const filename = file.originalname;
        const fileInfo = {
          filename: uniqueName,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
        req.fileName=uniqueName;
    });
  }
});

const upload = multer({ storage }).array('file',100);;
module.exports=upload;