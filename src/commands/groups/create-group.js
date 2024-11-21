const groupService = require("./http/group-service");
const listService = require("./http/lists-service");
async function createGroup(message, client) {
  try {
      const groupId = message.from;
      const [, ...groupName] = message.content.split(" ")

      if(!Boolean(groupName.join(''))) {
        return await client.sendText(groupId, `Opa! Faltou dar um nome para o grupo! \n\n Ex: \`/configurar Nome do grupo\``)
      }
      
      await groupService.create(groupId, groupName.join(" "));
      await listService.create(groupName.join(" "), groupId)     
      
      await client.sendText(groupId, `✅ Grupo _*${groupName.join(" ")}*_ configurado`)
  } catch (error) {
      console.log(error)
  }
}

module.exports = createGroup;



