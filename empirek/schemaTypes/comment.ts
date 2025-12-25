// sanity/schemaTypes/comment.ts
import {defineField, defineType} from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Blog Post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
          name: 'email',
        }),
      description: 'Used only for Gravatar (never shown publicly)',
    }),

    defineField({
      name: 'website',
      title: 'Website (Optional)',
      type: 'url',
      description: 'Your website URL (optional)',
    }),

    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'parent',
      title: 'Reply To',
      type: 'reference',
      to: [{type: 'comment'}],
      weak: true,
      description: 'Leave empty for top-level comments',
    }),
  ],

  preview: {
    select: {
      name: 'name',
      message: 'message',
      postTitle: 'post.title',
    },
    prepare({name, message, postTitle}) {
      return {
        title: name || 'Anonymous',
        subtitle: `${message?.slice(0, 50)}... • on "${postTitle || 'No post'}"`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Oldest First',
      name: 'createdAtAsc',
      by: [{field: 'createdAt', direction: 'asc'}],
    },
  ],
})
