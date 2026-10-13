import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { produtoDisponivel } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar }) {
  const { id } = useParams()
  const [dadosAviso, setDadosAviso] = useState({ nome: '', email: '' })
  const [mensagemAviso, setMensagemAviso] = useState('')

  const produto = produtos.find((item) => String(item.id) === String(id))

  if (!produto || !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = produto.estoque === 0
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && produtoDisponivel(item))
    .slice(0, 4)

  function cadastrarAviso(evento) {
    evento.preventDefault()

    if (!dadosAviso.nome.trim() || !dadosAviso.email.trim()) {
      setMensagemAviso('Informe seu nome e e-mail para receber o aviso.')
      return
    }

    const lista = JSON.parse(localStorage.getItem('techstore-alertas') || '[]')
    const email = dadosAviso.email.trim().toLowerCase()
    const jaRegistrado = lista.some(
      (item) => item.produtoId === produto.id && item.email.toLowerCase() === email
    )

    if (jaRegistrado) {
      setMensagemAviso('Você já está na lista de espera deste produto.')
      return
    }

    lista.push({
      produtoId: produto.id,
      produtoNome: produto.title,
      nome: dadosAviso.nome.trim(),
      email,
      data: new Date().toISOString(),
    })

    localStorage.setItem('techstore-alertas', JSON.stringify(lista))
    setMensagemAviso('Cadastro realizado com sucesso. Você receberá um aviso quando o produto voltar.')
    setDadosAviso({ nome: '', email: '' })
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={esgotado}
          >
            {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <form onSubmit={cadastrarAviso} className="aviso-form">
              <label htmlFor="nome-aviso">Nome</label>
              <input
                id="nome-aviso"
                value={dadosAviso.nome}
                onChange={(evento) => setDadosAviso((atual) => ({ ...atual, nome: evento.target.value }))}
                placeholder="Seu nome"
              />

              <label htmlFor="email-aviso">E-mail</label>
              <input
                id="email-aviso"
                type="email"
                value={dadosAviso.email}
                onChange={(evento) => setDadosAviso((atual) => ({ ...atual, email: evento.target.value }))}
                placeholder="seu@email.com"
              />

              <button type="submit" className="botao botao-secundario">
                Avise-me quando voltar
              </button>
              {mensagemAviso && <p className="mensagem-cupom">{mensagemAviso}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
