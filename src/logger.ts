export class Logger {
    constructor(
        private name: string
    ) { }

    public info(message: string) {
        console.info(withColor("36", message));
    }

    public log(message: string) {
        console.log(withColor("32", message));
    }

    public error(message: string) {
        console.error(withColor("31", message));
    }

    public warn(message: string) {
        console.warn(withColor("33", message));
    }

    public debug(message: string) {
        if (process.env.DEBUG === "true") console.debug(withColor("35", `[${this.name}] ${message}`));
    }
}


function withColor(color: string, text: string) {
    return `\x1b[${color}m${text}\x1b[0m`;
}