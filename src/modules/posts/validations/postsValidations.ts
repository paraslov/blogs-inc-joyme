import { body } from 'express-validator'
import { isValidId, stringWithLengthValidation } from '../../common/validations'
import { queryBlogsRepository } from '../../blogs'
import { inputValidationMiddleware } from '../../../app/config/middleware'
import { NextFunction } from 'express'
import { HttpStatusCode } from '../../common/enums'

const titleValidation = stringWithLengthValidation('title', { min: 1, max: 30 })

const shortDescriptionValidation = stringWithLengthValidation('shortDescription', { min: 1, max: 100 })

const contentValidation = stringWithLengthValidation('content', { min: 1, max: 1000 })

const commentValidation = stringWithLengthValidation('content', { max: 300, min: 20 })

const blogIdValidation = body('blogId')
  .isString().withMessage('Should be a string')
  .custom(async (blogId: string) => {
    const existingBlog = await queryBlogsRepository.getBlogById(blogId)

    if (!existingBlog) {
      throw new Error('There is no blogs with this id')
    }
  })

export const commentInputValidation = () => [ commentValidation, inputValidationMiddleware ]

export const postInputValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
]

export const postForBlogsInputValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
]

export function postIdValidationMW(req: any, res: any, next: NextFunction) {
  if (!isValidId(req.params.postId)) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  next()
}
