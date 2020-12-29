//MongoDB model imports
const User = require('./models/user')
const Tribe = require('./models/tribe')
const Book = require('./models/book')
const Tree = require('./models/tree')
const Bio = require('./models/bio')
const Blog = require('./models/blog')

//smtp email client
const mailer = require('./email')

//File system for node
const fs = require('fs')

//Tree parsing module
var TreeModel = require('tree-model')

const PDF2Pic = require("pdf2pic");

var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;

//Connect to mongo database
mongoose.connect('mongodb://localhost/nuxt', {useNewUrlParser: true}) //Development
// mongoose.connect('mongodb://127.0.0.1:27017/nuxt', {useNewUrlParser: true, user: "main", pass: "00", useUnifiedTopology: true}) //Deployment
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{console.log('Connected to db')})



//---------------- API CALLS -----------------------

const getDashboardData = (payload,res)=>{ //No onger used
    res.status(200).end()
}

const signUp = (payload, res)=>{
    const {username, password} = payload
    if(!username || !password){
        res.status(400).json({success: false})
    }else{
        //New user from mongoose model
        const user = new User({username, password})
        user.save(err => {
            if(err){
                res.status(403).json({success: false, message: 'Already exists'})
            }else{
                res.json({success: true})
            }
        })
    }
}

//Basic auth function
const logIn = (payload, res, authUser, req)=>{
    User.findOne({username: payload.username}, (err, user)=>{
        if(err || !user){
            res.json({success: false, message: 'Error or incorrect username'})
        }else{
            user.comparePassword(payload.password, (err, isMatch)=>{
                if(err || !isMatch){
                    res.json({success: false, message: 'Incorrect Password'})
                }else{
                    req.session.authUser = { username: user.username, user_id: user._id, type: user.type }
                    res.json({success: true, authUser: {user_id: user._id, username: user.username, type: user.type}})
                }
            })
        }
    })
}

//Delete user session
const logOut = (payload, res, authUser, req)=>{
    delete req.session.authUser
    res.json({ success: true })
}

//Reset password via email
const lostPassword = (payload, res, authUser)=>{
    //Find user
    User.findOne({email: payload.email}, (err, user)=>{
        if(err){
            return res.status(400)
        }
        else{
            if(user){
                //Upon creating a token for the reset, send the user an email
                user.resetPasswordToken((err, token)=>{
                    if(err){console.log(err)}
                    else{
                        mailer.sendMail({
                            from: 'example@test.com',
                            to: user.email,
                            subject: 'Password Reset',
                            template: 'passwordReset',
                            context: {link: `localhost:3000/signin/issues/reset?t=${token}`} //Token as a query - get's sent back by the client on submit
                        }, (err, response)=>{
                            mailer.close()
                        })
                    }
            })}
            res.json({success: true})
        }
    })
}

const resetPassword = (payload, res, authUser)=>{
    //Find the user with the token, where said token hasn't expired
    //Note: Password is hashed within a pre save function on the mongoose model = check models/user.js
    User.findOneAndUpdate({'resetPassword.token': payload.token, 'resetPassword.expires': {"$gte": new Date()}}, {password: payload.password, resetPassword: null}, (err, user)=>{
        if(user){
            res.json({success: true})
        }else{
            res.json({success: false, message: 'token invalid'})
        }
    })
}

const getTribes = (payload, res)=>{
    // Returns all tribes for a given region.. returning only _id and name
    Tribe.find(payload ? {region: payload.region}:{}, '_id nameEn nameAr', (err, tribes)=>{
        if(err){
            return res.status(400)
        }else{
            res.json({tribes: tribes})
        }
    })
}

const getTribeData = (payload, res)=>{
    // Return the full tribe object from the db
    Tribe.findById(payload.id, (err, tribe)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(tribe)
        }
    })
}

//Get's tribes - all data
const getTribesAdmin = (payload, res, authUser, req)=>{
    if(authUser && authUser.type == 'Admin'){
        Tribe.find((err, tribes)=>{
            if(err){
                return res.status(400)
            }else{
                res.json(tribes)
            }
        })
    }else{
        res.status(400).json({success: false, message: 'Not admin'})
    }
}

// Basic edit func
const editTribe = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        Tribe.findOneAndUpdate({'_id': payload._id}, payload, {new: true}, (err, tribe)=>{
            if(tribe){
                res.json(tribe)
            }else{
                res.status(400).end()
            }
        })
    }else{
        res.status(400).json({success: false, message: 'Not admin'})
    }
}

