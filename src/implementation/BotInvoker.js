export class BotInvoker {
  constructor() {
    this.commands = {};
  }

  registerCommand(commandName, command) {
    this.commands[commandName] = command;
  }

  executeCommand(commandName) {
    const command = this.commands[commandName];
    if(!command) {
      throw new Error('Comando não encontrado.')
    }  
    command.execute();
    
  }
}