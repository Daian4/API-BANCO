let db = require('../bancodedados')

const listagemDeContas = (req, res) => {
    //listagem de array de contas existentes
    return res.status(200).json(db.contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    //// verificar campos obrigatórios
    verificarCampoObrigatorio(req, res)

    // verificar conta com o cpf informado
    if (db.contas.some((conta) => conta.usuario.cpf === cpf)) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    // verificar conta com o email informado
    if (db.contas.some((conta) => conta.usuario.email === email)) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    // Cadastrar nova conta
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

    //adicionando nova conta
    db.contas.push(novaConta);
    db.numeroDaconta++;

    return res.status(201).json({ "mensagem": "Conta cadastrada com sucesso" })
}

const atualizarConta = (req, res) => {
    const numero = req.params.numeroConta
    let { cpf, email } = req.body;

    // verificar campos obrigatórios
    verificarCampoObrigatorio(req, res);

    // verificar o numero da conta
    const conta = verificarContaExistente(numero);

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }


    // 400 Bad Request - o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
    if (db.contas.some((conta) => conta.usuario.cpf === cpf && conta.numero !== numero)) {
        return res.status(400).json({ "mensagem": "O CPF informado já existe cadastrado!" });
    }
    // 400 Bad Request - o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
    if (db.contas.some((conta) => conta.usuario.email === email && conta.numero !== numero)) {
        return res.status(400).json({ "mensagem": "O email informado já existe cadastrado!" });
    }

    // atualização dos dados
    conta.usuario = req.body

    res.status(200).json(conta)
}

const excluirConta = (req, res) => {
    const numero = req.params.numeroConta

    // verificar o numero da conta
    const conta = verificarContaExistente(numero);

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    // Permitir excluir uma conta bancária apenas se o saldo for 0 (zero)
    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    // Remover a conta do objeto de persistência de dados.
    db.contas = db.contas.filter((conta) => conta.numero !== numero)

    // 204 No Content - Não há conteúdo para enviar para esta solicitação
    res.sendStatus(204)
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    // Verificar se o numero da conta e a senha foram informadas 
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e senha são obrigatórios!' })
    }

    // Verificar se a conta bancária informada existe
    const conta = verificarContaExistente(numero_conta);

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    //Exibir o saldo da conta bancária em questão
    res.status(200).json({ "saldo": conta.saldo })

}

const extratoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query

    // Verificar se o numero da conta e a senha foram informadas 
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e senha são obrigatórios!' })
    }

    // Verificar se a conta bancária informada existe
    const conta = verificarContaExistente(numero_conta);

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (!conta) { return res.status(404).json({ mensagem: 'usuario não encontrado.' }) }

    // Filtrar depósitos e saques apenas para a conta em questão
    const depositosDaConta = db.depositos.filter((deposito) => deposito.numero_conta === numero_conta);
    const saquesDaConta = db.saques.filter((saque) => saque.numero_conta === numero_conta);
    const transferenciasEnviadasDaConta = db.transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidaDaConta = db.transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta);

    // Retornar a lista de transferências, depósitos e saques da conta em questão.
    const extrato = {
        deposito: depositosDaConta,
        saque: saquesDaConta,
        transferenciasEnviadas: transferenciasEnviadasDaConta,
        transferenciasRecebidas: transferenciasRecebidaDaConta
    };

    // Retornar o extrato
    return res.status(200).json(extrato);
}

//verificar se todos os campos estão completos
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

    // 404 Not Found - o servidor não pode encontrar o recurso solicitado
    if (campoFaltante) {
        // se campoFaltante for verdadeiro, entrará no if. undefined, null... não são valores true.
        return res.status(400).json({ mensagem: `${campoFaltante.nomeDoCampo} é obrigatório.` })
    }
}

const verificarContaExistente = (numero) => {
    // verificar o numero da conta
    return db.contas.find((conta) => conta.numero === numero)
}

module.exports = { listagemDeContas, criarConta, atualizarConta, excluirConta, consultarSaldo, extratoDaConta }