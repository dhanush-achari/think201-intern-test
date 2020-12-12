const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        // required:'This field is required'
    },
    email:{
        type: String
    },
    mobile: {
        type: String
    },
    photo: {
        data : Buffer,
        contentType:String
    },
    degree: {
        type: String
    }

},{ timestamps: true })

module.exports = mongoose.model("Student",studentSchema)