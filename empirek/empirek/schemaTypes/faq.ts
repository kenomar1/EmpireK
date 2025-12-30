export const faq = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      description: 'Leave empty for pending questions',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Answered', value: 'answered'},
        ],
      },
      initialValue: 'pending',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'submitterName',
      title: 'Submitter Name',
      type: 'string',
      description: 'Name of person who asked the question',
    },
    {
      name: 'submitterEmail',
      title: 'Submitter Email',
      type: 'string',
      description: 'Email of person who asked the question',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Pricing', value: 'pricing'},
          {title: 'Process', value: 'process'},
          {title: 'Technical', value: 'technical'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
    {
      name: 'isActive',
      title: 'Show on Website',
      type: 'boolean',
      description: 'Only answered questions should be active',
      initialValue: false,
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    },
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      status: 'status',
      answer: 'answer',
    },
    prepare(selection: any) {
      const {title, category, status, answer} = selection
      const hasAnswer = answer && answer.length > 0
      return {
        title: title,
        subtitle: `${status === 'pending' ? '⏳ Pending' : '✅ Answered'} | ${category}`,
        media: hasAnswer ? undefined : '❓',
      }
    },
  },
}
