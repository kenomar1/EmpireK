import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '70a0b1g2',
    dataset: 'posts'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
