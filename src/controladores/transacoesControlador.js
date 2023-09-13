let db = require('../bancodedados')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || valor === undefined) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor de depósito precisa ser maior que 0' });
    }

    const conta = db.contas.find((conta) => conta.numero === numero_conta)

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    conta.saldo += valor;

    const registroDeDeposito = {
        data: formatarData(new Date()),
        numero_conta: numero_conta,
        valor: valor
    }

    db.depositos.push(registroDeDeposito)
    return res.status(200).json({ mensagem: registroDeDeposito });
}

const sacar = (req, res) => {
    const { numero_conta, senha, valor } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' })
    }

    const conta = db.contas.find((conta) => conta.numero === numero_conta && conta.usuario.senha === senha)

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    if (conta.saldo <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    } else if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    conta.saldo -= valor;

    const registroDeSaque = {
        data: formatarData(new Date()),
        numero_conta: numero_conta,
        valor: conta.saldo
    }

    db.saques.push(registroDeSaque)

    return res.status(200).json({ mensagem: registroDeSaque });
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    const camposObrigatorio = [
        { nomeParametro: numero_conta_origem },
        { nomeParametro: numero_conta_destino },
        { nomeParametro: valor },
        { nomeParametro: senha, }
    ]
    const campoFaltante = camposObrigatorio.find((campo) => !campo.nomeParametro)

    if (campoFaltante) {

        return res.status(400).json({ mensagem: 'número da conta de origem, de destino, senha e valor são obrigatórios!' })
    }

    const contaOrigem = db.contas.find((conta) => conta.numero === numero_conta_origem)

    const contaDestino = db.contas.find((conta) => conta.numero === numero_conta_destino)

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    const autenticacaoValida = contaOrigem.usuario.senha === senha

    if (!autenticacaoValida) {
        return res.status(401).json({ mensagem: 'Autentificação inválida!' })
    }

    if (valor <= 0 || contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const registrarTransferencias = {
        data: formatarData(new Date()),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    db.transferencias.push(registrarTransferencias)

    return res.status(200).json({ mensagem: 'Transferência realizada com sucesso!' })
}

// formatar data para string
const formatarData = (data) => {
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const hours = String(data.getHours()).padStart(2, '0');
    const minutes = String(data.getMinutes()).padStart(2, '0');
    const seconds = String(data.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
module.exports = { depositar, sacar, transferir }