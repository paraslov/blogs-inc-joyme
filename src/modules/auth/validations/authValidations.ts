import { inputValidationMiddleware } from '../../../app/config/middleware'
import { notEmptyString } from '../../common/validations'
import { body } from 'express-validator'
import { UsersMongooseModel } from '../../../app/config/db'

const loginOrEmailValidation = notEmptyString('loginOrEmail')
const passwordValidation = notEmptyString('password')
const codeValidation = notEmptyString('code')

const emailValidation = body('email')
  .isString()
  .notEmpty()
  .isEmail().withMessage('Should be a valid email')

const emailResetValidation = emailValidation
  .custom(hasEmailCheck).withMessage('You have not registered yet')

export const authPostValidation = () => [ loginOrEmailValidation, passwordValidation, inputValidationMiddleware ]
export const authCodeValidation = () => [ codeValidation, inputValidationMiddleware ]
export const resentEmailValidation = () => [ emailResetValidation, inputValidationMiddleware ]
export const isEmailValidation = () => [ emailValidation, inputValidationMiddleware ]

async function hasEmailCheck(email: string) {
  const user = await UsersMongooseModel.findOne({ 'userData.email': email })
  if (!user) {
    throw new Error(`You have not registered yet`)
  }
}
