// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html

import type { Static } from '@feathersjs/typebox'
import type { HookContext } from 'nuxt-feathers/server'
import type { MongoService } from './mongos.class'
import { resolve } from '@feathersjs/schema'
import { getValidator, ObjectIdSchema, querySyntax, Type } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from 'nuxt-feathers/validators'

// Main data model schema
export const mongoSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    text: Type.String(),
  },
  { $id: 'Mongo', additionalProperties: false },
)
export type Mongo = Static<typeof mongoSchema>
export const mongoValidator = getValidator(mongoSchema, dataValidator)
export const mongoResolver = resolve<Mongo, HookContext<MongoService>>({})

export const mongoExternalResolver = resolve<Mongo, HookContext<MongoService>>({})

// Schema for creating new entries
export const mongoDataSchema = Type.Pick(mongoSchema, ['text'], {
  $id: 'MongoData',
})
export type MongoData = Static<typeof mongoDataSchema>
export const mongoDataValidator = getValidator(mongoDataSchema, dataValidator)
export const mongoDataResolver = resolve<Mongo, HookContext<MongoService>>({})

// Schema for updating existing entries
export const mongoPatchSchema = Type.Partial(mongoSchema, {
  $id: 'MongoPatch',
})
export type MongoPatch = Static<typeof mongoPatchSchema>
export const mongoPatchValidator = getValidator(mongoPatchSchema, dataValidator)
export const mongoPatchResolver = resolve<Mongo, HookContext<MongoService>>({})

// Schema for allowed query properties
export const mongoQueryProperties = Type.Pick(mongoSchema, ['_id', 'text'])
export const mongoQuerySchema = Type.Intersect(
  [
    querySyntax(mongoQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false },
)
export type MongoQuery = Static<typeof mongoQuerySchema>
export const mongoQueryValidator = getValidator(mongoQuerySchema, queryValidator)
export const mongoQueryResolver = resolve<MongoQuery, HookContext<MongoService>>({})
