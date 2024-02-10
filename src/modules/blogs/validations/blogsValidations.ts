import { inputValidationMiddleware } from '../../../app/config/middleware'
import { stringWithLengthValidation } from '../../common/validations'

const nameValidation = stringWithLengthValidation('name', { min: 1, max: 15 })

const descriptionValidation = stringWithLengthValidation('description', { min: 1, max: 500 })

const websiteUrlValidation = stringWithLengthValidation('websiteUrl', { min: 1, max: 100 })
  .isURL().withMessage('Must be a valid URL')

export const blogInputValidation = () => [nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware]
