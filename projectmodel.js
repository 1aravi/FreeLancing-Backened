const mongoose = require('mongoose');

const project = new mongoose.Schema({
    projectname:{
        type: String,
        required: true
    },
    projectapplicantname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
   skill:{
        type: String,
        required: true
    }
    
    
})
module.exports = mongoose.model('project', project);