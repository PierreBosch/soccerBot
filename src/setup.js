import { Add } from "./implementation/Add.js"
import { Bot } from "./implementation/Bot.js"
import { BotInvoker } from "./implementation/BotInvoker.js"
import { List } from "./implementation/List.js"

const command = '/list'

const bot = new Bot()
const addCommand = new Add(bot)
const listCommand = new List(bot)
const invoker = new BotInvoker()

invoker.registerCommand('/add', addCommand)
invoker.registerCommand('/list', listCommand)

invoker.executeCommand(command)
