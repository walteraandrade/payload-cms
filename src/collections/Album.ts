import type { CollectionConfig } from 'payload'

export const Album: CollectionConfig = {
  slug: 'album',
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
      name: 'finish',
      type: 'select',
      options: ['matte', 'glossy'],
    }
  ],
}
