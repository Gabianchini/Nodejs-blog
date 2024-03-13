const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const {isActiveRoute} = require ('../helpers/routeHelpers');

/*
 GET/HOME

 */

//Routes
router.get('', async (req,res) => {
   try{
    const locals = {
        title:"NodeJs Blog",
        description: "Simple blog created with Nodejs Express and Mongodb"
       }

       let perPage = 10;
       let page = req.query.page || 1;

       const data = await Post.aggregate([{ $sort: {createdAt: -1}}])
       .skip(perPage * page - perPage)
       .limit(perPage)
       .exec();

       const count = await Post.countDocuments();
       const nextPage = parseInt(page) + 1;
       const hasNextPage = nextPage <= Math.ceil(count / perPage)
    
       res.render('index',{
         locals,
         data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute:'/'
     });

   }catch(error){
    console.log(error);
   }
});

/*Get/ 
Post:id */
router.get('/post/:id', async (req,res) => {
    try{
    let slug  = req.params.id;

    const data = await Post.findById({_id:slug});
       
     const locals = {
         title:data.title,
         description: "Simple blog created with Nodejs Express and Mongodb",
         currentRoute: `/post/${slug}`
        }
      
        res.render('post',{
            locals,
            data,
            currentRoute:'/post/:id'
        });
            
    }catch(error){
        console.log(error)
    }
      });


      /*Get/ 
Post:search*/
router.post('/search', async (req,res) => {
    try{
     const locals = {
         title:"Search",
         description: "Simple blog created with Nodejs Express and Mongodb"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        
        const data = await Post.find({
            $or:[
                {title:{$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body:{$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        });
       
      
        res.render("search",{
            data,locals,currentRoute:'/search'
        });
            
    }catch(error){
        console.log(error)
    }
      });




router.get('/about',(req,res) => {
    res.render('about',{
        currentRoute:'/about'
    });
    });

router.get('/admin',(req,res) => {
    res.render('admin',{
        currentRoute:'/admin'
    });
    });

router.get('admin/dashboard',(req,res) => {
    res.render('dashboard',{
    currentRoute:'admin/dashboard'
    });
    });

    module.exports = router

   
    