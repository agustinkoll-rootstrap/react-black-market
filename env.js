/* eslint-env node */
/*
 * Env file to load and validate env variables
 * Be cautious; this file should not be imported into your source folder. TODO: Add an eslint rule to prevent this.
 * We split the env variables into two parts:
 * 1. Client variables: These variables are used in the client-side code (src folder).
 * 2. Build-time variables: These variables are used in the build process (app.config.ts file).
 * Import this file into the `app.config.ts` file to use environment variables during the build process. The client variables can then be passed to the client-side using the extra field in the `app.config.ts` file.
 * To access the client environment variables in your `src` folder, you can import them from `@env`. For example: `import Env from '@env'`.
 */
/**
 * 1st part: Import packages and Load your env variables
 * we use dotenv to load the correct variables from the .env file based on the APP_ENV variable (default is development)
 * APP_ENV is passed as an inline variable while executing the command, for example: APP_ENV=staging pnpm build:android
 */
const z = require('zod');

const packageJSON = require('./package.json');
const path = require('path');

const APP_ENV =
  /** @type {z.infer<typeof clientEnvSchema>['APP_ENV']} */
  (process.env.APP_ENV) ?? 'development';

const isEASBuild = process.env.EAS_BUILD === 'true';

const LOCAL_BUILD_SCRIPT_PATTERNS = [
  '--local',
  'eas-cli-local-build-plugin',
  'expo export',
];
const isLocalBuild = LOCAL_BUILD_SCRIPT_PATTERNS.some((pattern) =>
  process.env.npm_lifecycle_script?.includes(pattern),
);

const EXPO_RUN_COMMANDS = ['expo start', 'expo run'];

const ENVIRONMENT_DEPENDANT_SCRIPTS = [
  ...EXPO_RUN_COMMANDS,
  'expo prebuild',
  'eas build',
  'eas-cli-local-build-plugin',
  'expo export',
];

const scriptIsEnvironmentDependant = ENVIRONMENT_DEPENDANT_SCRIPTS.some(
  (script) => process.env.npm_lifecycle_script?.includes(script),
);

// Check if the environment file has to be validated for the current running script and build method
const isBuilding = isEASBuild || isLocalBuild;
const isRunning = EXPO_RUN_COMMANDS.some((script) =>
  process.env.npm_lifecycle_script?.includes(script),
);
const shouldValidateEnv =
  (isBuilding && scriptIsEnvironmentDependant) || isRunning;

const environmentFiles = {
  development: process.env.ENVIRONMENT_FILE_DEVELOPMENT,
  qa: process.env.ENVIRONMENT_FILE_QA,
  production: process.env.ENVIRONMENT_FILE_PRODUCTION,
  staging: process.env.ENVIRONMENT_FILE_STAGING,
};

const easEnvironmentFilePath = environmentFiles[APP_ENV];
const localEnvironmentFilePath = path.resolve(__dirname, `.env.${APP_ENV}`);

const envPath = isEASBuild ? easEnvironmentFilePath : localEnvironmentFilePath;

require('dotenv').config({
  path: envPath,
});

/**
 * 2nd part: Define some static variables for the app
 * Such as: bundle id, package name, app name.
 *
 * You can add them to the .env file but we think it's better to keep them here as as we use prefix to generate this values based on the APP_ENV
 * for example: if the APP_ENV is staging, the bundle id will be com.myblackmarket.staging
 */

// TODO: Replace these values with your own

const BUNDLE_ID = 'com.myblackmarket'; // ios bundle id
const PACKAGE = 'com.myblackmarket'; // android package name
const NAME = 'MyBlackMarket'; // app name
const EXPO_ACCOUNT_OWNER = 'expo-owner'; // expo account owner
const EAS_PROJECT_ID = '72fdf440-59f1-493d-96e3-4afad8d7a045'; // eas project id
const SCHEME = 'MyBlackMarket'; // app scheme

/**
 * We declare a function withEnvSuffix that will add a suffix to the variable name based on the APP_ENV
 * Add a suffix to variable env based on APP_ENV
 * @param {string} name
 * @returns  {string}
 */

const withEnvSuffix = (name) =>
  APP_ENV === 'production' ? name : `${name}.${APP_ENV}`;

/**
 * 2nd part: Define your env variables schema
 * we use zod to define our env variables schema
 *
 * we split the env variables into two parts:
 *    1. client: These variables are used in the client-side code (`src` folder).
 *    2. buildTime: These variables are used in the build process (app.config.ts file). You can think of them as server-side variables.
 *
 * Main rules:
 *    1. If you need your variable on the client-side, you should add it to the client schema; otherwise, you should add it to the buildTime schema.
 *    2. Whenever you want to add a new variable, you should add it to the correct schema based on the previous rule, then you should add it to the corresponding object (_clientEnv or _buildTimeEnv).
 *
 * Note: `z.string()` means that the variable exists and can be an empty string, but not `undefined`.
 * If you want to make the variable required, you should use `z.string().min(1)` instead.
 * Read more about zod here: https://zod.dev/?id=strings
 *
 */

// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const parseString = (/** @type {string | undefined} */ value) =>
  value === '' ? undefined : value;
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const parseNumber = (/** @type {string | undefined} */ value) =>
  value ? Number(value) : undefined;
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const parseBoolean = (/** @type {string | undefined} */ value) =>
  value ? value === 'true' : undefined;

const clientEnvSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'qa', 'staging']),
  NAME: z.string(),
  SCHEME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),

  // ADD YOUR CLIENT ENV VARS HERE
  API_URL: z.string(),
  VAR_NUMBER: z.number(),
  VAR_BOOL: z.boolean(),
  TERMS_OF_SERVICE_URL: z.string(),
  WEBSITE_URL: z.string(),
});

const buildTimeEnvSchema = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
  // ADD YOUR BUILD TIME ENV VARS HERE
  SECRET_KEY: z.string(),
});

/**
 * @type {Partial<z.infer<typeof clientEnvSchema>>}
 */
const _clientEnv = {
  APP_ENV,
  NAME,
  SCHEME,
  BUNDLE_ID: withEnvSuffix(BUNDLE_ID),
  PACKAGE: withEnvSuffix(PACKAGE),
  VERSION: packageJSON.version,

  // ADD YOUR ENV VARS HERE TOO
  API_URL: parseString(process.env.API_URL),
  VAR_NUMBER: parseNumber(process.env.VAR_NUMBER),
  VAR_BOOL: parseBoolean(process.env.VAR_BOOL),
  WEBSITE_URL: parseString(process.env.WEBSITE_URL),
  TERMS_OF_SERVICE_URL: parseString(process.env.TERMS_OF_SERVICE_URL),
};

/**
 * @type {Record<keyof z.infer<typeof buildTimeEnvSchema> , unknown>}
 */
const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID,
  // ADD YOUR ENV VARS HERE TOO
  SECRET_KEY: "asdsad",
};

/**
 * 3rd part: Merge and Validate your env variables
 * We use zod to validate our env variables based on the schema we defined above
 * If the validation fails we throw an error and log the error to the console with a detailed message about missed variables
 * If the validation passes we export the merged and parsed env variables to be used in the app.config.ts file as well as a ClientEnv object to be used in the client-side code
 **/

const _wholeEnv = {
  ..._clientEnv,
  ..._buildTimeEnv,
};
const wholeEnvSchema = buildTimeEnvSchema.merge(clientEnvSchema);

/**
 * @type {z.infer<typeof wholeEnvSchema>}
 */
let Env;

/**
 * @type {z.infer<typeof clientEnvSchema>}
 */
let ClientEnv;

if (shouldValidateEnv) {
  const parsedWholeEnv = wholeEnvSchema.safeParse(_wholeEnv);

  if (parsedWholeEnv.success === false) {
    const envFile = isEASBuild ? environmentFiles[APP_ENV] : `.env.${APP_ENV}`;

    const messages = [
      '❌ Invalid environment variables:',
      parsedWholeEnv.error.flatten().fieldErrors,

      `\n❌ Missing variables in \x1b[1m\x1b[4m\x1b[31m${envFile}\x1b[0m file. Make sure all required variables are defined in the \x1b[1m\x1b[4m\x1b[31m${envFile}\x1b[0m file.`,
    ];

    if (isLocalBuild) {
      messages.push(
        `\n💡 Tip: If you recently updated the \x1b[1m\x1b[4m\x1b[31m${envFile}\x1b[0m file and the error still persists, try restarting the server with the -cc flag to clear the cache.`,
      );
    }

    if (isEASBuild) {
      messages.push(
        `\n☁️ For \x1b[1m\x1b[32mEAS Build\x1b[0m deployments, ensure the secret\x1b[1m\x1b[4m\x1b[31m${environmentFiles[APP_ENV]} \x1b[0m is defined in Project Secrets and has the proper environment file attached.`,
      );
    }

    console.error(...messages);
    throw new Error(
      'Invalid environment variables, Check terminal for more details ',
    );
  }

  Env = parsedWholeEnv.data;
  ClientEnv = clientEnvSchema.parse(_clientEnv);
} else {
  // Don't worry about TypeScript here; if we don't need to validate the env variables is because we aren't using them
  //@ts-ignore
  Env = _wholeEnv;
  //@ts-ignore
  ClientEnv = _clientEnv;
}

module.exports = {
  Env,
  ClientEnv,
  withEnvSuffix,
};