const newTribe = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        const tribe = new Tribe(payload)
        tribe.save((err, tribeNew) => {
            if(err){ //Assumes only likely error - can extend if required
                res.status(403).json({success: false, message: 'Already exists'})
            }else{
                res.json(tribeNew)
            }
        })
    }else{
        res.status(403).json({success: false, message: 'Not admin'})
    }
}

//Delete tribe via _id - admin only
const deleteTribe = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        Tribe.findByIdAndRemove(payload._id, (err)=>{
            if(err){
                res.status(403)
            }else{
                res.json({success: true})
            }
        })
    }else{
        res.status(403).json({success: false, message: 'Not admin'})
    }
}

//Get all books
const getBooks = (payload, res)=>{
    Book.find({}, (err, books)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(books)
        }
    })
}

//Get single book via _id
const getBook = (payload, res)=>{
    Book.findById(payload.id, (err, book)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(book)
        }
    })
}

//Update book
const editBook = (payload, res, authUser, req)=>{
    //Function for saving changes - essentially boilerplate as required in two locations
    const saveBook = (book) =>{
        Book.findOneAndUpdate({'_id': payload._id}, book, {new: true}, (err, book)=>{
            if(book){
                res.json(book)
            }else{
                res.status(400).end()
            }
        })
    }
    //Function for processing book pdf
    if(authUser && authUser.type == 'Admin'){ //Check if admin
        if(payload.file && payload.file.mimetype == 'application/pdf'){ //if uploaded file is in an accepted format
            fs.readFile(payload.file.path, function(err, data) { //Read the file via node fs
                if(!err){
                    var size = payload.file.size 
                    fs.writeFile(`./static/books/${payload._id}.pdf`, data, function (err) { //Save pdf on server with name of the _id
                        if(!err){
                            delete payload.file
                            console.log('PDF Saved with ID ' + payload._id) 

                            //Generate thumbnail
                            new PDF2Pic({
                                density: 100,
                                savename: payload._id, //same name as pdf
                                savedir: "./static/books",
                                format: "jpg",
                                size: "220x300" 
                                }).convert(`./static/books/${payload._id}.pdf`).then((resolve) => {
                                    console.log("Thumbnail created");
                                    //Save changes
                                    saveBook({...payload, ...{size: size}})
                                }).catch(()=>res.status(400).end());

                        }else{
                            console.log(err)
                            return res.status(400).end()
                        }
                    });
                }else{
                    return res.status(400).end()
                }
              });
        }else{
            saveBook(payload)
        }
    }else{
        res.status(400).end()
    }
}

//Create a new book
const newBook = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        const book = new Book(payload)
        book.save((err, bookNew) => {
            if(err){
                res.status(403).json({success: false, message: 'Already exists'})
            }else{
                res.json(bookNew)
            }
        })
    }else{
        res.status(403).json({success: false, message: 'Not admin'})
    }
}

const deleteBook = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        Book.findByIdAndRemove(payload._id, (err)=>{
            if(err){
                res.status(403)
            }else{
                res.json({success: true})
            }
        })
    }else{
        res.status(403).json({success: false, message: 'Not admin'})
    }
}

//Get all blogs
const getBlogs = (payload, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(blogs)
        }
    })
}

//Create a new blog
const newBlog = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        payload.author = 'Administrator'
        payload.created = new Date().toString().slice(4,25)
        const blog = new Blog(payload)
        blog.save((err, blogNew) => {
            if(err){
                res.status(403).json({success: false, message: 'Already exists'})
            }else{
                res.json(blogNew)
            }
        })
    }else{
        res.status(403).json({success: false, message: 'Not admin'})
    }
}

//Get single blog via _id
const getBlog = (payload, res)=>{
    Blog.findById(payload.id, (err, blog)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(blog)
        }
    })
}

//Update blog
const editBlog = (payload, res, authUser, req)=>{
    if(authUser && authUser.type == 'Admin'){
        Blog.findOneAndUpdate({'_id': payload._id}, payload, {new: true}, (err, blog)=>{
            if(blog){
                res.json(blog)
            }else{
                res.status(400).end()
            }
        })
    }else{
        res.status(400).json({success: false, message: 'Not admin'})
    }
}

//Get's the main geneaology tree from the db
const getMainTree = (payload, res, authUser)=>{
    Tree.find({}, (err, trees)=>{
        if(err){
            return res.status(400)
        }else{
            var dateRange = [0, 0] //temp
            trees.forEach((tree, tIndex, tArray)=>{ //assumes only one tree stored in db
                var treeM = new TreeModel(); //using tree-model npm module
                var root = treeM.parse(tree.data); 
                root.all().forEach((x, index, array)=>{
                    var model = x.model
                    //Compares dateRange so that dateRange[0] is year of the earliest node, and dateRange[1] the latest- used for the timescale at render
                    dateRange = [(model.year < dateRange[0] ? model.year : dateRange[0]), (model.year > dateRange[1] ? model.year : dateRange[1])]
                    //If reached the end of the tree, send response
                    if(index == array.length-1 && tIndex == tArray.length-1){
                        res.json({tree: trees[0], dr: dateRange})
                    }
                })
            })
        }
    })
}

