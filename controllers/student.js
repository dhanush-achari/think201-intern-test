const express = require('express');
var router = express.Router();
const Student = require("../models/student")
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const {check,validationResult} = require('express-validator');
const student = require('../models/student');



const createRoute = (req,res)=>{

    // // validating the fields like email and phone number using express validator
    // const errors = validationResult(req)
    
    // if (!errors.isEmpty()) {
    //     res.render("student/addOrEdit",{viewTitle: "Insert Student Details",error:errors.array()[0].msg,student:req.body})
    //     // return res.status(400).json({ errors: errors.array()[0] });
    //   }
//Handling form data using formidable    
let form = new formidable.IncomingForm();
form.keepExtensions = true;

form.parse(req, (err, fields, file) => {
  if (err) {
    return res.status(400).json({
      error: "problem with image"
    });
  }
  //destructure the fields
//   const { name, description, price, category, stock } = fields;

//   if (!name || !description || !price || !category || !stock) {
//     return res.status(400).json({
//       error: "Please include all fields"
//     });
//   }
console.log(fields)
  let student = new Student(fields);
  

  //handle file here
  if (file.photo) {
    //   max size upto 3mb so it doesnt become heavy
    if (file.photo.size > 3000000) {
      return res.status(400).json({
        error: "File size too big!"
      });
    }
    student.photo.data = fs.readFileSync(file.photo.path);
    student.photo.contentType = file.photo.type;
  }
//   console.log(student);

  //save to the DB
  student.save((err, student) => {
    if (err) {
      res.status(400).json({
        error: "Saving in DB failed"
      });
    }
    res.send(student.photo.data);
    // console.log(student)
  });
});


}

 const updateRoute =(req,res)=>{
    Student.findByIdAndUpdate(
     {_id: req.body._id},
      req.body,
      {new:true},
      (err,student)=>{
          if(!err){
              res.redirect('api/list')
          }
          else 
              res.send("Error while updating")
      }
    )
}





//Serving the Form
router.get('/',(req,res)=>{
    res.render("student/addOrEdit",{viewTitle : "Insert Student Details"})
})

//Creating the student profile
router.post('/',[
    check('name').isLength({min:3}).withMessage("Fill Name field with atleast 3 characters"),
    check('email').isEmail().withMessage("Invalid Email"),
    check('phone').isLength(10).withMessage("Phone must be 10 digits")
         ],
         (req,res)=>{
            //  if(req.body._id == '')
               createRoute(req,res)
            //  else
            //    updateRoute(req,res)  
         })

router.get('/list',(req,res)=>{
    Student.find({},(err,students)=>{
        if(err){
            return res.json({error:"No Student record"})
        }
        const context = {
            usersDocuments:  students.map(student =>{
                return {
                    _id:student._id,
                    name : student.name,
                    email : student.email,
                    mobile :student.mobile,
                    photo : student.photo,
                    degree: student.degree
                }
            })
        }
        
        res.render("student/list",{
            list:context.usersDocuments
        })
        console.log(students)
    })
})

router.get("/:id",(req,res)=>{
    Student.findById(req.params.id,(err,student)=>{
        if(err){
            return res.send("Student not found")
        }
        res.render("student/addOrEdit",{
            viewTitle:"update Employee",
             _id: student._id,
             name:student.name,
             email:student.email,
             mobile:student.mobile,
             degree:student.degree,
             photo:student.photo.data
        })

    })
})

router.get('/delete/:id',(req,res)=>{
    Student.findByIdAndRemove({_id:req.params._id},(err,student)=>{
        if(err)
         res.send("Unable to delete")
         else
         res.send("student deleted")
    })
        
})

module.exports = router;