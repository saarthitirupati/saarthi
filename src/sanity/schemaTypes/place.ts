import { defineField, defineType } from 'sanity';

export const placeType = defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'placeType',
      title: 'Place Type',
      type: 'string',
      options: {
        list: [
          { title: 'Spiritual', value: 'spiritual' },
          { title: 'Nature', value: 'nature' },
          { title: 'Water', value: 'water' },
          { title: 'Food', value: 'food' },
          { title: 'Historical', value: 'historical' },
          { title: 'Hidden', value: 'hidden' },
          { title: 'Leisure', value: 'leisure' },
          { title: 'Culture', value: 'culture' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'distanceKms',
      title: 'Distance (Kms)',
      type: 'number',
    }),
    defineField({
      name: 'durationMins',
      title: 'Duration (Mins)',
      type: 'number',
    }),
    defineField({
      name: 'budgetLevel',
      title: 'Budget Level',
      type: 'string',
      options: {
        list: [
          { title: 'Budget', value: 'budget' },
          { title: 'Medium', value: 'medium' },
          { title: 'Premium', value: 'premium' },
        ],
      },
    }),
    defineField({
      name: 'entryFeeNum',
      title: 'Entry Fee Amount',
      type: 'number',
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'openFrom',
      title: 'Open From (Hour)',
      type: 'number',
    }),
    defineField({
      name: 'openTo',
      title: 'Open To (Hour)',
      type: 'number',
    }),
    defineField({
      name: 'isMustVisit',
      title: 'Is Must Visit',
      type: 'boolean',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'descriptionTe',
      title: 'Description (Telugu)',
      type: 'text',
    }),
    defineField({
      name: 'history',
      title: 'History',
      type: 'text',
    }),
    defineField({
      name: 'historyTe',
      title: 'History (Telugu)',
      type: 'text',
    }),
    defineField({
      name: 'timings',
      title: 'Timings Display',
      type: 'string',
    }),
    defineField({
      name: 'entryFee',
      title: 'Entry Fee Display',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'bestTime',
      title: 'Best Time to Visit',
      type: 'string',
    }),
    defineField({
      name: 'spiritualInfo',
      title: 'Spiritual Info',
      type: 'object',
      fields: [
        { name: 'god', type: 'string', title: 'Deity Name' },
        { name: 'knownFor', type: 'string', title: 'Known For' },
        { name: 'mantra', type: 'string', title: 'Mantra' },
        { name: 'devoteeTips', type: 'array', title: 'Devotee Tips', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'practicalInfo',
      title: 'Practical Info',
      type: 'object',
      fields: [
        { name: 'dressCode', type: 'string', title: 'Dress Code' },
        { name: 'food', type: 'string', title: 'Food Availability' },
        { name: 'parking', type: 'string', title: 'Parking' },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
  ],
});
