import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Word: a
    .model({
      strongs: a.string().required(),
      greek: a.string(),
      hebrew: a.string(),
      transliteration: a.string().required(),
      definition: a.string().required(),
      usage: a.string(),
      references: a.string().array(),
      content: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),

  Verse: a
    .model({
      book: a.string().required(),
      chapter: a.integer().required(),
      verse: a.integer().required(),
      translation: a.string().required(),
      category: a.string(),
      content: a.string().required(),
      strongs: a.string().array(),
    })
    .authorization((allow) => [allow.guest()]),

  Passage: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      category: a.string(),
      tags: a.string().array(),
      references: a.string().array(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
