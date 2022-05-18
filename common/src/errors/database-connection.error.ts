import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Database connection failed'
  constructor() {
    super()

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}
