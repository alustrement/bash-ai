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
        const question = `run this command ? [Y/n] `;
        process.stdout.write(question);

        return new Promise(resolve => {
            // Set stdin to raw mode to capture single keypress
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding('utf8');

            const onKeypress = (key: string) => {
                // Clean up listeners
                process.stdin.removeListener('data', onKeypress);
                process.stdin.setRawMode(false);
                process.stdin.pause();

                const keyLower = key.toLowerCase();
                
                // Handle different key inputs
                if (key === '\r' || key === '\n' || keyLower === 'y') {
                    // ENTER or 'y' means yes
                    process.stdout.write('y\n');
                    resolve(true);
                } else if (keyLower === 'n') {
                    // 'n' means no
                    process.stdout.write('n\n');
                    resolve(false);
                } else if (key === '\u0003') {
                    // Ctrl+C
                    process.stdout.write('\n');
                    process.exit(0);
                } else {
                    // Invalid key, default to yes
                    process.stdout.write('y\n');
                    resolve(true);
                }
            };

            process.stdin.on('data', onKeypress);
        });
    }

    // run command
    public async runCommand(command: string): Promise<void> {
        // remove $ sign from command
        command = command.replace("$", "");

        // run command
        this.childProcess.run(command);
    }
}

