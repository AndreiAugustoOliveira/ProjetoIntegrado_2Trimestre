const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const carros = [
    { id: 1, modelo: "Polo", montadora: "Volkswagen", categoria: "urbano", quantidade: 21 },
    { id: 2, modelo: "Onix", montadora: "Chevrolet", categoria: "urbano", quantidade: 7 },
    { id: 3, modelo: "Corolla", montadora: "Toyota", categoria: "familiar", quantidade: 2 },
    { id: 4, modelo: "Mobi", montadora: "Fiat", categoria: "urbano compacto", quantidade: 10 },
    { id: 5, modelo: "Kwid", montadora: "Renault", categoria: "urbano compacto", quantidade: 15 },
    { id: 6, modelo: "SW4", montadora: "Toyota", categoria: "SUV luxo", quantidade: 1 },
    { id: 7, modelo: "Creta", montadora: "Hyundai", categoria: "SUV", quantidade: 9 },
    { id: 8, modelo: "Renegade", montadora: "Jeep", categoria: "SUV", quantidade: 3 }
];
const USUARIO_PADRAO = "admin";
const SENHA_PADRAO = "Movi123";
let logado = false;
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/carros", (req, res) => {
    const modelo = req.query.modelo;
    if (!modelo) {
        return res.status(200).json(carros);
    }
    const filtrados = [];
    for (let i = 0; i < carros.length; i++) {
        if (carros[i].modelo === modelo) {
            filtrados.push(carros[i]);
        }
    }
    res.status(200).json(filtrados);
});
app.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if (usuario === USUARIO_PADRAO && senha === SENHA_PADRAO) {
        logado = true;
        return res.status(200).json({
            mensagem: "Login realizado com sucesso!"
        });
    } 
    logado = false;
    res.status(401).json({
        erro: "Usuário ou senha incorretos."
    });
});
app.post("/reserva", (req, res) => {
       if (!logado) {
        return res.status(401).json({
            erro: "Faça login antes de reservar."
        });
    }
    const id = req.body.id;
    const quantidade = req.body.quantidade;
    const usuario = req.body.usuario;
    if (!id || !quantidade || !usuario) {
        return res.status(400).json({
            erro: "Envie id, quantidade e usuário."
        });
    }
    let carro = null;
    for (let i = 0; i < carros.length; i++) {
        if (carros[i].id === id) {
            carro = carros[i];
            break;
        }
    }
    if (carro === null) {
        return res.status(404).json({
            erro: "Carro não encontrado."
        });
    }

    if (quantidade > carro.quantidade) {
        return res.status(400).json({
            erro: "Estoque insuficiente. Disponível: " + carro.quantidade
        });

    }
    carro.quantidade -= quantidade;
    res.status(201).json({
        mensagem: "Reserva registrada para " + usuario,
        carro: carro.modelo,
        restante: carro.quantidade
    });

});

app.listen(3000, () => {
    console.log("Servidor MOVI rodando em http://localhost:3000");
});