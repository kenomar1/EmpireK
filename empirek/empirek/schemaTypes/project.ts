// empirek/schemaTypes/project.ts
import {defineField, defineType} from 'sanity'
import {SlugValidationContext} from 'sanity'

// Custom slug uniqueness: allows same slug if language is different
async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context

  if (!document?._id || !document.language) return true

  const client = getClient({apiVersion: '2025-01-01'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    slug,
    id,
    type: 'project',
    language: document.language,
  }

  const query = `!defined(*[
    _type == $type &&
    !(_id in path("drafts.**")) &&
    _id != $id &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`

  return client.fetch(query, params)
}

export const project = defineType({
  name: 'project',
  title: 'Projects (Gallery)',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true, // for internationalization plugin
    }),

    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // This allows same slug for different languages
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Service Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) =>
        Rule.min(2000)
          .max(new Date().getFullYear() + 1)
          .integer(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Main/Hero Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'images',
      title: 'Project Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // Changed from plain 'text' to rich 'body' with Portable Text support
    defineField({
      name: 'body',
      title: 'Project Description',
      type: 'array',
      of: [
        {type: 'block'}, // Paragraphs, headings, lists, etc.
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'caption',
              title: 'Image Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
        {type: 'code'}, // Optional: for code snippets if needed
      ],
      description:
        'Rich text description of the project. Supports headings, lists, bold/italic, embedded images, and more.',
    }),

    defineField({
      name: 'link',
      title: 'Live Project URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'mainImage',
      category: 'category.title',
      year: 'year',
    },
    prepare({title, subtitle, media, category, year}) {
      const parts = []
      if (category) parts.push(category)
      if (year) parts.push(year.toString())
      if (subtitle) parts.push(subtitle)

      return {
        title,
        subtitle: parts.length > 0 ? parts.join(' • ') : 'No client',
        media,
      }
    },
  },
})
