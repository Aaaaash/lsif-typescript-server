import chalk from "chalk";

enum LogLevel {
    INFO,
    ERROR,
    WARNING,
    DEBUG,
}

process.env["LOG_LEVEL"] = String(LogLevel.DEBUG);
export class Logger {
    private logLevel: LogLevel;
    constructor() {
        this.logLevel = Number(process.env.LOG_LEVEL) || LogLevel.INFO;
    }

    public log(...message: any) {
        console.log(chalk.green(message));
    }

    public warn(...message: any) {
        if (this.logLevel >= LogLevel.WARNING) {
            console.log(chalk.yellow(message));
        }
    }

    public error(...message: any) {
        if (this.logLevel >= LogLevel.ERROR) {
            console.log(chalk.red(message));
        }
    }

    public debug(...message: any) {
        if (this.logLevel >= LogLevel.DEBUG) {
            console.log(chalk.blue(message));
        }
    }
}

export const logger = new Logger();
