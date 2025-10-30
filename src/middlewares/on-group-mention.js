const OpenAI = require("openai");
const AMEIXA_PROMPT = require("./prompt");
const getLineup = require("../commands/get-lineup");
const addPlayer = require("../commands/add-player");
const addChurras = require("../commands/add-barbecue-eater");
const deletePlayer = require("../commands/delete-player");
const deleteBarbecueEater = require("../commands/delete-barbecue-eater");
const getLinkLive = require("../commands/get-link-live");

const functionHandlers = {
  getLineup: getLineup,
  addPlayer: addPlayer,
  addGuestPlayer: addPlayer,
  deletePlayer: deletePlayer,
  deletePlayerGuest: deletePlayer,
  deleteBarbecueEater: deleteBarbecueEater,
  addChurras: addChurras,
  addChurrasCoca: addChurras,
  getLinkLive: getLinkLive
};

function onGroupMention(client, message) {
  if (message.isGroupMsg) {
      // Verificar se você foi mencionado
      if (message.mentionedJidList && message.mentionedJidList.length > 0) {
        // Obter seu próprio número
        client.getHostDevice().then((hostDevice) => {
          const myNumber = message.body.split(' ')[0].trim().replace('@', '')
          
          // Verificar se seu número está na lista de mencionados
          const wasMentioned = message.mentionedJidList.some(
            mention => mention.includes(`${myNumber}@c.us`)
          );
          
          if (wasMentioned) {
            // Verificar se a chave da API está configurada
            if (!process.env.OPENAI_API_KEY) {
              console.error('ERRO: OPENAI_API_KEY não está configurada!');
              return client.sendText(message.from, 'Desculpe, estou com problemas de configuração. Entre em contato com o administrador.');
            }
           
            const openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });

            openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: AMEIXA_PROMPT
                  },
                  {
                    role: "user", 
                    content: message.body.replace(/^@\d+\s+/, ''),
                  }
                ],
                tools: [
                  {
                    type: "function",
                    function: {
                      name: "getLineup",
                      description: "Envia a escalação do jogo",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "addPlayer",
                      description: "Adiciona o nome de quem enviou a mensagem como jogador de linha",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "addGuestPlayer",
                      description: "Adiciona um convidado de fora do grupo como jogador de linha",
                      parameters: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                            description: "Nome do convidado a ser adicionado como jogador de linha"
                          }
                        },
                        required: ["nome"]
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "addChurras",
                      description: "Adiciona o nome de quem enviou a mensagem na lista do churrasco",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "addChurrasCoca",
                      description: "Adiciona o nome de quem enviou a mensagem na lista do churrasco e coca-cola (bebida). Deve ser chamada se a mensagem indicar que a pessoa quer participar do churrasco com bebida, coca, ou tudo incluso. Exemplos: 'Me coloca no churras com bebida', 'Quero churras com tudo que tem direito', 'Churrasco com coca'.",
                      parameters: {
                        type: "object",
                        properties: {
                          coca: {
                            type: "boolean",
                            description: "Se a pessoa deseja participar do churrasco e também quer coca-cola (bebida). Deve ser true se a mensagem indicar churrasco com bebida, coca, ou tudo incluso."
                          }
                        },
                        required: ["coca"]
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "deletePlayer",
                      description: "Remove o nome de quem enviou a mensagem da lista de jogadores",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "deletePlayerGuest",
                      description: "Remove o nome de um convidado da lista de jogadores",
                      parameters: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                            description: "Nome do convidado a ser adicionado como jogador de linha"
                          }
                        },
                        required: ["nome"]
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "deleteBarbecueEater",
                      description: "Remove o nome de quem enviou a mensagem da lista de participantes do churrasco",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                  {
                    type: "function",
                    function: {
                      name: "getLinkLive",
                      description: "Responde com o link da transmissão ao vivo do jogo (live)",
                      parameters: {
                        type: "object",
                        properties: {},
                        required: []
                      }
                    }
                  },
                ],
                max_tokens: 600,
                temperature: 0.8
            }).then(async (response) => {
              const choice = response.choices[0].message;
              console.log('Resposta da OpenAI:', choice);
              
              // Verificar se a OpenAI chamou alguma função (nova API)
              if (choice.tool_calls && choice.tool_calls.length > 0) {
                const toolCall = choice.tool_calls[0];
                let args = toolCall.function.arguments
                  ? JSON.parse(toolCall.function.arguments)
                  : {};

                args.isAgent = true; // Adiciona a flag isAgent para indicar que é uma chamada de agente

                return await functionHandlers[toolCall.function.name](message, client, args);
              }
             

              // Se não pediu função, envia a resposta normal
              const resposta = choice.content;
              if (resposta) {
                client.sendText(message.from, resposta)
                  .then(() => {
                    console.log('Resposta enviada com sucesso!');
                  })
                  .catch((error) => {
                    console.error('Erro ao enviar resposta:', error);
                  });
              } else {
                console.error('Resposta inválida:', response);
              }
            }).catch((error) => {
              console.error('Erro ao chamar OpenAI:', error);
              
              // Mensagem de erro amigável para o usuário
              let errorMessage = 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente!';
              
              // Tratamento específico para erros comuns
              if (error.status === 401) {
                errorMessage = 'Erro de autenticação com a OpenAI. Verifique a chave da API.';
                console.error('ERRO: Chave da API inválida ou expirada');
              } else if (error.status === 429) {
                errorMessage = 'Muitas requisições. Aguarde um momento e tente novamente.';
              } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                errorMessage = 'Sem conexão com a OpenAI. Verifique sua internet.';
              }
              
              client.sendText(message.from, errorMessage)
                .catch((sendError) => {
                  console.error('Erro ao enviar mensagem de erro:', sendError);
                });
            });

                      }
                    });
                  }
              }
            }

module.exports = onGroupMention