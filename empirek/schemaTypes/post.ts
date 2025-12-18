// empirek/schemaTypes/post.ts
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
    type: 'post',
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

export const post = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    // Hidden language field required by the internationalization plugin
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),

    // === Core Fields ===
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt (Teaser)',
      description: 'Short summary shown on blog list (100–200 characters recommended)',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'mainImage',
      title: 'Featured Image (Hero)',
      type: 'image',
      options: {hotspot: true},
    }),

    // === Highlight Checkbox ===
    defineField({
      name: 'isHighlighted',
      title: 'Include in highlight',
      type: 'boolean',
      description:
        'Check this to feature this post in service page highlights and other featured sections',
      initialValue: false,
      options: {
        layout: 'checkbox',
      },
    }),

    // === Recommended ===
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Add relevant tags (e.g., React, Tailwind, Performance)',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    }),

    // === Body ===
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}, {type: 'code'}],
    }),

    // === SEO ===
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({name: 'metaTitle', title: 'Meta Title', type: 'string'}),
        defineField({name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3}),
        defineField({name: 'ogImage', title: 'Open Graph Image', type: 'image'}),
      ],
      options: {collapsible: true, collapsed: true},
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'mainImage',
      author: 'author.name',
      category: 'category.title',
      date: 'publishedAt',
      isHighlighted: 'isHighlighted',
    },
    prepare(selection: any) {
      const {title, subtitle, media, author, category, date, isHighlighted} = selection

      const authorPart = author ? `by ${author}` : 'Unknown author'
      const categoryPart = category ? ` • ${category}` : 'Uncategorized' // Fixed typo
      const datePart = date ? new Date(date).toLocaleDateString() : 'No date'
      const excerptPart = subtitle
        ? `: ${subtitle.substring(0, 80)}${subtitle.length > 80 ? '...' : ''}`
        : ''
      const highlightBadge = isHighlighted ? ' ✨ Highlighted' : ''

      return {
        title,
        subtitle: `${authorPart}${categoryPart} • ${datePart}${excerptPart}${highlightBadge}`,
        media,
      }
    },
  },
})
