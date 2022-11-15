import { CustomError } from './custom-error';
export declare class UnauthorizedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
