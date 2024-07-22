import { Command } from "../contracts/Command.js";

export class Add extends Command {
  constructor(bot) {
    super();
    this.bot = bot;
  }

  execute() {
    this.bot.sendMessage("Adicionando!");
  }
}