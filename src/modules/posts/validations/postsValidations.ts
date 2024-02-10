import { body } from 'express-validator'
import { stringWithLengthValidation } from '../../common/validations'
import { blogsRepository } from '../../blogs'
import { inputValidationMiddleware } from '../../../app/config/middleware'

const titleValidation = stringWithLengthValidation('title', { min: 1, max: 30 })

const shortDescriptionValidation = stringWithLengthValidation('shortDescription', { min: 1, max: 100 })

const contentValidation = stringWithLengthValidation('content', { min: 1, max: 1000 })

const blogIdValidation = body('blogId')
  .isString().withMessage('Should be a string')
  .custom(async (blogId: string) => {
    const existingBlog = await blogsRepository.getBlogById(blogId)

    if (!existingBlog) {
      throw new Error('There is no blogs with this id')
    }
  })

export const postInputValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
]