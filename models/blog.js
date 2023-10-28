const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    username:{
        type: String, 
        required: true,
    },
    desc:{
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
        default: "https://www.jasminz.com/image/cache/catalog/basel-demo/blog-1140x700.png"
    },
    content: {
        type: String,   
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    }
});

const Blog = mongoose.model("blog", blogSchema, "Blogs");
module.exports = Blog;
