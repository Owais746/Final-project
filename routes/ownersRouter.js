const express = require("express");
const router = express.Router();
const ownermodel = require("../models/owner-model");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
    let owner = await ownermodel.find();
            if(owner.length > 0){
                return res.status(400).json({ message: "Owner already exists" });
            }
            if (!req.body) {
                return res.status(400).json({ message: "Request body missing" });
            }
            
            let  { fullname, email, password }  = req.body;
            let createdOwner = await ownermodel.create({
                fullname,
                email,
                password
            });
          res.send("you can create owner")
        })
    }
   

    // router.post("/create", async (req, res) => {
    //     if (!req.body) {
    //         return res.status(400).json({ message: "Request body missing" });
    //     }
    
    //     let { fullname, email, password } = req.body;
    
    //     let owner = await ownermodel.find();
    //     if (owner.length > 0) {
    //         return res.status(400).json({ message: "Owner already exists" });
    //     }
    
    //     let createdOwner = await ownermodel.create({
    //         fullname,
    //         email,
    //         password
    //     });
    
    //     res.status(201).json({ message: "Owner created successfully", owner: createdOwner });
    // });
    



module.exports = router;