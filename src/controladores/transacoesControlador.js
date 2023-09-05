let db = require('../bancodedados')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    // Verificar se o numero da conta e o valor do deposito foram informados no body
    // 400 Bad Request - o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
    if (!numero_conta || valor === undefined) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' })
    }

    // Não permitir depósitos com valores negativos ou zerados
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor de depósito precisa ser maior que 0' });
    }

    // Verificar se a conta bancária informada existe
    const conta = db.contas.find((conta) => conta.numero === numero_conta)

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    // Somar o valor de depósito ao saldo da conta encontrada
    conta.saldo += valor;

    // Registrar o depósito
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

    // Verificar se o numero da conta, o valor do saque e a senha foram informados
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' })
    }

    // Verificar se a conta bancária e senha informada existe
    const conta = db.contas.find((conta) => conta.numero === numero_conta && conta.usuario.senha === senha)

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    // Verificar se há saldo disponível para saque
    if (conta.saldo <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    } else if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    //subtrair o valor sacado do saldo da conta encontrada
    conta.saldo -= valor;

    //registro de saque
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

    // Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados
    const camposObrigatorio = [
        { nomeParametro: numero_conta_origem },
        { nomeParametro: numero_conta_destino },
        { nomeParametro: valor },
        { nomeParametro: senha, }
    ]
    const campoFaltante = camposObrigatorio.find((campo) => !campo.nomeParametro)

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (campoFaltante) {

        return res.status(400).json({ mensagem: 'número da conta de origem, de destino, senha e valor são obrigatórios!' })
    }

    //Verificar se a conta bancária de origem informada existe
    const contaOrigem = db.contas.find((conta) => conta.numero === numero_conta_origem)

    //Verificar se a conta bancária de destino informada existe
    const contaDestino = db.contas.find((conta) => conta.numero === numero_conta_destino)

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    // Verificar se a senha informada é uma senha válida para a conta de origem informada
    const autenticacaoValida = contaOrigem.usuario.senha === senha

    // 401 Unauthorized - o usuário não está autenticado 
    if (!autenticacaoValida) {
        return res.status(401).json({ mensagem: 'Autentificação inválida!' })
    }

    // Verificar se há saldo disponível na conta de origem para a transferência
    if (valor <= 0 || contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    // Subtrair o valor da transfência do saldo na conta de origem 
    contaOrigem.saldo -= valor


    // Somar o valor da transferência no saldo da conta de destino
    contaDestino.saldo += valor

    // Registrar transferência
    const transferencias = {
        data: formatarData(new Date()),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    db.transferencias.push(transferencias)

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