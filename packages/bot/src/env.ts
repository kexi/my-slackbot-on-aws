function envVar(name: string) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export const APP_ENV = envVar('APP_ENV');
export const SLACK_SIGNING_SECRET = envVar('SLACK_SIGNING_SECRET');
export const SLACK_BOT_TOKEN = envVar('SLACK_BOT_TOKEN');
