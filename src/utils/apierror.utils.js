export class APIError extends Error {
    constructor(message , statuscode) {
        this.name = this.constructor.name;
        this.message = message ;
        this.statuscode = statuscode
    }
}