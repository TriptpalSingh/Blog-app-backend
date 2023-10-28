const express = require('express');
const mongoose = require('mongoose');
const app = express();
const conncectDb = require('./db');
const Name = require('./models/User');
const Blog = require('./models/blog');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));

conncectDb();

let loggedIn = false;

const info = {
    name: "",
    username: ""
}

app.get('/api/auth/checkLoggedIn', (req,res)=>{
    res.send(loggedIn);
})

app.get('/api/auth/getInfo',(req,res)=>{
    res.send(info);
})

app.post('/api/auth/register', async (req, res)=>{

    const check = await Name.findOne({email: req.body.email}) || await Name.findOne({username: req.body.username}) ? true : false;
    if(check){
        res.send("failed to add data to the db. reason: email or username already exists.")
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);

    const userssss = new Name({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: pass
    })

    await userssss.save().then(()=>{
        res.send("done adding data to the db")
    }).catch((err)=>{
        res.send(err.message);
    })
});


app.post('/api/auth/login', async (req, res)=>{
    const {email, password} = req.body;

    const check = await Name.findOne({email});
    if(!check){
        return res.send("please try again with the correct credentials.");
    }
    const passCheck = await bcrypt.compare(password, check.password)
    if(passCheck){
        
        loggedIn = true;
        info.username = check.username;
        info.name = check.name;
        res.json({user: check, username: info.name});
    }
    else{
        return res.send("please try again with the correct credentials.");
    }
})

app.get('/api/auth/logout', async (req, res)=>{
    if(loggedIn){
        const acc = await Name.findOne({username: info.username});
        if(!acc){
            return res.send("user doesnt exist");
        }
        loggedIn = false;
        info.name = "";
        info.username = "";
        res.send(acc);
    }
    else{
        res.status(500).send("internal server error.")
    }
})




app.post('/api/blogs/addBlog', async (req, res)=>{ 
    const {title, desc, imgUrl, content} = req.body;
    const username = info.username;
    const author = info.name;
    const blog = new Blog({
        title, author, desc, imgUrl, username, content
    })

    await blog.save().then(()=>{
        res.send("blog has been saved");
    }).catch((err)=>{
        res.send(err);
    })
})

app.get('/api/blogs/showAllBlogs', async (req,res)=>{
    const blogs = await Blog.find({});
    res.send(blogs);
})

app.get('/api/blogs/userBlogs', async (req,res)=>{
    if(!loggedIn){
        return res.status(500).send("Internal server error(not logged in)")
    }
    const blogs = await Blog.find({username: info.username});
    res.send(blogs);
})

app.put('/api/blogs/openBlog', async (req,res)=>{
    const id = req.body.id;
    const check = await Blog.findOne({_id:id});
    if(!check){
        return res.status(500).send("could not find blog");
    }
    res.send(check);
})

app.put('/api/blogs/deleteBlog', async (req, res)=>{
    const id = req.body.id;
    const check = await Blog.findByIdAndDelete(id);
    if(!check){
        return res.status(500).send("internal server error");
    }
    res.send(check);
})

app.put('/api/blogs/updateBlog', async (req, res)=>{
    const {id, title, desc, imgUrl, content} = req.body;
    const check = await Blog.findById(id);
    if(!check){
        return res.status(500).send("error happened");
    }

    if(check.username == info.username){
        const bb = await Blog.findByIdAndUpdate(id, {
            title, desc, imgUrl, content
        })
        res.send("blog updated");
        return;
    }
    else{
        return res.send("invalid user")
    }
})


app.listen(5000, ()=>{
    console.log("listening to port 5000;")
})