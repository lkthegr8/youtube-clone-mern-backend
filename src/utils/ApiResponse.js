class ApiResponse {
    constructor(statusCode, data, message="Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode<400;// because below 400 is success
        this.message = message;
    }
}