const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey="secretKey";

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.json("Sample API");
});

app.post('/login', (req, res)=>{
    const user={
        id: 1, 
        username:"gfaizank",
        email: "gfaizank@test.com"
    }
    jwt.sign({user}, secretKey, {expiresIn: '300s'}, (err, token)=>{
        res.json({
            token
        })
    });
})

app.post('/profile', verifyToken, (req, res)=>{
    jwt.verify(req.token, secretKey, (err, authData)=>{
        if(err){
            res.send({result: 'Invalid Token'})
        } else{
            res.json({
                message: 'Profile accessed',
                authData
            })
        }
    })
})

function verifyToken(req, res, next){
    const bearerHeader=req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearer=bearerHeader.split(" ");
        if (bearer.length === 2 && bearer[0].toLowerCase() === 'bearer'){
            const token=bearer[1];
        req.token=token;
        next()
        } else {
            res.status(403).json({
                result: 'Invalid Authorization header format'
            });
        }
    } else{
        res.send({
            result: 'Token is not valid'
        })
    }
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
