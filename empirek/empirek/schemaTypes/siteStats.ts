export const siteStats = {
  name: 'siteStats',
  title: 'Site Statistics',
  type: 'document',
  fields: [
    {
      name: 'projectsCompleted',
      title: 'Projects Completed',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'happyClients',
      title: 'Happy Clients',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'successRate',
      title: 'Success Rate (%)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
    {
      name: 'isActive',
      title: 'Use These Stats',
      type: 'boolean',
      description: 'Only one stats document should be active',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      projects: 'projectsCompleted',
      clients: 'happyClients',
      isActive: 'isActive',
    },
    prepare(selection: any) {
      const {projects, clients, isActive} = selection
      return {
        title: `Stats: ${projects} Projects, ${clients} Clients`,
        subtitle: isActive ? 'Active' : 'Inactive',
      }
    },
  },
}
