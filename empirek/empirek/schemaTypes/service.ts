// empirek/schemaTypes/service.ts
import {defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),

    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    // Now references the real category document
    defineField({
      name: 'category',
      title: 'Associated Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Starting Price',
      type: 'string',
      description: 'e.g., "$99" or "Starting at $500"',
      initialValue: 'Starting at $',
    }),

    defineField({
      name: 'shortDesc',
      title: 'Short Description',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add one feature per item',
    }),
    // NEW FIELD: Hand-picked blog posts for this service
    defineField({
      name: 'highlightedPosts',
      title: 'Highlighted Blog Posts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
      description:
        'Select the best blog posts to feature on this service page (up to 6 recommended)',
      validation: (Rule) => Rule.max(6).warning('More than 6 posts may affect layout'),
    }),

    defineField({
      name: 'galleryImages',
      title: 'Gallery Images (Delivered Projects)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
      media: 'galleryImages.0.asset',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.subtitle ? `Category: ${selection.subtitle}` : 'No category',
      }
    },
  },
})
