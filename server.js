//configurando o servidor
const express = require("express");
const server = express()

//configurando server para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do form
server.use(express.urlencoded({
    extended: true
}))


//configurando conexão com banco psql
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doesangue'
})

//configurando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})


//configurando a apresentação da página
server.get("/", (req, res) => {
    
    db.query("SELECT * FROM donors", (err, result) => {
        if(err) return res.send("Erro de banco de dados.");

        //result é um objeto que trará as linhas da query
        const donors = result.rows;
        return res.render("index.html", { donors })
    })
})

server.post("/", (req, res) => {
    //pegar dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send('Todos os campos são obrigatórios.')
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, (err) => {
        if(err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })


})


//ligando servidor e permitindo acesso na porta 3333
server.listen(3333, () => {
    console.log('server started')
});