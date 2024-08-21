async function getAudioParmegiana(message, client) {
  const sender = message.from;

  await client.sendText(sender, 'Sim, Rafael, isso é óbvio. Na verdade, o certo era tu nem jogar hoje. Por se tu vai jogar já futebol amanhã, entendeu? Mas é porque tu não quer perder nada, tu quer participar de tudo, não quer perder.. sair perdendo de nenhuma coisa, entendeu? Se tu já tinha combinado a questão era nem ter combinado comigo. E se tu quiser cancelar, não tem problema. Só pra eu me programar mesmo. Dai eu tiro o frango a parmegiana ali e como também, fazer o que... né. Mas é porque é muito cansativo, né? Tu já não vai jogar amanhã. Mas é porque tu não quer sair perdendo, tu quer tá em tudo.')
}

module.exports = getAudioParmegiana

