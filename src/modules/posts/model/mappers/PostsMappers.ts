import { PostDbModel } from '../types/PostDbModel'
import { WithId } from 'mongodb'
import { PostViewModel } from '../types/PostViewModel'

export class PostsMappers {
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

export const postsMappers = new PostsMappers()
