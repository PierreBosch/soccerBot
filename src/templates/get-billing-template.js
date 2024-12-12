const templates = [
`🎉⚽ Alô, {nome}! ⚽🎉

Quarta-feira tá chegando, e é hora de aquecer as chuteiras! 🌟 Vamos acertar os detalhes antes da partida pra garantir que tudo corra liso e a resenha esteja garantida:

⚽ Jogo: R$ 12,00
🥤 Coca-cola: R$ 5,00
🥩 Churrasco no pós-jogo: R$ 20,00

💸 Chave PIX: (48) 99674-2125 (Bradesco)

Lembrando que é só mandar um \`/pago\` aqui quando fizer a transferência. Assim, a gente organiza tudo direitinho e só se preocupa com o futebol! 😎

Abraço,
Ameixa Bot`,
`🚨⚽ Ei, {nome}! ⚽🚨

Percebemos que você ainda não efetuou o pagamento para o jogo desta semana. Bora regularizar pra garantir sua vaga e aquele pós-jogo? 💸

Aqui estão os valores:
⚽ Jogo: R$ 12,00
🥤 Coca-cola: R$ 5,00
🥩 Churrasco no pós-jogo: R$ 20,00

💸 Chave PIX: (48) 99674-2125 (Bradesco)

Não deixe de mandar um \`/pago\` assim que realizar o pagamento. Contamos com você pra fazer desse jogo mais um sucesso! 🚀

Abraço,
Ameixa Bot`,
`🎉🙌 Obrigado, {nome}! 🙌🎉

Recebemos seu pagamento e estamos prontos pra mais uma partida épica! ⚽🔥

Prepare-se para brilhar nos gramados e curtir a resenha se você ficou para o pós-jogo! 🌟 Até quarta-feira, e que venha mais uma semana de futebol e diversão!

Abraço,
Ameixa Bot`,
]

function getBillingTemplate(position) {
  return templates[position]
}



module.exports = getBillingTemplate;