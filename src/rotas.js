const express = require('express')
const { validarSenha, validacaoDeSenha } = require('./intermediarios')
const {
    listagemDeContas,
    criarConta,
    atualizarConta,
    excluirConta,
    consultarSaldo,
    extratoDaConta
} = require('./controladores/contasControlador')
const { depositar, sacar, transferir } = require('./controladores/transacoesControlador')

const rotas = express();

rotas.get('/contas', validarSenha, listagemDeContas)
rotas.post('/contas', criarConta)
rotas.put('/contas/:numeroConta/usuario', atualizarConta)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.get('/contas/saldo', validacaoDeSenha, consultarSaldo)
rotas.get('/contas/extrato', validacaoDeSenha, extratoDaConta)

rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post("/transacoes/transferir", transferir)

module.exports = rotas;