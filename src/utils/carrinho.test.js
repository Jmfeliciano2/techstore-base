import test from 'node:test'
import assert from 'node:assert/strict'

import { agruparItens, calcularTotal } from './carrinho.js'

test('calcularTotal soma preços em texto e numéricos corretamente', () => {
    const total = calcularTotal([
        { price: '89' },
        { price: 45 },
        { price: null },
        { price: undefined },
        { price: '0' },
    ])

    assert.equal(total, 134)
})

test('agruparItens conta as unidades repetidas do mesmo produto', () => {
    const itens = agruparItens([
        { id: 1, price: 25 },
        { id: 1, price: 25 },
        { id: 2, price: 35 },
    ])

    assert.deepEqual(itens, [
        { produto: { id: 1, price: 25 }, quantidade: 2 },
        { produto: { id: 2, price: 35 }, quantidade: 1 },
    ])
})
