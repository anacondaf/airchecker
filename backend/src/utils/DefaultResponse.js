class DefaultResponse {
    #message = "Default response message";

    constructor(httpStatus, message) {
        this.statusCode = httpStatus;
        this.#message = message;
    }
}

exports.DefaultResponse = DefaultResponse;