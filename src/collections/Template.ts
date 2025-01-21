import type { CollectionConfig } from 'payload'

export const Template: CollectionConfig = {
  slug: 'template',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
        name: 'name',
        type: 'text',
    },
    {
        name: 'description',
        type: 'text',
    },
    {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
    },
    {
        name: 'mood',
        type: 'select',
        options: ['very somber', 'somber', 'neutral', 'happy', 'very happy'],
    }
  ],
}
