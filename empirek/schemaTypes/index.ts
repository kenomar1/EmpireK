// sanity/schema.ts (or wherever your main schema file is)
import {post} from './post'
import {author} from './author'
import {service} from './service'
import {category} from './category'
import {project} from './project'
import {comment} from './comment' // ← Add this import

export const schemaTypes = [
  post,
  author,
  service,
  category,
  project,
  comment, // ← Add the comment schema here
]
