const mongoose = require('mongoose');


const freelancerprojects = new mongoose.Schema({
    projectname:{
        type: String,
        required: true
    },
   postrequirements:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('freelancerprojects', freelancerprojects);