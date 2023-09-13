let db = require('./bancodedados')

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({
            "mensagem": "A senha do banco informada é inválida!"
        })
    }

    next();
}

const validacaoDeSenha = (req, res, next) => {
    const { senha } = req.query


    const conta = db.contas.find((conta) => conta.usuario.senha === senha)


    if (!conta) {
        return res.status(401).json({
            "mensagem": "A senha do banco informada é inválida!"
        })
    }

    next();
}


module.exports = { validarSenha, validacaoDeSenha }
