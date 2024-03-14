import { inputValidationMiddleware } from '../../../app/config/middleware'
import { notEmptyString } from '../../common/validations'

const loginOrEmailValidation = notEmptyString('loginOrEmail')
const passwordValidation = notEmptyString('password')
const codeValidation = notEmptyString('code')

export const authPostValidation = () => [ loginOrEmailValidation, passwordValidation, inputValidationMiddleware ]
export const authCodeValidation = () => [ codeValidation, inputValidationMiddleware ]
