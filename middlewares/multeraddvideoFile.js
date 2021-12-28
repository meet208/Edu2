const multer = require('multer');
var fname;
//Multer storage settings
// var storage2='./course-videos/'+req.videoFolder;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './course-videos/dm')    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // fname=file.originalname
  }
})
var uploadVideo = multer({ storage: storage });
module.exports=uploadVideo;

//http://localhost:3000/admin/uploadVideo/5f7315d071572645cc5b3c09
