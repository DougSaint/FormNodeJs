const express = require("express");
const app = express();
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController")

const Category = require("./categories/Category");
const Article = require("./articles/Article");


//session

app.use(session({
	secret: "fioraisthebestchampionintheworld",
	cookie: {maxAge: 3000000},
    resave: true,
    saveUninitialized: false
}))

//view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//arquivos estaticos

app.use(express.static('public'));

//database
connection
	.authenticate()
	.then(() =>{
		console.log("Conexao feita com sucesso!");
	}).catch((err) => console.log(err));



app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController)


app.get("/",(req, res) =>{
	Article.findAll({
		order:[['id', 'DESC']],
		limit:4
	}).then(articles =>{
		Category.findAll().then(categories =>{
			res.render("index",{articles:articles, categories:categories});
		})
	});
})

app.get("/:slug",(req,res) =>{
	var slug = req.params.slug;
	Article.findOne({
		where: {
			slug:slug
		}
	}).then(article =>{
		if(article != undefined){
			Category.findAll().then(categories =>{
				res.render("article",{
					article:article,categories:categories
				})
			})
		}else{
			res.redirect("/")
		}
	}).catch((err) => {
		console.log(err);
		res.redirect("/");
	})
})

app.get("/category/:slug",(req,res) =>{
	var slug = req.params.slug;
	Category.findOne({
		where:{
			slug:slug
		},
		include:[{model: Article}]
			}).then(category => {
		if(category != undefined){
			Category.findAll().then(categories => {
				res.render("index", {articles: category.articles, categories:categories})
			})
		}else{
			res.redirect("/")
		}
	}).catch((err) => console.log(err))
})

app.listen(8080, ()=>{
	console.log("O servidor está rodando!");
})
