import OpenAI from "openai";

export default class OpenAiService {
    private openai: OpenAI;

    private model: string = "gpt-5-nano";

    constructor() {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not defined");
        }

        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }

    // createCompletion
    public async getResponse(prompt: string): Promise<any> {
        return await this.openai.responses.create({
            model: this.model,
            input: prompt,
            reasoning: { "effort": "minimal" }
        });
    }
}