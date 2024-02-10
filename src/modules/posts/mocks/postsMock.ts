import { PostViewModel } from '../model/PostViewModel'
import { PostInputModel } from '../model/PostInputModel'

export const testPost: PostViewModel = {
  id: '555999',
  title: 'JS in 2024',
  shortDescription: 'Talk about new in JS',
  content: 'VERY VERY LONG CONTENT HERE',
  blogId: '666777',
  blogName: 'It-Incubator',
}

export const testPostInput: PostInputModel = {
  title: 'New post JS in 2024',
  shortDescription: 'New post Talk about new in JS',
  content: 'New post VERY VERY LONG CONTENT HERE',
  blogId: '666777',
}
