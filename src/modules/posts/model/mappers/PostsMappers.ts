import { PostDbModel } from '../types/PostDbModel'
import { WithId } from 'mongodb'
import { PostViewModel } from '../types/PostViewModel'
import { BlogDbModel, BlogViewModel } from '../../../blogs'

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
  mapBlogToView(blogFromDb: WithId<BlogDbModel>): BlogViewModel {
    return {
      id: blogFromDb._id.toString(),
      name: blogFromDb.name,
      description: blogFromDb.description,
      websiteUrl: blogFromDb.websiteUrl,
      createdAt: blogFromDb.createdAt,
      isMembership: blogFromDb.isMembership,
    }
  }
}

export const postsMappers = new PostsMappers()
