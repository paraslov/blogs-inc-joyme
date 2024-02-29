import { body } from 'express-validator'
import { stringWithLengthValidation } from '../../common/validations'
import { inputValidationMiddleware } from '../../../app/config/middleware'
import { usersQueryRepository } from '../model/repositories/usersQueryRepository'

const loginValidation = stringWithLengthValidation('login', { min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login should be latin letters and numbers')
  .custom(uniqueLoginCheck).withMessage('This login is already exists')

const emailValidation = body('email')
  .isString()
  .notEmpty()
  .isEmail().withMessage('Should be a valid email')
  .custom(uniqueEmailCheck).withMessage('This email is already exists')

const passwordValidation = stringWithLengthValidation('password', { min: 6, max: 20 })

export const userInputValidation = () => [
  emailValidation,
  loginValidation,
  passwordValidation,
  inputValidationMiddleware,
]

async function uniqueLoginCheck(login: string) {
  const users = await usersQueryRepository.getUsers({
    searchLoginTerm: login,
  })

  if (users.items.length) {
    throw new Error(`This login is already exists`)
  }
}

async function uniqueEmailCheck(email: string) {
  const users = await usersQueryRepository.getUsers({
    searchEmailTerm: email,
  })

  if (users.items.length) {
    throw new Error(`This login is already exists`)
  }
}
