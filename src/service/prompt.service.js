import readline from 'readline'

export default class PromptService {
  static async askForValue (question, options = { isNumber: false, required: true }) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.question(`${question}: `, (answer) => {
        rl.clearLine()
        rl.close()
        if (options.required && !answer) {
          reject(new Error('answer should not be empty'))
        }

        const value = options.isNumber ? Number(answer) : answer
        if (options.isNumber && isNaN(value)) {
          reject(new Error('answer should be a valid number'))
        }

        resolve(value)
      })
    })
  }
}
