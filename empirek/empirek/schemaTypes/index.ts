// sanity/schema.ts (or wherever your main schema file is)
import {post} from './post'
import {author} from './author'
import {service} from './service'
import {category} from './category'
import {project} from './project'
import {comment} from './comment'
import {template} from './template'
import {clientLogo} from './clientLogo'
import {siteStats} from './siteStats'
import {faq} from './faq'
import {teamMember} from './teamMember'

export const schemaTypes = [
  post,
  author,
  service,
  category,
  project,
  comment,
  template,
  clientLogo,
  siteStats,
  faq,
  teamMember,
]
