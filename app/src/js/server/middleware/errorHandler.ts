import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exception'
import { ServerConfig } from '../types'

/**
 * Error handler
 * @param {Error} err - error
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - next function
 */
const errorHandler = (config: ServerConfig) => (
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  const resData: {[k: string]: string} = {
    code: status.toString(),
    data: message
  }
  if (status === 401 && config.userManagement && config.cognito) {
    resData.redirect = `https://${config.cognito.userPoolBaseUri}/login?client_id=${config.cognito.clientId}&response_type=code&redirect_uri=${config.cognito.callbackUri}`
  }
  response.status(status).json(resData)
}

export default errorHandler
