const express = require("express");
const router = express.Router();
const User = require("./Users")
const bcrypt = require('bcryptjs');
const AdminAuth = require("../adminAuth")
const Category = require("../categories/Category")

router.get("/admin/users",AdminAuth,(req,res) =>{
	User.findAll().then(users =>{
		res.render("admin/users/index", {users:users})
	})
})

router.get("/admin/users/create", AdminAuth,(req, res) =>{
	res.render("admin/users/create")
})

router.post("/users/create", AdminAuth, (req, res) =>{
	var email = req.body.email;
	var userName = req.body.username;
	var password = req.body.password;

	User.findOne({
		//Validação User/email
		where:{
			email:email
		},$or:[{user:userName}]
	}).then((user) =>{
		if(user == undefined){

			///HASH
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(password, salt);
			//Cadastro
			User.create({
				email:email,
				username: userName,
				password:hash
			}).then(() =>{
				res.redirect("/");
			}).catch((err) => res.redirect("/"))
		}else{
			res.json({email,userName,password})
		}
	})
}),


router.get("/login", (req,res) =>{
	Category.findAll().then(categories =>{
		res.render("admin/users/login",{categories:categories})
	})

})

router.post("/authenticate", (req,res) =>{
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({where:{username:username}}).then(user =>{
		if(user != undefined){
			var auth = bcrypt.compareSync(password,user.password)

			if(auth){
				req.session.user = {
					id: user.id,
					user:user.username
				}
				res.redirect("/admin/articles")
			}else{
				res.redirect("/login")
			}
		}else{
			res.redirect("/login")
		}
	})
})

router.get("/logout", (req,res) => {
	req.session.user = undefined;
	res.redirect("/")
})

module.exports = router;
