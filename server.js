const express = require('express');
const mongoose=require('mongoose');
const freelanceruser = require('./usermodel.js');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const freelancerprojects = require('./freelancerprojectsmodel.js');
const project = require('./projectmodel.js');
const cors = require('cors');
require ("dotenv").config();

const app = express();
mongoose.connect('mongodb+srv://aravindsignin:aravind123@cluster0.sfwun.mongodb.net/?retryWrites=true&w=majority').then(
    ()=> console.log('DB is conneceted')
);

app.use(express.json());
app.use(cors({origin:'*'}));

app.get('/', (req, res)=>{
return res.send("Hello Aravind")
})

app.post('/register', async (req, res)=>{
    try{
        const {fullname,email,skills,password,confirmpassword} = req.body;
        const exist = await freelanceruser.findOne({email});
        if(exist){
            return res.status(400).send('User Alredy Exists')
        }
        if(password != confirmpassword){
            return res.status(400).send('Password and confirm password are not matched');
        }

        let newUser = new freelanceruser({
                fullname,email,skills,password,confirmpassword
            })
        newUser.save();
        return res.status(200).send('Registered Successfully');
    }
    catch(err){
       console.log(err);
       return res.status(500).send('Server Error')
    }

})

app.post('/login', async(req, res) =>{
    try{
        const {email, password} = req.body;
        const exist = await freelanceruser.findOne({email})
        if(!exist){
            return res.status(400).send('User not exists');
        }
        if(exist.password != password){
            return res.status(400).send('password not valid');
        }

        let payload = {
            user:{
                id: exist.id
            } 
        }
        jwt.sign(payload, 'jwtPassword', {expiresIn:240000000},
        (err, token)=>{

            if(err) throw err;
            return res.json({token})
        })

    }
    catch(err){
console.log(err);
res.status(400).send('Server Error')
    }
})

app.get('/allprofiles', middleware, async(req, res)=>{
    try{

        let allprofiles = await freelanceruser.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        res.status(400).send('Server Error')
            }
})

app.get('/myprofile', middleware, async (req, res)=>{
    try{
        let user= await freelanceruser.findById(req.user.id);
        return res.json(user);

    }
    catch(err){
        console.log(err);
        return res.status(400).send('Server Error')

    }
})


app.post('/applyproject', async (req, res)=>{
    try{

     const {projectname, projectapplicantname, email, skill} = req.body
    let newProjectapplicants = new project({
        projectname,projectapplicantname,email,skill
    })
    newProjectapplicants.save();
return res.status(200).send('Applied successfully');
}
catch(err){
console.log(err);
return res.status(500).send('Server Error')
}
})


//get projects from freelancerprojects

app.get('/viewprojects', middleware, async(req, res)=>{
    try{

        let viewprojects = await freelancerprojects.find();
        return res.json(viewprojects);
    }
    catch(err){
        console.log(err);
        res.status(400).send('Server Error')
            }
})

//add projects from freelancerprojects

app.post('/addproject', async (req, res)=>{
    try{

     const {projectname, postrequirements} = req.body
    let newProjects = new freelancerprojects({
        projectname,postrequirements
    })
newProjects.save();
return res.status(200).send('Project added successfully');
}
catch(err){
console.log(err);
return res.status(500).send('Server Error')
}
})

//project applicants

app.get('/viewapplicant', middleware, async (req, res)=>{
    try{
        
        let viewapplicant = await project.find();
        
        return res.json(viewapplicant);

    }
    catch(err){
        console.log(err);
        return res.status(400).send('Server Error')

    }
})

app.listen(process.env.PORT || 5000, ()=>(console.log("Server is Running")))