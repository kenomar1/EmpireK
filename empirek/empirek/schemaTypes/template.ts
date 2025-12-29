import {defineField, defineType} from 'sanity'

export const template = defineType({
  name: 'template',
  title: 'Templates',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Template Title',
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
      name: 'code',
      title: 'Template Code',
      type: 'string',
      description: 'Unique code for the template (e.g., ECOM-001)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fashion Store', value: 'fashion'},
          {title: 'Food / Restaurant', value: 'food'},
          {title: 'Portfolio', value: 'portfolio'},
          {title: 'Startup / SaaS', value: 'startup'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Pricing Model',
      type: 'string',
      options: {
        list: [
          {title: 'One-time Sale', value: 'sale'},
          {title: 'Subscription', value: 'subscription'},
        ],
      },
      initialValue: 'sale',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price Display',
      type: 'string',
      description: 'e.g. "$49" or "Starting at $49"',
      initialValue: '$49',
    }),
    defineField({
      name: 'mainImage',
      title: 'Preview Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewUrl',
      title: 'Live Preview Link',
      type: 'url',
      description: 'Link to the live demo of the template',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'code',
      media: 'mainImage',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.subtitle ? `Code: ${selection.subtitle}` : '',
        media: selection.media,
      }
    },
  },
})
