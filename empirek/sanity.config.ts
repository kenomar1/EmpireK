import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'EmpireK',

  projectId: '70a0b1g2',
  dataset: 'posts',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'ar', title: 'Arabic (العربية)'},
      ],
      schemaTypes: ['post', 'author', 'service', 'project'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