//Recursively search the tree for a given node - used  to load bios
function searchTree(element, matchingTitle){
    if(element.id == matchingTitle){
         return element;
    }else if (element.children != null){
         var i;
         var result = null;
         for(i=0; result == null && i < element.children.length; i++){
              result = searchTree(element.children[i], matchingTitle);
         }
         return result;
    }
    return null;
}

const getNodeData = (payload, res, authUser)=>{
    Tree.find({}, (err, trees)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(searchTree(trees[0].data, payload.nodeId))
        }
    })
}

const getAllNodeData = (payload, res, authUser)=>{
    Tree.find({}, (err, trees)=>{
        if(err){
            return res.status(400)
        }else{
            res.json(trees[0].data)
        }
    })
}

//Get's all tribe members for a given tribe
const getTribeMembers = (payload, res, authUser)=>{
    Tree.find({}, (err, trees)=>{
        if(err){return res.status(400).end()}else{
            var tree = new TreeModel(),
                root = tree.parse(trees[0].data),
                members = [];
            //Parses the tree, matching the tribe _id
            root.walk((node)=>{
                if(node.model.tribe && node.model.tribe == payload._id){
                    members.push({id: node.model.id, nameEn: node.model.nameEn, nodeAr: node.model.nameAr})
                }
            })
            //Send response
            res.json(members)
        }
    })
}

//Tribe tree - circular tree loaded when a tribe is clicked on
getTribeTree = async (payload, res, authUser)=>{
    
    Tribe.findOne({_id: payload._id}, (err, tribe) => {
        if(err || !tribe){
            res.status(400).end()
        } else {
            Tree.find({}, (err, trees)=>{ //get main tree
                if(err){return res.status(400).end()}else{
                    var tree = new TreeModel(),
                        root = tree.parse(trees[0].data),
                        tempChildren = [],
                        leader = root.first(node=> tribe.leader == node.model.id), //Finds the node designated as tribe leader
                        tribeTree = {
                            data: leader?leader.model:false
                        },
                        added = leader?[leader.model.id]:false
                    if(tribeTree.data){
                        tribeTree.data.children = []
                        //Create first level nodes
                        root.walk({strategy: 'breadth'}, (node)=>{ //Parse the main tree, adding nodes to the tribe tree where the tribe matches
                            if(String(node.model.tribe) == String(tribe._id) && String(node.model.id) != String(tribe.leader)){
                                var path = node.getPath()
                                console.log('nodemodel =>', node.model)
                                console.log('added =>', added)
                                console.log('path =>', path)
                                console.log(!added.includes(path[path.length-2].model.id))
                                if(node.isRoot() || !added.includes(path[path.length-2].model.id)){ //checks if node is a descendant of the leader 
                                    added.push(node.model.id)
                                    tempChildren.push(node.model)
                                }
                            }
                        })

                        console.log('tempChildren =>', tempChildren)
                        /*
                        tempChildren.forEach((c)=>{
                            var tempTree = tree.parse(c)
                            tempTree.all((node)=>{ //Removes extra nodes
                                    return (node.model.tribe != tribe._id) || (node.getPath().length>3) || (added.includes(node.model.id))
                                }).forEach((node)=>{
                                    node.drop()
                                })
                            c = tempTree.model
                        })
                        */
                        tribeTree.data.children = tempChildren
                        //Send to client
                        res.send(tribeTree)
                    }else{
                        res.status(400).end()
                    }
                }
            })
        }
    })
}

//Delete node using tree-model, updating the tree in the db
const deleteNode = (payload, res, authUser)=>{ 
    Tree.find({}, (err, trees)=>{
        if(err){res.status(400).end()}else{
            var tree = new TreeModel(),
                root = tree.parse(trees[0].data)
            //Removes node
            root.all(node=>node.model.id==payload.id).forEach((node)=>{
                node.drop()
            })
            //Update in db
            Tree.findByIdAndUpdate(trees[0]._id, {_id: trees[0]._id, data: root.model}, {new: true}, (err, tree)=>{
                if(err){
                    res.status(400)
                }else{
                    res.json(root.model)
                }
            })
        }
    })
}

