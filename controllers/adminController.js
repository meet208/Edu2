const Category = require('../models/category');
const Instructor = require('../models/instructor');
const insRequest = require('../models/ins_request');
const Course = require('../models/courses');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const fs = require('fs');

exports.get_newCourse_page = (req, res) => {
    Category.find((err, categories) => {
        if (err) {
            return res.render('newCourse', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some problem occured with database. Please reload the page",
                categories: []
            });
        }
        return res.render('newCourse', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: "Enter details to create a new course",
            categories: categories
        });
    })

}

exports.create_newCourse = async (req, res) => {
    // console.log("AAYUSHJJ1")
    // console.log(req.session.admin_id)
    const ins = await Instructor.findById(req.session.admin_id);
    newCourse = new Course({
        title: req.body.title,
        description: req.body.description,
        category: req.body.categoryID,
        instructor: req.body.instructor,
        aboutInstructor: req.body.aboutInstructor,
        price: req.body.price,
        imageUrl: req.file.filename,
        watchHours: req.body.watchHours,
    })
    newCourse.save((err, course) => {
        if (err) console.log(err)
        res.redirect('/admin/uploadVideo/' + course._id);
        ins.addedCourses.push(course._id)
        ins.save((err, user) => {
            if (err) {
                console.log(err);
                //initiate refund
            }else{
                console.log(user);
            }
        })
    })
}

exports.get_addCategory_page = (req, res) => {
    return res.render('addNewCategory', {
        isLogged: req.session.isLogged,
        adminLogged: req.session.adminLogged,
        message: "Enter the name of new category."
    });
}
exports.create_newCategory = (req, res) => {
    newCategory = new Category({
        name: req.body.category
    })
    newCategory.save((err, category) => {
        if (err) {
            return res.render('addNewCategory', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the category. Make sure this category doesn't already exists."
            });
        }
        else {
            res.redirect('/admin/newCourse')
        }
    })
}

exports.get_uploadVideo_page = (req, res) => {
    const courseID = req.params.courseID;
    Course.findById(courseID, (err, course) => {
        if (err) {
            return res.render('uploadVideo', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the course. Retry again.",
                course: null
            });
        }
        return res.render('uploadVideo', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: "Upload the folder of videos containing the lectures. Naming should be done as 1.mp3, 2.mp4 etc",
            course: course
        });
    })
}
//++++
exports.get_uploadVideo_page_for_edit = (req, res) => {
    const courseID = req.params.courseID;
    Course.findById(courseID, (err, course) => {
        if (err) {
            return res.render('uploadVideo', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the course. Retry again.",
                course: null
            });
        }
        const directoryPath = path.join(__dirname, '../course-videos', course.videoUrl);
        //passsing directoryPath and callback function
        var courseTracks = []
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                courseTracks.push(file.toString());
            });
            req.videoFolder = course.videoUrl;
        return res.render('editVideos', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: "Upload the folder of videos containing the lectures. Naming should be done as 1.mp3, 2.mp4 etc",
            course: course,
            courseTracks: courseTracks,
            courseID:courseID
            // path: path.join(directoryPath, courseTracks[trackNum])
        });
    })
})
}
exports.update_uploadVideo = (req, res) => {
    const courseID = req.params.courseID;
    console.log(req.videoFolder)
    Course.findById(courseID, (err, course) => {
        if (err) {
            return res.render('uploadVideo', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the course. Can't fint the course",
                course: null
            });
        }
        course.videoUrl = req.videoFolder;
        course.save();
        res.redirect('/courses')
    })
}

exports.get_editCourse_page = async (req, res) => {
    const courseID = req.params.courseID;
    var categ = []
    await Category.find((err, categories) => {
        if (err) {
            res.send(err);
        }
        for(const c of categories){
            categ.push(c);
        }
    });

    Course.findById(courseID, (err, course) => {
        if (err) {
            res.send(err);
        }
        return res.render('editCourse', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: "Edit course and update",
            course: course,
            categories: categ
        });
    })
}

exports.update_editCourse = async (req, res) => {
    const courseId = req.params.courseID;
    const ins = await Instructor.findById(req.session.admin_id);
    newCourse = new Course({
        _id:courseId,
        title: req.body.title,
        description: req.body.description,
        category: req.body.categoryID,
        instructor: req.body.instructor,
        aboutInstructor: req.body.aboutInstructor,
        price: req.body.price,
        imageUrl: req.file.filename,
        watchHours: req.body.watchHours,
    })
    Course.findByIdAndUpdate(courseId , newCourse,(err,doc) =>{
        if(err){
            console.log("Error in updating Course")
            console.log(err)
        }else{
            console.log("Updation of blog sucessful")
        }
    })
    res.redirect('/admin/edit/uploadVideo/' + courseId);
}


//++++++
exports.create_uploadVideo = (req, res) => {
    const courseID = req.params.courseID;
    Course.findById(courseID, (err, course) => {
        if (err) {
            return res.render('uploadVideo', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the course. Can't fint the course",
                course: null
            });
        }
        course.videoUrl = req.videoFolder;
        course.save();
        res.redirect('/courses')
    })
}


exports.get_adminLogin_page = (req, res) => {
    res.render('adminLogin', {
        isLogged: req.session.isLogged,
        adminLogged: req.session.adminLogged,
        message: "Enter details to login."
    });
}

exports.admin_logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        console.log('logged out');
        res.redirect('/');
    })
}



exports.admin_login = (req, res) => {
    console.log(req.body.email);
    Instructor.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('login', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occured in login. Please try again later."
            })
        }
        if (!user) {
            return res.render('login', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "There is no user with that email."
            })
        } else {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if(err){
                        consoloe.log(err);
                    }
                    if (result == true) {
                        //user authenticated
                        req.session.admin_id = user._id;
                        req.session.adminLogged = true
                        res.redirect('/admin/newCourse');
                    }
                    else {
                        return res.render('login', {
                            isLogged: req.session.isLogged,
                            adminLogged: req.session.adminLogged,
                            message: "Email or password entered is incorrect."
                        })
                    }        
            });

        }
    })
}



exports.get_golive = async (req,res)=>{
    const courseID = req.params.courseID;
    Course.findByIdAndUpdate(courseID, { isLive: 1 },
                            function (err, docs) {
        if (err){
            console.log(err)
        }
    });
    res.redirect(`https://mirotalk.herokuapp.com/join/${courseID}`);
}

exports.get_endlive = async (req,res)=>{
    const courseID = req.params.courseID;
    Course.findByIdAndUpdate(courseID, { isLive: 0 },
                            function (err, docs) {
        if (err){
            console.log(err)
        }
    });
    res.redirect('/');

}