import { db } from '../../../app/app'

export const postsRepository = {
  async getAllPosts() {
    return db.posts
  },
  async addPost() {

  }
}
