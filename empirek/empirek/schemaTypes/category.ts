// empirek/schemaTypes/category.ts
import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Globe', value: 'globe'},
          {title: 'Palette', value: 'palette'},
          {title: 'Code', value: 'code'},
          {title: 'Store', value: 'store'},
          {title: 'Search', value: 'search'},
          {title: 'Shield', value: 'shield'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colorGradient',
      title: 'Gradient Color',
      type: 'string',
      description: 'Tailwind gradient class (e.g., from-blue-500 to-cyan-500)',
      initialValue: 'from-gray-500 to-gray-600',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `Slug: ${selection.subtitle}`,
      }
    },
  },
})
