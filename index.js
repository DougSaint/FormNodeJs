const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta')
//Conexão com a database.
connection.authenticate()
.then(() =>{
console.log("conexão successiful")
}).catch((err) => console.log(err))

//config express
app.set('view engine', 'ejs');
app.use(express.static ('public'));

//getform
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.get('/',(req,res) => {
	Pergunta.findAll({raw:true, order:[
		['id','DESC']
	]}).then(perguntas => {
		res.render("index",{
			pergunta: perguntas
		});
	});
});

app.get('/perguntar',(req,res) => {
	res.render("perguntar");
})
app.post("/salvarpergunta",(req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	})
	.then(() => {res.redirect("/")
	})
})

app.get("/pergunta/:id",(req,res) =>{
	var id = req.params.id;
	Pergunta.findOne({
		where: {id:id}
	}).then(pergunta =>{
		if(pergunta != undefined){
			Resposta.findAll({
				where: {perguntaId: pergunta.id},
				order: [ ['id', 'DESC']]
			}).then(respostas => {
				res.render('pergunta',{
					pergunta:pergunta,
					respostas:respostas
				});
			});
		}else{
			res.redirect('/')
		}
	})
})

app.post("/responder",(req,res) =>{
	var corpo = req.body.corpo;
	var id = req.body.pergunta;
	Resposta.create({
		corpo:corpo,
		perguntaId:id
	}).then(()=>{
		res.redirect("/pergunta/"+id)
	})
})

app.listen(8080,()=>{
	console.log("app working");
});
