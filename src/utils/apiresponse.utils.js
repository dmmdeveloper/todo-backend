export class APIREsponse {
    constructor(message = "Success" , data = null , statuscode = 201) {
        this.message = message;
        this.data = data;
        this.statuscode = statuscode       
    }
}