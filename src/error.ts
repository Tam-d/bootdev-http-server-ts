//400
export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
 }

 //401
export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class Error403 extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class Error404 extends Error {
    constructor(message: string) {
        super(message);
    }
}

//500
export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
    }
}