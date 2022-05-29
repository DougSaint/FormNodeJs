const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify")
const AdminAuth = require("../adminAuth")

//rota criar categorias
router.get("/admin/categories/new", AdminAuth, (req, res) => {
	res.render("admin/categories/new");
})


//salvar categorias
router.post('/categories/save', AdminAuth, (req, res) => {
	var title = req.body.title;
	if(title){
		Category.create({
			title: title,
			slug: slugify(title)
		}).then(() => {
			res.redirect("/admin/categories");
		}).catch((err) => console.log(err))
	}else{
		res.redirect("/admin/categories/new");
	}
});


//Listar categorias
router.get("/admin/categories", AdminAuth, (req, res) =>{
	Category.findAll().then(categories => {
		res.render("admin/categories/index",{
			categories:categories
		});
	});
});


//Deletar categoria
router.post("/admin/categories/delete", AdminAuth, (req, res) => {
	var id = req.body.id;
	if(id != undefined){
		if(!isNaN(id)){
			Category.destroy({
				where: {
					id: id
				}
			}).then(() => {res.redirect("/admin/categories")})
		}else{res.redirect("/admin/categories")}
	}else{res.redirect("/admin/categories")}
})

router.get("/admin/categories/edit/:id",  AdminAuth, (req, res) =>{
	var id = req.params.id;
	if(isNaN(id)){
		res.redirect("/admin/categories");
	}else{
	Category.findByPk(id).then(category =>{
		if (category != undefined){
			res.render("admin/categories/edit",{category:category});
		}else{
			res.redirect("/admin/categories");
		}
	})}
});

router.post("/admin/categories/update",  AdminAuth, (req, res) =>{
	var id = req.body.id;
	var title = req.body.title
	Category.update({
		title: title,
		slug: slugify(title)
	},
	{
		where:{
			id:id
		}
	}).then(() => {
		res.redirect("/admin/categories");
	})
});

module.exports = router;
