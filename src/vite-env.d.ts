/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly SENTRY_ENVIRONMENT?: string;
	readonly VITE_SENTRY_DSN?: string;
}
