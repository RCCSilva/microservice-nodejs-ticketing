import { NextFunction, Request, Response } from "express"

export const routeLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} - ${req.url} - ${JSON.stringify(req.body)}`,)
  next()
}
