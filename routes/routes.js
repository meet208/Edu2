var express = require('express')
var router = express.Router()



//importing controllers
const courseController=require('../controllers/courseController')
const authController=require('../controllers/authController')
const adminController=require('../controllers/adminController')
const instructorController = require('../controllers/instructorController')

//importing middlewares
const checkAuth=require('../middlewares/checkAuth')
const adminCheckAuth=require('../middlewares/adminCheckAuth')
const uploadImage=require('../middlewares/multerUploadImage')
const uploadVideo=require('../middlewares/multerUploadVideo')
const uploadEditVideo=require('../middlewares/multeraddVideoFile')
const checkPurchasedCourse=require('../middlewares/checkPurchasedCourse')
const videoController=require('../controllers/videoController')
const setFolderName=require('../middlewares/setFolderName')
const fileUpload=require('../middlewares/fileUpload')
//Auth routes
router.get('/login',authController.login_page_get)
router.post('/login',authController.login_user)
router.get('/logout',authController.logout)
router.get('/register',authController.register_page_get)
router.post('/register',authController.register_user)
router.get('/transaction',checkAuth,authController.get_transaction_page)

//Admin routes below


//insRequests
router.get('/main/ins_register',instructorController.instructor_register_page_get)
router.post('/main/ins_register',instructorController.instructor_register_user)
router.get('/main/show_requests',instructorController.get_all_pending_requests)
router.post('/main/grantPermission',instructorController.addInsToDB)
router.post('/main/evokePermission',instructorController.updateInsToDB)
router.get('/myPublishedCourses',adminCheckAuth,instructorController.view_instructor_courses)



//Serving Static files
router.use('/admin/',express.static('public'));
router.get('/admin/login', adminController.get_adminLogin_page)
router.post('/admin/login',adminController.admin_login)
router.get('/admin/logout',adminController.admin_logout)
router.get('/admin/newCourse',adminCheckAuth,adminController.get_newCourse_page)
router.post('/admin/newCourse',adminCheckAuth,uploadImage.single('img'),adminController.create_newCourse)
router.get('/admin/addCategory',adminCheckAuth,adminController.get_addCategory_page)
router.post('/admin/addCategory',adminCheckAuth,adminController.create_newCategory)
router.get('/admin/uploadVideo/:courseID',adminCheckAuth,adminController.get_uploadVideo_page)
router.post('/admin/uploadVideo/:courseID',adminCheckAuth,setFolderName,uploadVideo,adminController.create_uploadVideo)

router.get('/admin/golive/:courseID',adminCheckAuth,adminController.get_golive);
router.get('/admin/endlive/:courseID',adminCheckAuth,adminController.get_endlive);
router.get('/admin/uploadFile/:courseID',adminCheckAuth,adminController.get_fileUpload)

router.post('/admin/uploadFile/:courseID',adminCheckAuth,fileUpload,adminController.create_fileUpload)

router.get('/admin/editCourse/:courseID',adminCheckAuth,adminController.get_editCourse_page)
router.post('/admin/editCourse/:courseID',adminCheckAuth,uploadImage.single('img'),adminController.update_editCourse)
router.get('/admin/edit/uploadVideo/:courseID',adminCheckAuth,adminController.get_uploadVideo_page_for_edit)
router.post('/admin/edit/uploadVideo/:courseID',adminCheckAuth,uploadEditVideo.single('video'),adminController.update_uploadVideo)

// Home Routes
router.get('/',courseController.get_home_page)

//courses and course-single
router.use('/courses/',express.static('public'));
router.get('/courses',courseController.get_all_courses)
router.post('/courses',courseController.get_courses_of_category)
router.get('/courseSingle/:courseID',courseController.get_single_course);

//course watch and my courses
//user needs to be logged in for watching their courses
router.get('/myCourses',checkAuth,courseController.get_myCourses_page)
router.get('/likeUpdate/:courseID',checkAuth,courseController.like_update)
router.get('/checkout/:courseID',checkAuth,courseController.get_checkout_page)
router.post('/checkout/:courseID',courseController.verify_payment)

router.get('/watchCourse/:courseID',checkAuth,checkPurchasedCourse,courseController.get_watchCourse_page);
router.post('/comment/:courseID',checkAuth,checkPurchasedCourse,courseController.create_comment);
router.get('/comment/delete/:commentID',checkAuth,courseController.delete_comment)
router.get('/video/:courseID',checkAuth,checkPurchasedCourse,videoController.get_video)


module.exports = router