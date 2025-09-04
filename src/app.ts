import { Command } from 'commander';
import { AppController } from "./app.controller";

// app show app version in package.json
// $ node dist/app.js app show app version in package.json
// $ node dist/app.js app "show app version in package.json"
// $ node dist/app.js app 'show app version in package.json'

export function run() {
    const program = new Command();

    program
        .name("bash-ai")
        .description('AI-powered bash command assistant')
        .allowExcessArguments()
        .action(async () => {
            const appController = new AppController();
            // all arguments
            const args = process.argv.slice(2);
            const prompt = args.join(" ");
            await appController.findCommand(prompt);
        });

    program.parse(process.argv);
}