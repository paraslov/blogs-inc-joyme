import { validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { isValidId } from '../../../modules/common/validations'
import { HttpStatusCode } from '../../../modules/common/enums'

export function inputValidationMiddleware(req: Request<any>, res: Response, next: NextFunction) {
  const errors = validationResult(req).formatWith((error) => ({
    field: error.type === 'field' ? error.path : '',
    message: error.msg,
  }));

  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });

    return
  }

  next()
}
