
function getAvailableCommandsTemplate() {
  return `*🚨 Comandos Disponíveis*

*⚽ Lista do Futebol*

\`\`\`/lista\`\`\`     
_mostra lista atual de jogadores e goleiros_

\`\`\`/add\`\`\`
_adiciona automaticamente seu nome na lista como jogador de linha_

\`\`\`/add | Nome do convidado\`\`\`
_adiciona automaticamente o nome do convidado como jogador de linha_

\`\`\`/goleiro\`\`\`
_adiciona automaticamente seu nome na lista como goleiro_

\`\`\`/goleiro | Nome do convidado\`\`\`
_adiciona automaticamente o nome do convidado como goleiro_

\`\`\`/fora\`\`\`      
_retira seu nome automaticamente da lista do futebol_

\`\`\`/fora | Nome do convidado\`\`\`      
_retira o nome do convidado da lista do futebol_

*🤑 Pagamentos*

\`\`\`/pix\`\`\`       
_mostra a chave pix para pagamentos_

\`\`\`/jogo\`\`\`      
_mostra o valor a pagar do jogo_

\`\`\`/coca\`\`\`      
_mostra o valor a pagar da coca_

\`\`\`/churrasco\`\`\` 
_mostra o valor a pagar do churrasco_

*👨🏻‍🍳 Cardápio*

\`\`\`/cardapio\`\`\`
_mostra o cardápio da semana_

*🏃🏻 Escalação*

\`\`\`/escalacao\`\`\`
_mostra a escalação da semana_

*🥩 Lista do Churrasco*

\`\`\`/add-churras\`\`\`
_adiciona no churrasco 🥩_

\`\`\`/add-churras-coca\`\`\`
_adiciona no churrasco 🥩 com coca 🥤_

\`\`\`/fora-churras\`\`\`
_retira do churrasco_

\`\`\`/lista-churras\`\`\`
_divulga a lista do churrasco atual_

*📟 Listar comandos*

\`\`\`/ajuda\`\`\`  _mostra os comandos disponíveis_`;
}

module.exports = getAvailableCommandsTemplate