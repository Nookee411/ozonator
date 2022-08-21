const knex = require("./knex")
const processTask = require("./taskProcessor")

const processQueue = async () => {
  const tasks = await knex('tasks')

  for(const task of tasks){
    await processTask(task)
  }
}

module.exports = processQueue