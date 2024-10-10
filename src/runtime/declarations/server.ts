// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html

import type { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import type { Application as FeathersKoaApplication } from '@feathersjs/koa'
import type { NitroApp } from 'nitropack'

export type { NextFunction }

export interface Configuration {
}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

export interface ApplicationAddons {
  nitroApp?: NitroApp
}

// The application instance type that will be used everywhere else
export type Application = FeathersKoaApplication<ServiceTypes, Configuration> & ApplicationAddons

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>
