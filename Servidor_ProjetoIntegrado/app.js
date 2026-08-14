const express = require('express');
const { execSync } = require('child_process');

const app = express();
app.use(express.json()); 
app.use(express.static(__dirname));

let historico = [];

app.post('/leituras', (req, res) => {
    let valor = req.body.valor;

    let resultado = execSync(`python ../IA_ProjetoIntegrado.py ${valor}`).toString().trim();
    let classificacao = parseInt(resultado);

    let leitura = {
        valor: valor,
        classificacao: classificacao,
        timestamp: new Date()
    };

    historico.push(leitura);

    res.json({ mensagem: "Recebido", leitura: leitura });
});

app.get('/leituras', (req, res) => {
    if (historico.length === 0) {
        res.status(404).json({ mensagem: "Nenhuma leitura ainda" });
    } else {
        let ultima = historico[historico.length - 1];
        res.json({ atual: ultima, historico: historico });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000/');
});