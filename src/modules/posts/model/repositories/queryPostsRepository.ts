import { postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { postsMappers } from '../mappers/postsMappers'

export const queryPostsRepository = {
  async getAllPosts() {
    const posts = await postsCollection.find({}).toArray()

    return posts.map(postsMappers.mapDbPostsIntoView)
  },
  async getPostById(postId: string) {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(postId) })
    const mappedPost = foundPost && postsMappers.mapDbPostsIntoView(foundPost)

    return mappedPost
  },
}
