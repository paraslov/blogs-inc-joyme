import { PostDbModel } from '../types/PostDbModel'
import { WithId } from 'mongodb'
import { PostViewModel } from '../types/PostViewModel'

export const postsMappers = {
  mapDbPostsIntoView(dbPosts: WithId<PostDbModel>): PostViewModel {
    return {
      id: dbPosts._id.toString(),
      title: dbPosts.title,
      shortDescription: dbPosts.shortDescription,
      content: dbPosts.content,
      blogId: dbPosts.blogId,
      blogName: dbPosts.blogName,
      createdAt: dbPosts.createdAt,
    }
  }
}
