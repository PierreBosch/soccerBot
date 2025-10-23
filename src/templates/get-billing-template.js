const templates = [
`🎉⚽ Fala, {nome}! ⚽🎉

Prepare as chuteiras e deixe tudo pronto pro jogo! 🌟 Aqui estão os detalhes pra organizar tudo certinho:

⚽ Jogo: R$ 14,00
🥤 Bebida: R$ 7,00
🥩 Churrasco pós-jogo: R$ 20,00

💸 Chave PIX: (48) 99674-2125 (🟠 Banco Inter)

Assim que fizer a transferência, manda um \`/pago\` aqui pra confirmar. Bora focar no futebol e deixar a resenha garantida! 😎

Abraço,
Ameixa Bot`,
`🚨⚽ Ei, {nome}! ⚽🚨

Percebemos que você ainda não efetuou o pagamento para o jogo desta semana. Bora regularizar pra garantir sua vaga e aquele pós-jogo? 💸

Aqui estão os valores:
⚽ Jogo: R$ 14,00
🥤 Coca-cola: R$ 7,00
🥩 Churrasco no pós-jogo: R$ 20,00

💸 Chave PIX: (48) 99674-2125 (🟠 Banco Inter)

Não deixe de mandar um \`/pago\` assim que realizar o pagamento. Contamos com você pra fazer desse jogo mais um sucesso! 🚀

Abraço,
Ameixa Bot`,
`🚨⚽ Fala, {nome}! ⚽🚨

Passando aqui pra lembrar que seu pagamento ainda está pendente. Bora acertar isso pra fechar a rodada certinho? 💸

Aqui estão os valores:
⚽ Jogo: R$ 14,00
🥤 Bebida: R$ 7,00
🥩 Churrasco: R$ 20,00

💸 Chave PIX: (48) 99674-2125 (🟠 Banco Inter)

Assim que fizer a transferência, manda um \`/pago\` aqui pra gente registrar. Valeu pela parceria e até o próximo jogo! ⚽🔥

Abraço,
Ameixa Bot`,
`🎉🙌 Valeu, {nome}! 🙌🎉

Pagamento confirmado! ⚽🔥

Mais uma semana garantida com jogos, resenhas e diversão. 

Que venha a próxima rodada épica nos gramados! 🌟

Abraço,
Ameixa Bot`,
]

function getBillingTemplate(position) {
  return templates[position]
}



module.exports = getBillingTemplate;