//Edit node props
const updateNode = (payload, res, authUser)=>{
    var update = (file)=>{
        Tree.find({}, (err, trees)=>{
            if(err){
                return res.status(400)
            }else{
                var tree = new TreeModel(),
                    root = tree.parse(trees[0].data);
    
                root.walk((node)=>{
                    if(node.model.id==payload.node.id){
                        node.model.nameEn=payload.node.nameEn
                        node.model.nameAr=payload.node.nameAr
                        node.model.img = payload.node.royal ? (file ? file : node.model.img) : false
                        node.model.royal = payload.node.royal
                        node.model.year = parseInt(payload.node.year)
                        node.model.tribe = payload.node.tribe ? payload.node.tribe : false
                        node.model.category = payload.node.category
                        node.model.progeny = payload.node.progeny
                        node.model.wife_id = payload.node.wife_id
    
                        //Update tree in db
                        Tree.findByIdAndUpdate(trees[0]._id, {_id: trees[0]._id, data: root.model}, {new: true}, (err, tree)=>{
                            if(err){
                                res.status(400)
                            }else{
                                res.json(node.model)
                            }
                        })
    
                    }
                })
            }
        })
    }

     if(payload.file){ //if logo img has been uploaded
        fs.readFile(payload.file.path, function(err, data) { //Read uploaded image
            if(!err){
                var size = payload.file.size
                var ext = payload.file.originalname.split('.')[1]
                console.log(ext)
                fs.writeFile(`./static/tree/${payload.node.id}.${ext}`, data, function (err) { //save image to server
                    if(!err){
                        delete payload.file
                        update(ext)
                    }else{
                        console.log(err)
                        return res.status(400).end()
                    }
                });
            }else{
                console.log('read failed')
                return res.status(400).end()
            }
        });
    }else{
        update(false)
    }
}

//Edit tree in db:
const updateTree = (payload, res, authUser)=>{
    if(authUser && authUser.type == 'Admin'){
        Tree.findByIdAndUpdate(payload.tree._id, payload.tree, {new: true}, (err, tree)=>{
            if(err){
                return res.status(400)
            }else{
                res.json(tree)
            }
        })
    }
}

// Add bio via mongo model
const newBio = (payload, res, authUser)=>{
    new Bio(payload).save((err, bio) => {
        if(err){
            res.status(403).json({success: false, message: 'Already exists'})
        }else{
            res.json(bio)
        }
    })
}


const getBio = (payload, res, authUser)=>{
    Bio.findOne(payload._id ? {_id: payload._id}:{nodeId: payload.nodeId}, (err, bio)=>{
    // Bio.findOne({nodeId: payload.nodeId}, (err, bio)=>{
        if(err){
            res.status(400)
        }else{
            res.json(bio)
        }
    })
}

const editBio = (payload, res, authUser)=>{
    Bio.findByIdAndUpdate({'_id': payload._id}, payload, {new: true}, (err, bio)=>{
        if(err){
            res.status(400).end()
        } else {
            res.json(bio)
        }
    })
    // var edit = (newFile)=>{
    //     var updatedBio = payload.bio
    //     if(newFile){updatedBio.files.push(newFile)}
    //     Bio.findByIdAndUpdate(payload.bio._id, updatedBio, {new: true}, (err, bio)=>{
    //         if(err){
    //             res.status(400).end()
    //         }else{
    //             res.json(bio)
    //         }
    //     })
    // }
    // if(payload.file){ //if logo img has been uploaded
    //     fs.readFile(payload.file.path, function(err, data) {
    //         if(!err){
    //             var size = payload.file.size
    //             var ext = payload.file.originalname.split('.')[1],
    //             path = `${payload.bio._id+payload.bio.files.length+1}.${ext}`
    //             fs.writeFile("./static/bios/"+path, data, function (err) {
    //                 if(!err){
    //                     edit({type: payload.file.mimetype, size: size, filename: path})
    //                 }else{
    //                     console.log(err)
    //                     return res.status(400).end()
    //                 }
    //             });
    //         }else{
    //             console.log('read failed')
    //             return res.status(400).end()
    //         }
    //     });
    // }else{
    //     edit(false)
    // }
}


//Export api functions
module.exports={
    getDashboardData,
    signUp,
    logIn,
    logOut,
    lostPassword,
    resetPassword,
    db,
    getTribes,
    getTribeData,
    newTribe,
    editTribe,
    getTribesAdmin,
    deleteTribe,
    getBooks,
    getBook,
    newBook,
    editBook,
    deleteBook,
    getBlogs,
    newBlog,
    getBlog,
    editBlog,
    getMainTree,
    updateTree,
    getNodeData,
    getAllNodeData,
    getBio,
    updateNode,
    newBio,
    editBio,
    getTribeMembers,
    getTribeTree,
    deleteNode
}