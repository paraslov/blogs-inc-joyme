import { body } from 'express-validator'
import { stringWithLengthValidation } from '../../common/validations'
import { inputValidationMiddleware } from '../../../app/config/middleware'
import { usersQueryRepository } from '../model/repositories/usersQueryRepository'

const loginValidation = stringWithLengthValidation('login', { min: 3, max: 10 })
  .custom(uniqueLoginAndEmailCheck).withMessage('This login is already exists')

const emailValidation = body('email')
  .isString()
  .notEmpty()
  .isEmail().withMessage('Should be a valid email')
  .custom(uniqueLoginAndEmailCheck).withMessage('This email is already exists')

const passwordValidation = stringWithLengthValidation('password', { min: 6, max: 20 })

export const userInputValidation = () => [
  emailValidation,
  loginValidation,
  passwordValidation,
  inputValidationMiddleware,
]

async function uniqueLoginAndEmailCheck(field: 'login' | 'email') {
  const users = await usersQueryRepository.getUsers({
    searchLoginTerm: field === 'login' ? field : '',
    searchEmailTerm: field === 'email' ? field : '',
  })

  if (users.items.length) {
    throw new Error(`${field} is already exists`)
  }
}
