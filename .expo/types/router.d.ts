/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/settings` | `/(app)/style` | `/_sitemap` | `/feed/add-post` | `/forgot-password` | `/onboarding` | `/settings` | `/sign-in` | `/sign-up` | `/style` | `/www`;
      DynamicRoutes: `/feed/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/feed/[id]`;
    }
  }
}
