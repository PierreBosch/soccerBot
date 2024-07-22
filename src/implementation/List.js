import { Command } from "../contracts/Command.js";

export class List extends Command {
  constructor(bot) {
    super();
    this.bot = bot;
  }

  execute() {
    this.bot.sendMessage("Listando!");
  }
}