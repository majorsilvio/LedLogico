class Controller{ //controlador
	constructor(){
		this.table = []; //cria o atributo tabela.
		this.reset = [];///cria o atributo reset.
		this.count = 0; //cria o atributo count.
	}

	endGame(){ //função pra terminar o jogo
		for (var i = 0; i < this.table.length; i++) {
			for (var j = 0; j < this.table[i].length; j++) {
				if (this.table[i][j]) { //se ainda tiver algum led aceso, o jogo continua
					return false
				}
			}
		}
		return true; //se todos tiverem apagados o jogo termina.
	}

	createTable(){ //cria a tabela do jogo propriamente dita.

		for (var i = 0; i < 5; i++) { //cria a tabela com 5 elementos em cada linha.
			this.table.push([]); //adiciona valores ao array.
			for (var j = 0; j < 5; j++) { //cria a tabela com 5 elementos em cada coluna.
				this.table[i][j] = 0; // de início todos os elementos começam apagados.
			}
		}
	}

	generateElements(){ //gerar elementos da tabela
		
		var element = ''; // a variável elemento tá vazia pra ir adicionando se ela tá acesa ou apagada aleatoriamente. 
		
		for (var i = 0; i < this.table.length; i++) { //anda por cada elemento da linha um por um.
			for (var j = 0; j < this.table[i].length; j++) { //anda por cada elemento da coluna um por um.
				if (this.table[i][j]) { //caso o led esteja apagado
					element += `<a href="change/${i}/${j}"><div class="grid-item lit"></div></a>` //acende
				}else{
					element += `<a href="change/${i}/${j}"><div class="grid-item out"></div></a>` //apaga
				}
			}
		}
		return element;
	}

	change(lin,col){ //muda se os elementos tão acesos ou apagados
		var linToChange = [lin - 1, lin + 1]; // muda um elemento da linha de cima e da linha de baixo
		var colToChange = [col - 1, col + 1]; //muda um elemento da coluna de cima e um da coluna de baixo
		for (var i = 0; i < linToChange.length; i++) { //anda pelos elementos da linha.
			if (this.table[linToChange[i]] != undefined && this.table[linToChange[i]][col] != undefined) {
				if (this.table[linToChange[i]][col] == 1) { //se os dois elementos da linha ao redor tiverem acesos
					this.table[linToChange[i]][col] = 0 //apaga
				}else{
					this.table[linToChange[i]][col] = 1; //se não, acende.
				}
			}
		}

		for (var i = 0; i < colToChange.length; i++) { //anda pelos elementos da coluna
			if (this.table[lin][colToChange[i]] != undefined && this.table[colToChange[i]] != undefined) {
				if (this.table[lin][colToChange[i]] == 1) { //se os dois elementos da coluna ao redor tiverem acesos
					this.table[lin][colToChange[i]] = 0 // apaga
				}else{
					this.table[lin][colToChange[i]] = 1; //se não, acende
				}
			}
		}
		if (this.table[lin][col]) { //se o elemento que clicou em cima tá aceso
			this.table[lin][col] = 0; //apaga

		}else{
			this.table[lin][col] = 1; //se não, acende
		}		
		this.count++ // a cada mudança o contador é encrementado em 1
	}

	makeNivel(clicks){ //cria o nível aleatoriamente, quanto mais clicks, mais difícil é o nível
		for (var i = 0; i < clicks; i++) {
			var lin =Math.floor(Math.random() * (5 - 0)) + 0; 
			var col =Math.floor(Math.random() * (5 - 0)) + 0;
			this.change(lin,col); 
		}

	
	this.makeReset() 
	}
	
	makeReset(){ //faz backup do nível original dentro do atributo.

		for (var i = 0; i < 5; i++) {
			this.reset.push([]);
			for (var j = 0; j < 5; j++) { 
				this.reset[i][j] = this.table[i][j] //atributo reset = nível original
			}
		}
	}

	resetNivel(){ //executa o backup do nível.

		for (var i = 0; i < 5; i++) {
			this.reset.push([]);
				for (var j = 0; j < 5; j++) {
			this.table[i][j] = this.reset[i][j] //quando a função é chamada, a tabela se iguala ao backup, que é como o nível tava no começo do jogo.
			}
		}
	}

}

module.exports = new Controller(); //exporta o arquivo pra ser utilizado em outros lugares.