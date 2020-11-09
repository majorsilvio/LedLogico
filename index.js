const express = require('express'); //importa o express.
const app = express(); //a página agora vai contasar a ser tratada como uma aplicação.
const fs = require('fs');
const controller = require('./temp/controller.js'); //importa o código da página 'controller.js'


//archives

app.use('/img', express.static(__dirname + '/views/img')); //vai usar as imagens da pasta 'img', dentro do diretório 'views'.

app.use(express.urlencoded({
	extended: true
}))

app.get('/styles', function (req, res) { //também vai usar a página em css do estilo do site.
	res.sendFile(__dirname + '/views/css/styles.css')
});


let nivel;
let continuous = true;

app.get('/', function (req, res) {
	fs.readFile(__dirname + '/views/home.html', 'UTF-8', (err, data) => { //na pagina 'localhost:3000/' está o arquivo de html da home do site.
		nivel = 0; // é atribuído àquela variável nível o valor de 0, pra que possa ser incrementado ao longo do jogo.
		res.send(data);
	})
});

app.get('/game', function (req, res) { //na página 'localhost:3000/game' o jogo em si começa;
	fs.readFile(__dirname + '/views/gameplay.html', 'UTF-8', (err, data) => { //a página do jogo em html é lida.
		var elements = controller.generateElements() //cada elemento recebe a informação se vai estar aceso ou apagado.
		var replaced = data.replace('__elements__', elements).replace('__count__', controller.count).replace("__nivel__", nivel); // tanto os valores dos elementos quanto os do contador vão sendo substituídos a cada jogada.
		res.send(replaced); //e a resposta enviada ao jogador é justamente essas substituições.
	})

});

app.get('/ajuda', function (req, res) { //na página 'localhost:3000/ajuda' está a página 'ajuda.html'.
	res.sendFile(__dirname + '/views/ajuda.html')
});

app.get('/sobre', function (req, res) { //na página 'localhost:3000/sobre' está a página 'sobre.html'.
	res.sendFile(__dirname + '/views/sobre.html')
});
/*teste  */


app.post('/escolhaNivel', function (req, res) { // Da página gameplay.html é pega as informações do nível do input enviado por POST

	nivel = parseInt(req.body.nv) // O variavel nivel recebe o valor do parametro nv do formulário, alem do parseInt converter isso para um valor inteiro. 
	
	if (nivel == 0) {  		// Condição que define o valor boolean do continuous
		continuous = true    
	}
	else {
		continuous = false
	}
	res.redirect('/start')

})

app.get('/start', function (req, res) { 
	if (continuous) {   // Caso o continuous seja true, o programa receberá um incremento a cada execução
		nivel++
	}
	controller.createTable();
	controller.makeNivel(nivel);
	controller.count = 0
	res.redirect('/game')
});



app.get('/change/:lin/:col', function (req, res) { //na página 'localhost:3000/change/:lin/:col' é mudado o elemento que o usuário escolheu, tanto ele, quanto os seus elementos vizinhos.
	var lin = parseInt(req.params.lin); //a variável linha, lá no código 'controller.js' vai se tornar justamente a dada nos parâmetros da página.
	var col = parseInt(req.params.col); //e a mesma coisa com a variável coluna.
	controller.change(lin, col); //e esses valores todos vão ser enviados pra função 'change', pra mudar tanto os elementos quanto os seus vizinhos.

	if (controller.endGame()) { //então, se o jogo termina, o jogador é redirecionado para um novo nível e é chamado de novo aquela função start, que cria tudo do zero.
		res.redirect('/start')
	}

	res.redirect('/game') //e o usuário é redirecionado para a página do jogo propriamente dito.

});


app.get('/reset', function (req, res) { //na página 'localhost:3000/reset', o nível em que o jogador está é reiniciado.
	controller.resetNivel() //é chamada a função 'resetNivel', que vai substituir o jogo atual, com as modificações feitas pelo usuário, para o que ele era originalmente.
	res.redirect('/game') //e de novo o usuário é redirecionado para a página do jogo.
});


app.listen(3000, function () {
	console.log("Servidor rodando na url http//localhost:3000")
}); //a página está sendo "escutada" na porta 3000 do localhost.



