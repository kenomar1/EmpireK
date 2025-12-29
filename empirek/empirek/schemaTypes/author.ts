// empirek/schemaTypes/author.ts
import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    // Hidden language field for internationalization
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),

    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g., Senior Frontend Engineer, Agency Founder',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {hotspot: true},
      description: 'Profile picture (square recommended)',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'A few sentences about the author (shown on post)',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})
