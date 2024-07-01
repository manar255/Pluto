import CustomError from './customError';

class CustomErrorClass extends Error implements CustomError {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomErrorClass.prototype);
    }
}

export default CustomErrorClass;