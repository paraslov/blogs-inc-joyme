import { body } from 'express-validator'

export const stringWithLengthValidation = (field: string, options: { max: number, min: number }) => {
  const { min, max } = options

  return body(field)
    .isString().withMessage('Must be string').trim()
    .isLength({min, max}).withMessage(`Not more than ${max}  symbols, not empty`)
}
