export class APIError extends Error {
    constructor(message , statuscode) {
        super(message)
        this.name = this.constructor.name;
        this.statuscode = statuscode
    }
}