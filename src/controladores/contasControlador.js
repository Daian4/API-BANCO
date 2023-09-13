let db = require('../bancodedados')

const listagemDeContas = (req, res) => {

    return res.status(200).json(db.contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    verificarCampoObrigatorio(req, res)

    if (db.contas.some((conta) => conta.usuario.cpf === cpf)) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    if (db.contas.some((conta) => conta.usuario.email === email)) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const novaConta = {
        numero: db.numeroDaconta.toString(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        }
    }

    db.contas.push(novaConta);
    db.numeroDaconta++;

    return res.status(201).json({ "mensagem": "Conta cadastrada com sucesso" })
}

const atualizarConta = (req, res) => {
    const numero = req.params.numeroConta
    let { cpf, email } = req.body;

    verificarCampoObrigatorio(req, res);

    const conta = verificarContaExistente(numero);

    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    if (db.contas.some((conta) => conta.usuario.cpf === cpf && conta.numero !== numero)) {
        return res.status(400).json({ "mensagem": "O CPF informado já existe cadastrado!" });
    }

    if (db.contas.some((conta) => conta.usuario.email === email && conta.numero !== numero)) {
        return res.status(400).json({ "mensagem": "O email informado já existe cadastrado!" });
    }

    conta.usuario = req.body

    res.status(200).json(conta)
}

const excluirConta = (req, res) => {
    const numero = req.params.numeroConta

    const conta = verificarContaExistente(numero);

    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    db.contas = db.contas.filter((conta) => conta.numero !== numero)

    res.sendStatus(204)
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e senha são obrigatórios!' })
    }

    const conta = verificarContaExistente(numero_conta);

    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    res.status(200).json({ "saldo": conta.saldo })

}

const extratoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e senha são obrigatórios!' })
    }

    const conta = verificarContaExistente(numero_conta);

    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    const depositosDaConta = db.depositos.filter((deposito) => deposito.numero_conta === numero_conta);
    const saquesDaConta = db.saques.filter((saque) => saque.numero_conta === numero_conta);
    const transferenciasEnviadasDaConta = db.transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidaDaConta = db.transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta);

    const extrato = {
        deposito: depositosDaConta,
        saque: saquesDaConta,
        transferenciasEnviadas: transferenciasEnviadasDaConta,
        transferenciasRecebidas: transferenciasRecebidaDaConta
    };

    return res.status(200).json(extrato);
}

const verificarCampoObrigatorio = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const camposObrigatorio = [
        { nomeParametro: nome, nomeDoCampo: 'nome' },
        { nomeParametro: cpf, nomeDoCampo: 'cpf' },
        { nomeParametro: data_nascimento, nomeDoCampo: 'data de nascimento' },
        { nomeParametro: telefone, nomeDoCampo: 'telefone' },
        { nomeParametro: email, nomeDoCampo: 'email' },
        { nomeParametro: senha, nomeDoCampo: 'senha' }
    ]
    const campoFaltante = camposObrigatorio.find((campo) => !campo.nomeParametro)

    if (campoFaltante) {
        return res.status(400).json({ mensagem: `${campoFaltante.nomeDoCampo} é obrigatório.` })
    }
}

const verificarContaExistente = (numero) => {
    return db.contas.find((conta) => conta.numero === numero)
}

module.exports = { listagemDeContas, criarConta, atualizarConta, excluirConta, consultarSaldo, extratoDaConta }