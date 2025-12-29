// empirek/structure.ts
import {StructureResolver} from 'sanity/structure'
import {dashboardTool} from './deskStructure/dashboard'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('EmpireK Content')
    .items([
      // Dashboard first
      S.listItem().title(dashboardTool.title).icon(dashboardTool.icon).child(
        S.component(dashboardTool.component)
          .id('dashboard-component') // Required id
          .title(dashboardTool.title),
      ),

      S.divider(),

      // Correct way: Pass the type name to documentTypeListItem
      S.documentTypeListItem('post').title('Blog Posts'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Projects Gallery'),
      S.documentTypeListItem('comment').title('Comments'),
    ])
