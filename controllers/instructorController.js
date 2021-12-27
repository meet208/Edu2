const Instructor = require('../models/instructor');
const insRequest = require('../models/ins_request');
const Category = require('../models/category');
const Course = require('../models/courses');
const Comment = require('../models/comments')
const mongoose = require('mongoose');
const User = require('../models/user');
const Razorpay = require('razorpay');
const Transaction = require('../models/transactions');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//==========
exports.get_all_pending_requests = async (req, res) => {
    // var categories = await Category.find();
    
    insRequest.find({'status':"Pending"},(err, requests) => {
        let message;
        if (requests.length >= 0) {
            message = "Requests"
            console.log("00")
        }
        else {
            message = "Sorry! There are no Requests."
        }
        res.render('viewRequests', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: message,
            requests: requests
            // categories: categories
        });
    }).select('-description -aboutInstructor')
}
//==========

// ====
exports.instructor_register_page_get = (req, res) => {
    res.render('instructorRequest', {
        isLogged: req.session.isLogged,
        adminLogged: req.session.adminLogged,
        message: "Please enter all the genuine credentials as these will be used to contact you for accepting your request."
    });
}

exports.instructor_register_user = (req, res) => {
    console.log(req.body);
    insRequest.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('instructorRequest', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occured in registration. Please try again later."
            })
        }
        if (user) {
            msg="Your query status:: "+user.status
            console.log(msg)
            return res.render('instructorRequest', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: msg,
                bool:true
            })
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                const newInsReq = new insRequest({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    status:"Pending"
                })
                newInsReq.save((err, newInsReq) => {
                    if (err) {
                        console.log(err)
                        return res.render('instructorRequest', {
                            isLogged: req.session.isLogged,
                            adminLogged: req.session.adminLogged,
                            message: "Some error occured in registration. Please try again later."
                        })
                    }

                    //new insRequest created
                    // req.session.user_id = newInsReq._id;
                    // req.session.isLogged = true;
                    console.log("Succesful request registered ");
                    res.redirect('/')
                })
            });
        }
    })
}
// ======
//==*

exports.updateInsToDB = (req, res) => {
    //update status
    insRequest.findByIdAndUpdate(req.body.id , {'status':'decline'},(err,doc) =>{
        if(err){
            console.log("Error in updating insRequest")
        }else{
            console.log("AAY")
        }
    })
    res.redirect("/")
}
exports.addInsToDB = (req, res) => {
    // console.log(req.body.name)
    // if(req.body.dec==1){
        // console.log(req.body.dec)
    // }
    newInstructor = new Instructor({
        name:req.body.name,
        email:req.body.mail,
        password:req.body.password
    })
    newInstructor.save((err,ins) => {
        if (err) {
            return res.render('/main/show_requests', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occurred while creating the category. Make sure this category doesn't already exists."
            });
            console.log("AAS")
        }
    })
    
    //update status
    insRequest.findByIdAndUpdate(req.body.id , {'status':'grANTED'},(err,doc) =>{
        if(err){
            console.log("Error in updating insRequest")
        }else{
            console.log("AAY")
        }
    })
    res.redirect("/")
}
//*===
