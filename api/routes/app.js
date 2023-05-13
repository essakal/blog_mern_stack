const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../model/user");
// const categoryModel = require("../model/category");
const articleModel = require("../model/article");
const cmtModel = require("../model/comment");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const authenticateToken = require("../middleware/auth")

const amqp = require("amqplib");
let connection, channel;
const queue1 = "notification_blog";

async function cnx() {
    const amqpserver = "amqp://guest:guest@rabbit:5672";
    connection = await amqp.connect(amqpserver);
    channel = await connection.createChannel();
    await channel.assertQueue(queue1);
}

cnx();


// register
router.post("/register", (req, res) => {
    data = req.body
    if (!data.email || !data.username || !data.password) {
        res.json({ error: "il y a un error au niveau d'info" })
    }
    else {
        userModel.findOne({ email: data.email })
            .then(
                user => {
                    if (user) {
                        res.json({ exist: "cet utilisateur existe déja" })
                    }
                    else {
                        pwt = bcrypt.hashSync(data.password, 10)
                        data.password = pwt
                        usr = new userModel(data)
                        usr.save()
                            .then(
                                () => res.json({ bien: "bien ajouter" })
                            )
                            .catch(
                                err => res.send(err)
                            )

                    }
                }
            )
    }
})
// login
router.post("/login", (req, res) => {
    data = req.body
    if (!data.email || !data.password) {
        res.send("il y a un error au niveau d'info")
    }
    else {
        userModel.findOne({ email: data.email })
            .then(
                user => {
                    if (!user) res.send("auccun user")
                    else {
                        pwt = bcrypt.compareSync(data.password, user.password)
                        if (pwt == false) res.send("pwt incorrect")
                        else {
                            const secret = process.env.KEY
                            payload = {
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                password: user.password
                            }
                            token = jwt.sign(payload, secret, { expiresIn: "1y" })
                            res.json({ "token": token, user: user })
                        }
                    }
                }
            )
            .catch(
                err => res.send(err)
            )
    }
})
router.get('/users', (req, res) => {
    userModel.find()
        .then(data => {
            res.send(data)
        })
        .catch(e => {
            res.send(e)
        })
})

// add article 
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function (req, file, cb) {
        const timestamp = Date.now(); // use current timestamp
        const extension = path.extname(file.originalname);
        cb(null, `${timestamp}${extension}`); // set filename to timestamp + extension
    }
});
const upload = multer({ storage: storage });
router.post('/article', upload.single('image'), authenticateToken, (req, res) => {
    data = req.body

    img = req.file.path
    img2 = img.substring(7)
    data.image = img2
    article = new articleModel(data)
    article.save()
        .then(() => {
            res.send(data);
        })
        .catch(e => {
            res.send(e)
        })
});
// get articles
router.get('/article', (req, res) => {
    articleModel.find()
        .populate('author', 'username email') // Include the user information with only the name field
        .exec()
        .then(data => { res.send(data) })
        .catch(e => res.send(e))
})
// get article
router.get('/article/:id', (req, res) => {
    id = req.params.id
    articleModel.findById({ "_id": id })
        .populate('author', 'username email') // Include the user information with only the name field
        .populate({
            path: 'comments',
            populate: { path: 'user cmt' },
            options: { sort: { _id: -1 } }
        }) // Include the user information with only the name field
        .exec()
        .then(data => { res.send(data) })
        .catch(e => res.send(e))
})
// get articles by users 
router.get('/mine/:id', authenticateToken, (req, res) => {
    id = req.params.id
    articleModel.find({ "author": id })
        .populate('author', 'username email') // Include the user information with only the name field
        .exec()
        .then((data) => {
            res.send(data)
        })
        .catch(e => res.send(e))
})
// update article
router.put('/article/:id', authenticateToken, upload.single('image'), (req, res) => {
    id = req.params.id
    data = req.body

    img = req.file.path
    img2 = img.substring(7)
    data.image = img2
    // res.send(data)
    articleModel.findByIdAndUpdate({ "_id": id }, data)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            res.send(e)
        })
})
// delete article
router.delete('/article/:id', authenticateToken, (req, res) => {
    id = req.params.id
    articleModel.findByIdAndDelete({ "_id": id })
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            res.send(e)
        })
})

router.post('/cmt/:id', authenticateToken, (req, res) => {
    id = req.params.id
    data = req.body
    cmt = new cmtModel(data)
    cmt.save()
        .then(c => {
            articleModel.findById({ "_id": id })
                .then(data => {
                    data.comments.push(c)
                    articleModel.findByIdAndUpdate({ "_id": id }, data)
                        .then(() => {
                            userModel.findById(data.author)
                                .then(user => {
                                    let ddd = {}
                                    ddd.email = user.email
                                    ddd.cmt = cmt.cmt
                                    channel.sendToQueue(queue1, Buffer.from(JSON.stringify(ddd)))
                                    res.send(cmt)
                                })
                        })
                        .catch(e => res.send(e))
                })
                .catch(e => res.send(e))
        })
        .catch(e => res.send(e))
})

router.get('/categories', (req, res) => {
    // articleModel.distinct("category")
    //     .then(data=>res.send(data))
    articleModel.aggregate([
        { $unwind: "$category" },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ])
        .then(data => res.send(data))
})
router.get('/category/:category', (req, res) => {
    category = req.params.category
    articleModel.find({ category: { $in: [category] } })
        .populate('author', 'username email') // Include the user information with only the name field
        .populate({
            path: 'comments',
            populate: { path: 'user cmt' }
        }) // Include the user information with only the name field
        .exec()
        .then(data => res.send(data))
})
// search 
router.get('/search/:word', (req, res) => {
    word = req.params.word
    // db.articles.find({ content: { $regex: /example/i } })
    articleModel.find({
        $or: [
            { title: { $regex: word } },
            { content: { $regex: word } }
        ]
    })
        .populate('author', 'username email') // Include the user information with only the name field
        .populate({
            path: 'comments',
            populate: { path: 'user cmt' }
        }) // Include the user information with only the name field
        .exec()
        .then(data => res.send(data))
})

router.post("/daata", authenticateToken, (req, res) => {
    res.json("khaaadam had token")
})
module.exports = router