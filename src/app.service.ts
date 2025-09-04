import { BashPrompt } from "./bash-prompt";
import { ChildProcess } from "./child-process";
import { CompletionException } from "./completion-exception";
import { Logger } from "./logger";
import OpenAiService from "./openai.service";


export class AppService {
    private logger: Logger = new Logger(AppService.name);
    private openAiService: OpenAiService;
    private childProcess: ChildProcess;

    constructor() {
        this.openAiService = new OpenAiService();
        this.childProcess = new ChildProcess();
    }

    public async findCommand(_prompt: string): Promise<string> {
        const prompt = new BashPrompt(_prompt);
        const fullPrompt = prompt.toString();

        const response = await this.openAiService.getResponse(fullPrompt);
        const result = response.output_text;
        const command: string = result.trim();

        // if command has ?? or !!, throw error
        if (command.includes("??") || command.includes("!!")) {
            // this.logger.error(`Error: ${command}`);
            throw new CompletionException(command);
        }

        return command;
    }


    // confirm command 
    public async confirmCommand(command: string): Promise<boolean> {
        const question = `do your want to use command in your terminal ? [YES/no] `;
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => readline.question(question, (ans: any) => {
            // if answer is yes or empty, answer is yes
            const answer = ans === "yes" || ans === "" ? true : false;
            readline.close();
            resolve(answer);
        }));
    }

    // run command
    public async runCommand(command: string): Promise<void> {
        this.logger.log(`run command: ${command}\n`);

        // remove $ sign from command
        command = command.replace("$", "");

        // run command
        this.childProcess.run(command);
    }
}

