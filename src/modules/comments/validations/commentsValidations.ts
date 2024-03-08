import { stringWithLengthValidation } from '../../common/validations'
import { inputValidationMiddleware } from '../../../app/config/middleware'

const commentValidation = stringWithLengthValidation('content', { max: 300, min: 20 })

export const commentInputValidation = () => [ commentValidation, inputValidationMiddleware ]
