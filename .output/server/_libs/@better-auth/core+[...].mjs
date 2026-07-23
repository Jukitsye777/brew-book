import { t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/.pnpm/better-call@1.3.7_zod@4.4.3/node_modules/better-call/dist/error.mjs
function isErrorStackTraceLimitWritable() {
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return Object.prototype.hasOwnProperty.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
/**
* Hide internal stack frames from the error stack trace.
*/
function hideInternalStackFrames(stack) {
	const lines = stack.split("\n    at ");
	if (lines.length <= 1) return stack;
	lines.splice(1, 1);
	return lines.join("\n    at ");
}
/**
* Creates a custom error class that hides stack frames.
*/
function makeErrorForHideStackFrame(Base, clazz) {
	class HideStackFramesError extends Base {
		#hiddenStack;
		constructor(...args) {
			if (isErrorStackTraceLimitWritable()) {
				const limit = Error.stackTraceLimit;
				Error.stackTraceLimit = 0;
				super(...args);
				Error.stackTraceLimit = limit;
			} else super(...args);
			const stack = (/* @__PURE__ */ new Error()).stack;
			if (stack) this.#hiddenStack = hideInternalStackFrames(stack.replace(/^Error/, this.name));
		}
		get errorStack() {
			return this.#hiddenStack;
		}
	}
	Object.defineProperty(HideStackFramesError.prototype, "constructor", {
		get() {
			return clazz;
		},
		enumerable: false,
		configurable: true
	});
	return HideStackFramesError;
}
var statusCodes = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	MULTIPLE_CHOICES: 300,
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	SEE_OTHER: 303,
	NOT_MODIFIED: 304,
	TEMPORARY_REDIRECT: 307,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	"I'M_A_TEAPOT": 418,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_ENTITY: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NOT_EXTENDED: 510,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var InternalAPIError = class extends Error {
	constructor(status = "INTERNAL_SERVER_ERROR", body = void 0, headers = {}, statusCode = typeof status === "number" ? status : statusCodes[status]) {
		super(body?.message, body?.cause ? { cause: body.cause } : void 0);
		this.status = status;
		this.body = body;
		this.headers = headers;
		this.statusCode = statusCode;
		this.name = "APIError";
		this.status = status;
		this.headers = headers;
		this.statusCode = statusCode;
		this.body = body;
	}
};
makeErrorForHideStackFrame(InternalAPIError, Error);
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/error/index.mjs
var BetterAuthError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "BetterAuthError";
		this.message = message;
		this.stack = "";
	}
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs
var initGetDefaultModelName = ({ usePlural, schema }) => {
	/**
	* This function helps us get the default model name from the schema defined by devs.
	* Often times, the user will be using the `modelName` which could had been customized by the users.
	* This function helps us get the actual model name useful to match against the schema. (eg: schema[model])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom modelName.
	* 2. When using a custom modelName, doing something like `schema[model]` will not work.
	* 3. Using this function helps us get the actual model name based on the user's defined custom modelName.
	*/
	const getDefaultModelName = (model) => {
		if (usePlural && model.charAt(model.length - 1) === "s") {
			const pluralessModel = model.slice(0, -1);
			let m = schema[pluralessModel] ? pluralessModel : void 0;
			if (!m) m = Object.entries(schema).find(([_, f]) => f.modelName === pluralessModel)?.[0];
			if (m) return m;
		}
		let m = schema[model] ? model : void 0;
		if (!m) m = Object.entries(schema).find(([_, f]) => f.modelName === model)?.[0];
		if (!m) throw new BetterAuthError(`Model "${model}" not found in schema`);
		return m;
	};
	return getDefaultModelName;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs
var initGetDefaultFieldName = ({ schema, usePlural }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	/**
	* This function helps us get the default field name from the schema defined by devs.
	* Often times, the user will be using the `fieldName` which could had been customized by the users.
	* This function helps us get the actual field name useful to match against the schema. (eg: schema[model].fields[field])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom fieldName.
	* 2. When using a custom fieldName, doing something like `schema[model].fields[field]` will not work.
	*/
	const getDefaultFieldName = ({ field, model: unsafeModel }) => {
		if (field === "id" || field === "_id") return "id";
		const model = getDefaultModelName(unsafeModel);
		let f = schema[model]?.fields[field];
		if (!f) {
			const result = Object.entries(schema[model].fields).find(([_, f]) => f.fieldName === field);
			if (result) {
				f = result[1];
				field = result[0];
			}
		}
		if (!f) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
		return field;
	};
	return getDefaultFieldName;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/env/env-impl.mjs
var _envShim = Object.create(null);
var _getEnv = (useShim) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (useShim ? _envShim : globalThis);
var env = new Proxy(_envShim, {
	get(_, prop) {
		return _getEnv()[prop] ?? _envShim[prop];
	},
	has(_, prop) {
		return prop in _getEnv() || prop in _envShim;
	},
	set(_, prop, value) {
		const env = _getEnv(true);
		env[prop] = value;
		return true;
	},
	deleteProperty(_, prop) {
		if (!prop) return false;
		const env = _getEnv(true);
		delete env[prop];
		return true;
	},
	ownKeys() {
		const env = _getEnv(true);
		return Object.keys(env);
	}
});
env.NODE_ENV;
/**
* Get environment variable with fallback
*/
function getEnvVar(key, fallback) {
	if (typeof process !== "undefined" && process.env) return process.env[key] ?? fallback;
	if (typeof Deno !== "undefined") return Deno.env.get(key) ?? fallback;
	if (typeof Bun !== "undefined") return Bun.env[key] ?? fallback;
	return fallback;
}
Object.freeze({
	get BETTER_AUTH_SECRET() {
		return getEnvVar("BETTER_AUTH_SECRET");
	},
	get AUTH_SECRET() {
		return getEnvVar("AUTH_SECRET");
	},
	get BETTER_AUTH_TELEMETRY() {
		return getEnvVar("BETTER_AUTH_TELEMETRY");
	},
	get BETTER_AUTH_TELEMETRY_ID() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ID");
	},
	get NODE_ENV() {
		return getEnvVar("NODE_ENV", "development");
	},
	get PACKAGE_VERSION() {
		return getEnvVar("PACKAGE_VERSION", "0.0.0");
	},
	get BETTER_AUTH_TELEMETRY_ENDPOINT() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ENDPOINT", "");
	}
});
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/env/color-depth.mjs
var COLORS_2 = 1;
var COLORS_16 = 4;
var COLORS_256 = 8;
var COLORS_16m = 24;
var TERM_ENVS = {
	eterm: COLORS_16,
	cons25: COLORS_16,
	console: COLORS_16,
	cygwin: COLORS_16,
	dtterm: COLORS_16,
	gnome: COLORS_16,
	hurd: COLORS_16,
	jfbterm: COLORS_16,
	konsole: COLORS_16,
	kterm: COLORS_16,
	mlterm: COLORS_16,
	mosh: COLORS_16m,
	putty: COLORS_16,
	st: COLORS_16,
	"rxvt-unicode-24bit": COLORS_16m,
	terminator: COLORS_16m,
	"xterm-kitty": COLORS_16m
};
var CI_ENVS_MAP = new Map(Object.entries({
	APPVEYOR: COLORS_256,
	BUILDKITE: COLORS_256,
	CIRCLECI: COLORS_16m,
	DRONE: COLORS_256,
	GITEA_ACTIONS: COLORS_16m,
	GITHUB_ACTIONS: COLORS_16m,
	GITLAB_CI: COLORS_256,
	TRAVIS: COLORS_256
}));
var TERM_ENVS_REG_EXP = [
	/ansi/,
	/color/,
	/linux/,
	/direct/,
	/^con[0-9]*x[0-9]/,
	/^rxvt/,
	/^screen/,
	/^xterm/,
	/^vt100/,
	/^vt220/
];
function getColorDepth() {
	if (getEnvVar("FORCE_COLOR") !== void 0) switch (getEnvVar("FORCE_COLOR")) {
		case "":
		case "1":
		case "true": return COLORS_16;
		case "2": return COLORS_256;
		case "3": return COLORS_16m;
		default: return COLORS_2;
	}
	if (getEnvVar("NODE_DISABLE_COLORS") !== void 0 && getEnvVar("NODE_DISABLE_COLORS") !== "" || getEnvVar("NO_COLOR") !== void 0 && getEnvVar("NO_COLOR") !== "" || getEnvVar("TERM") === "dumb") return COLORS_2;
	if (getEnvVar("TMUX")) return COLORS_16m;
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return COLORS_16;
	if ("CI" in env) {
		for (const { 0: envName, 1: colors } of CI_ENVS_MAP) if (envName in env) return colors;
		if (getEnvVar("CI_NAME") === "codeship") return COLORS_256;
		return COLORS_2;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(getEnvVar("TEAMCITY_VERSION")) !== null ? COLORS_16 : COLORS_2;
	switch (getEnvVar("TERM_PROGRAM")) {
		case "iTerm.app":
			if (!getEnvVar("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec(getEnvVar("TERM_PROGRAM_VERSION")) !== null) return COLORS_256;
			return COLORS_16m;
		case "HyperTerm":
		case "MacTerm": return COLORS_16m;
		case "Apple_Terminal": return COLORS_256;
	}
	if (getEnvVar("COLORTERM") === "truecolor" || getEnvVar("COLORTERM") === "24bit") return COLORS_16m;
	if (getEnvVar("TERM")) {
		if (/truecolor/.exec(getEnvVar("TERM")) !== null) return COLORS_16m;
		if (/^xterm-256/.exec(getEnvVar("TERM")) !== null) return COLORS_256;
		const termEnv = getEnvVar("TERM").toLowerCase();
		if (TERM_ENVS[termEnv]) return TERM_ENVS[termEnv];
		if (TERM_ENVS_REG_EXP.some((term) => term.exec(termEnv) !== null)) return COLORS_16;
	}
	if (getEnvVar("COLORTERM")) return COLORS_16;
	return COLORS_2;
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/env/logger.mjs
var TTY_COLORS = {
	reset: "\x1B[0m",
	bright: "\x1B[1m",
	dim: "\x1B[2m",
	undim: "\x1B[22m",
	underscore: "\x1B[4m",
	blink: "\x1B[5m",
	reverse: "\x1B[7m",
	hidden: "\x1B[8m",
	fg: {
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m"
	},
	bg: {
		black: "\x1B[40m",
		red: "\x1B[41m",
		green: "\x1B[42m",
		yellow: "\x1B[43m",
		blue: "\x1B[44m",
		magenta: "\x1B[45m",
		cyan: "\x1B[46m",
		white: "\x1B[47m"
	}
};
var levels = [
	"debug",
	"info",
	"success",
	"warn",
	"error"
];
function shouldPublishLog(currentLogLevel, logLevel) {
	return levels.indexOf(logLevel) >= levels.indexOf(currentLogLevel);
}
var levelColors = {
	info: TTY_COLORS.fg.blue,
	success: TTY_COLORS.fg.green,
	warn: TTY_COLORS.fg.yellow,
	error: TTY_COLORS.fg.red,
	debug: TTY_COLORS.fg.magenta
};
var formatMessage = (level, message, colorsEnabled) => {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	if (colorsEnabled) return `${TTY_COLORS.dim}${timestamp}${TTY_COLORS.reset} ${levelColors[level]}${level.toUpperCase()}${TTY_COLORS.reset} ${TTY_COLORS.bright}[Better Auth]:${TTY_COLORS.reset} ${message}`;
	return `${timestamp} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
var createLogger = (options) => {
	const enabled = options?.disabled !== true;
	const logLevel = options?.level ?? "warn";
	const colorsEnabled = options?.disableColors !== void 0 ? !options.disableColors : getColorDepth() !== 1;
	const LogFunc = (level, message, args = []) => {
		if (!enabled || !shouldPublishLog(logLevel, level)) return;
		const formattedMessage = formatMessage(level, message, colorsEnabled);
		if (!options || typeof options.log !== "function") {
			if (level === "error") console.error(formattedMessage, ...args);
			else if (level === "warn") console.warn(formattedMessage, ...args);
			else console.log(formattedMessage, ...args);
			return;
		}
		options.log(level === "success" ? "info" : level, message, ...args);
	};
	return {
		...Object.fromEntries(levels.map((level) => [level, (...[message, ...args]) => LogFunc(level, message, args)])),
		get level() {
			return logLevel;
		}
	};
};
var logger = createLogger();
//#endregion
//#region node_modules/.pnpm/@better-auth+utils@0.4.2/node_modules/@better-auth/utils/dist/random.mjs
function expandAlphabet(alphabet) {
	switch (alphabet) {
		case "a-z": return "abcdefghijklmnopqrstuvwxyz";
		case "A-Z": return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		case "0-9": return "0123456789";
		case "-_": return "-_";
		default: throw new Error(`Unsupported alphabet: ${alphabet}`);
	}
}
function createRandomStringGenerator(...baseAlphabets) {
	const baseCharSet = baseAlphabets.map(expandAlphabet).join("");
	if (baseCharSet.length === 0) throw new Error("No valid characters provided for random string generation.");
	const baseCharSetLength = baseCharSet.length;
	return (length, ...alphabets) => {
		if (length <= 0) throw new Error("Length must be a positive integer.");
		let charSet = baseCharSet;
		let charSetLength = baseCharSetLength;
		if (alphabets.length > 0) {
			charSet = alphabets.map(expandAlphabet).join("");
			charSetLength = charSet.length;
		}
		const maxValid = Math.floor(256 / charSetLength) * charSetLength;
		const buf = new Uint8Array(length * 2);
		const bufLength = buf.length;
		let result = "";
		let bufIndex = bufLength;
		let rand;
		while (result.length < length) {
			if (bufIndex >= bufLength) {
				crypto.getRandomValues(buf);
				bufIndex = 0;
			}
			rand = buf[bufIndex++];
			if (rand < maxValid) result += charSet[rand % charSetLength];
		}
		return result;
	};
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/utils/id.mjs
var generateId = (size) => {
	return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs
var initGetIdField = ({ usePlural, schema, disableIdGeneration, options, customIdGenerator, supportsUUIDs }) => {
	const getDefaultModelName = initGetDefaultModelName({
		usePlural,
		schema
	});
	const idField = ({ customModelName, forceAllowId }) => {
		const useNumberId = options.advanced?.database?.generateId === "serial";
		const useUUIDs = options.advanced?.database?.generateId === "uuid";
		const shouldGenerateId = (() => {
			if (disableIdGeneration) return false;
			else if (useNumberId && !forceAllowId) return false;
			else if (useUUIDs) return !supportsUUIDs;
			else return true;
		})();
		const model = getDefaultModelName(customModelName ?? "id");
		return {
			type: useNumberId ? "number" : "string",
			required: shouldGenerateId ? true : false,
			...shouldGenerateId ? { defaultValue() {
				if (disableIdGeneration) return void 0;
				const generateId$1 = options.advanced?.database?.generateId;
				if (generateId$1 === false || generateId$1 === "serial") return void 0;
				if (typeof generateId$1 === "function") return generateId$1({ model });
				if (generateId$1 === "uuid") return crypto.randomUUID();
				if (customIdGenerator) return customIdGenerator({ model });
				return generateId();
			} } : {},
			transform: {
				input: (value) => {
					if (!value) return void 0;
					if (useNumberId) {
						const numberValue = Number(value);
						if (isNaN(numberValue)) return;
						return numberValue;
					}
					if (useUUIDs) {
						if (shouldGenerateId && !forceAllowId) return value;
						if (disableIdGeneration) return void 0;
						if (forceAllowId && typeof value === "string") if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
						else {
							const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i) => i !== 1).join("\n").replace("Error:", "");
							logger.warn("[Adapter Factory] - Invalid UUID value for field `id` provided when `forceAllowId` is true. Generating a new UUID.", stack);
						}
						if (supportsUUIDs) return void 0;
						if (typeof value !== "string" && !supportsUUIDs) return crypto.randomUUID();
						return;
					}
					return value;
				},
				output: (value) => {
					if (!value) return void 0;
					return String(value);
				}
			}
		};
	};
	return idField;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-field-attributes.mjs
var initGetFieldAttributes = ({ usePlural, schema, options, customIdGenerator, disableIdGeneration }) => {
	const getDefaultModelName = initGetDefaultModelName({
		usePlural,
		schema
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		usePlural,
		schema
	});
	const idField = initGetIdField({
		usePlural,
		schema,
		options,
		customIdGenerator,
		disableIdGeneration
	});
	const getFieldAttributes = ({ model, field }) => {
		const defaultModelName = getDefaultModelName(model);
		const defaultFieldName = getDefaultFieldName({
			field,
			model: defaultModelName
		});
		const fields = schema[defaultModelName].fields;
		fields.id = idField({ customModelName: defaultModelName });
		const fieldAttributes = fields[defaultFieldName];
		if (!fieldAttributes) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
		return fieldAttributes;
	};
	return getFieldAttributes;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs
var initGetFieldName = ({ schema, usePlural }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		schema,
		usePlural
	});
	/**
	* Get the field name which is expected to be saved in the database based on the user's schema.
	*
	* This function is useful if you need to save the field name to the database.
	*
	* For example, if the user has defined a custom field name for the `user` model, then you can use this function to get the actual field name from the schema.
	*/
	function getFieldName({ model: modelName, field: fieldName }) {
		const model = getDefaultModelName(modelName);
		const field = getDefaultFieldName({
			model,
			field: fieldName
		});
		return schema[model]?.fields[field]?.fieldName || field;
	}
	return getFieldName;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs
var initGetModelName = ({ usePlural, schema }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	/**
	* Users can overwrite the default model of some tables. This function helps find the correct model name.
	* Furthermore, if the user passes `usePlural` as true in their adapter config,
	* then we should return the model name ending with an `s`.
	*/
	const getModelName = (model) => {
		const defaultModelKey = getDefaultModelName(model);
		if (schema && schema[defaultModelKey] && schema[defaultModelKey].modelName !== model) return usePlural ? `${schema[defaultModelKey].modelName}s` : schema[defaultModelKey].modelName;
		return usePlural ? `${model}s` : model;
	};
	return getModelName;
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/utils.mjs
function withApplyDefault(value, field, action) {
	if (action === "update") {
		if (value === void 0 && field.onUpdate !== void 0) {
			if (typeof field.onUpdate === "function") return field.onUpdate();
			return field.onUpdate;
		}
		return value;
	}
	if (action === "create") {
		if (value === void 0 || field.required === true && value === null) {
			if (field.defaultValue !== void 0) {
				if (typeof field.defaultValue === "function") return field.defaultValue();
				return field.defaultValue;
			}
		}
	}
	return value;
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/context/global.mjs
var symbol = Symbol.for("better-auth:global");
var bind = null;
var __context = {};
var __betterAuthVersion = "1.6.23";
/**
* We store context instance in the globalThis.
*
* The reason we do this is that some bundlers, web framework, or package managers might
* create multiple copies of BetterAuth in the same process intentionally or unintentionally.
*
* For example, yarn v1, Next.js, SSR, Vite...
*
* @internal
*/
function __getBetterAuthGlobal() {
	if (!globalThis[symbol]) {
		globalThis[symbol] = {
			version: __betterAuthVersion,
			epoch: 1,
			context: __context
		};
		bind = globalThis[symbol];
	}
	bind = globalThis[symbol];
	if (bind.version !== __betterAuthVersion) {
		bind.version = __betterAuthVersion;
		bind.epoch++;
	}
	return globalThis[symbol];
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/async_hooks/index.mjs
var AsyncLocalStoragePromise = import(
	/* @vite-ignore */
	/* webpackIgnore: true */
	"node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
	if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
	if (typeof window !== "undefined") return null;
	console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
	console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
	console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
	throw err;
});
async function getAsyncLocalStorage() {
	const mod = await AsyncLocalStoragePromise;
	if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
	else return mod;
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/context/transaction.mjs
var ensureAsyncStorage = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	if (!betterAuthGlobal.context.adapterAsyncStorage) {
		const AsyncLocalStorage = await getAsyncLocalStorage();
		betterAuthGlobal.context.adapterAsyncStorage = new AsyncLocalStorage();
	}
	return betterAuthGlobal.context.adapterAsyncStorage;
};
var getCurrentAdapter = async (fallback) => {
	return ensureAsyncStorage().then((als) => {
		return als.getStore()?.adapter || fallback;
	}).catch(() => {
		return fallback;
	});
};
var runWithTransaction = async (adapter, fn) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		if (als.getStore()?.isTransactionActive) return fn();
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await adapter.transaction(async (trx) => {
				return als.run({
					adapter: trx,
					pendingHooks,
					isTransactionActive: true
				}, fn);
			});
		} catch (e) {
			hasError = true;
			error = e;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/get-tables.mjs
var getAuthTables = (options) => {
	const pluginSchema = (options.plugins ?? []).reduce((acc, plugin) => {
		const schema = plugin.schema;
		if (!schema) return acc;
		for (const [key, value] of Object.entries(schema)) acc[key] = {
			fields: {
				...acc[key]?.fields,
				...value.fields
			},
			modelName: value.modelName || key,
			disableMigrations: value.disableMigration ?? acc[key]?.disableMigrations
		};
		return acc;
	}, {});
	const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
	const rateLimitTable = { rateLimit: {
		modelName: options.rateLimit?.modelName || "rateLimit",
		fields: {
			key: {
				type: "string",
				unique: true,
				required: true,
				fieldName: options.rateLimit?.fields?.key || "key"
			},
			count: {
				type: "number",
				required: true,
				fieldName: options.rateLimit?.fields?.count || "count"
			},
			lastRequest: {
				type: "number",
				bigint: true,
				required: true,
				fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest",
				defaultValue: () => Date.now()
			}
		}
	} };
	const { user, session, account, verification, ...pluginTables } = pluginSchema;
	const verificationTable = { verification: {
		modelName: options.verification?.modelName || "verification",
		fields: {
			identifier: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.identifier || "identifier",
				index: true
			},
			value: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.value || "value"
			},
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.verification?.fields?.expiresAt || "expiresAt"
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.createdAt || "createdAt"
			},
			updatedAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				onUpdate: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.updatedAt || "updatedAt"
			},
			...verification?.fields,
			...options.verification?.additionalFields
		},
		order: 4
	} };
	const sessionTable = { session: {
		modelName: options.session?.modelName || "session",
		fields: {
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.expiresAt || "expiresAt"
			},
			token: {
				type: "string",
				required: true,
				fieldName: options.session?.fields?.token || "token",
				unique: true
			},
			createdAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.createdAt || "createdAt",
				defaultValue: () => /* @__PURE__ */ new Date()
			},
			updatedAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.updatedAt || "updatedAt",
				onUpdate: () => /* @__PURE__ */ new Date()
			},
			ipAddress: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.ipAddress || "ipAddress"
			},
			userAgent: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.userAgent || "userAgent"
			},
			userId: {
				type: "string",
				fieldName: options.session?.fields?.userId || "userId",
				references: {
					model: options.user?.modelName || "user",
					field: "id",
					onDelete: "cascade"
				},
				required: true,
				index: true
			},
			...session?.fields,
			...options.session?.additionalFields
		},
		order: 2
	} };
	return {
		user: {
			modelName: options.user?.modelName || "user",
			fields: {
				name: {
					type: "string",
					required: true,
					fieldName: options.user?.fields?.name || "name",
					sortable: true
				},
				email: {
					type: "string",
					unique: true,
					required: true,
					fieldName: options.user?.fields?.email || "email",
					sortable: true
				},
				emailVerified: {
					type: "boolean",
					defaultValue: false,
					required: true,
					fieldName: options.user?.fields?.emailVerified || "emailVerified",
					input: false
				},
				image: {
					type: "string",
					required: false,
					fieldName: options.user?.fields?.image || "image"
				},
				createdAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.createdAt || "createdAt"
				},
				updatedAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					onUpdate: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.updatedAt || "updatedAt"
				},
				...user?.fields,
				...options.user?.additionalFields
			},
			order: 1
		},
		...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
		account: {
			modelName: options.account?.modelName || "account",
			fields: {
				accountId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.accountId || "accountId"
				},
				providerId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.providerId || "providerId"
				},
				userId: {
					type: "string",
					references: {
						model: options.user?.modelName || "user",
						field: "id",
						onDelete: "cascade"
					},
					required: true,
					fieldName: options.account?.fields?.userId || "userId",
					index: true
				},
				accessToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessToken || "accessToken"
				},
				refreshToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshToken || "refreshToken"
				},
				idToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.idToken || "idToken"
				},
				accessTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
				},
				refreshTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
				},
				scope: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.scope || "scope"
				},
				password: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.password || "password"
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.createdAt || "createdAt",
					defaultValue: () => /* @__PURE__ */ new Date()
				},
				updatedAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.updatedAt || "updatedAt",
					onUpdate: () => /* @__PURE__ */ new Date()
				},
				...account?.fields,
				...options.account?.additionalFields
			},
			order: 3
		},
		...!options.secondaryStorage || options.verification?.storeInDatabase ? verificationTable : {},
		...pluginTables,
		...shouldAddRateLimitTable ? rateLimitTable : {}
	};
};
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/utils/json.mjs
var iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function reviveDate(value) {
	if (typeof value === "string" && iso8601Regex.test(value)) {
		const date = new Date(value);
		if (!isNaN(date.getTime())) return date;
	}
	return value;
}
/**
* Recursively walk a pre-parsed object and convert ISO 8601 date strings
* to Date instances. This handles the case where a Redis client (or similar)
* returns already-parsed JSON objects whose date fields are still strings.
*/
function reviveDates(value) {
	if (value === null || value === void 0) return value;
	if (typeof value === "string") return reviveDate(value);
	if (value instanceof Date) return value;
	if (Array.isArray(value)) return value.map(reviveDates);
	if (typeof value === "object") {
		const result = {};
		for (const key of Object.keys(value)) result[key] = reviveDates(value[key]);
		return result;
	}
	return value;
}
function safeJSONParse(data) {
	try {
		if (typeof data !== "string") {
			if (data === null || data === void 0) return null;
			return reviveDates(data);
		}
		return JSON.parse(data, (_, value) => reviveDate(value));
	} catch (e) {
		logger.error("Error parsing JSON", { error: e });
		return null;
	}
}
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/internal/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createConstMap = void 0;
	/**
	* Creates a const map from the given values
	* @param values - An array of values to be used as keys and values in the map.
	* @returns A populated version of the map with the values and keys derived from the values.
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function createConstMap(values) {
		let res = {};
		const len = values.length;
		for (let lp = 0; lp < len; lp++) {
			const val = values[lp];
			if (val) res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
		}
		return res;
	}
	exports.createConstMap = createConstMap;
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/trace/SemanticAttributes.js
var require_SemanticAttributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SEMATTRS_NET_HOST_CARRIER_ICC = exports.SEMATTRS_NET_HOST_CARRIER_MNC = exports.SEMATTRS_NET_HOST_CARRIER_MCC = exports.SEMATTRS_NET_HOST_CARRIER_NAME = exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = exports.SEMATTRS_NET_HOST_NAME = exports.SEMATTRS_NET_HOST_PORT = exports.SEMATTRS_NET_HOST_IP = exports.SEMATTRS_NET_PEER_NAME = exports.SEMATTRS_NET_PEER_PORT = exports.SEMATTRS_NET_PEER_IP = exports.SEMATTRS_NET_TRANSPORT = exports.SEMATTRS_FAAS_INVOKED_REGION = exports.SEMATTRS_FAAS_INVOKED_PROVIDER = exports.SEMATTRS_FAAS_INVOKED_NAME = exports.SEMATTRS_FAAS_COLDSTART = exports.SEMATTRS_FAAS_CRON = exports.SEMATTRS_FAAS_TIME = exports.SEMATTRS_FAAS_DOCUMENT_NAME = exports.SEMATTRS_FAAS_DOCUMENT_TIME = exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = exports.SEMATTRS_FAAS_EXECUTION = exports.SEMATTRS_FAAS_TRIGGER = exports.SEMATTRS_EXCEPTION_ESCAPED = exports.SEMATTRS_EXCEPTION_STACKTRACE = exports.SEMATTRS_EXCEPTION_MESSAGE = exports.SEMATTRS_EXCEPTION_TYPE = exports.SEMATTRS_DB_SQL_TABLE = exports.SEMATTRS_DB_MONGODB_COLLECTION = exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = exports.SEMATTRS_DB_HBASE_NAMESPACE = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = exports.SEMATTRS_DB_CASSANDRA_TABLE = exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = exports.SEMATTRS_DB_OPERATION = exports.SEMATTRS_DB_STATEMENT = exports.SEMATTRS_DB_NAME = exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = exports.SEMATTRS_DB_USER = exports.SEMATTRS_DB_CONNECTION_STRING = exports.SEMATTRS_DB_SYSTEM = exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
	exports.SEMATTRS_MESSAGING_DESTINATION_KIND = exports.SEMATTRS_MESSAGING_DESTINATION = exports.SEMATTRS_MESSAGING_SYSTEM = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = exports.SEMATTRS_AWS_DYNAMODB_COUNT = exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_SELECT = exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = exports.SEMATTRS_AWS_DYNAMODB_LIMIT = exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = exports.SEMATTRS_HTTP_CLIENT_IP = exports.SEMATTRS_HTTP_ROUTE = exports.SEMATTRS_HTTP_SERVER_NAME = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = exports.SEMATTRS_HTTP_USER_AGENT = exports.SEMATTRS_HTTP_FLAVOR = exports.SEMATTRS_HTTP_STATUS_CODE = exports.SEMATTRS_HTTP_SCHEME = exports.SEMATTRS_HTTP_HOST = exports.SEMATTRS_HTTP_TARGET = exports.SEMATTRS_HTTP_URL = exports.SEMATTRS_HTTP_METHOD = exports.SEMATTRS_CODE_LINENO = exports.SEMATTRS_CODE_FILEPATH = exports.SEMATTRS_CODE_NAMESPACE = exports.SEMATTRS_CODE_FUNCTION = exports.SEMATTRS_THREAD_NAME = exports.SEMATTRS_THREAD_ID = exports.SEMATTRS_ENDUSER_SCOPE = exports.SEMATTRS_ENDUSER_ROLE = exports.SEMATTRS_ENDUSER_ID = exports.SEMATTRS_PEER_SERVICE = void 0;
	exports.DBSYSTEMVALUES_FILEMAKER = exports.DBSYSTEMVALUES_DERBY = exports.DBSYSTEMVALUES_FIREBIRD = exports.DBSYSTEMVALUES_ADABAS = exports.DBSYSTEMVALUES_CACHE = exports.DBSYSTEMVALUES_EDB = exports.DBSYSTEMVALUES_FIRSTSQL = exports.DBSYSTEMVALUES_INGRES = exports.DBSYSTEMVALUES_HANADB = exports.DBSYSTEMVALUES_MAXDB = exports.DBSYSTEMVALUES_PROGRESS = exports.DBSYSTEMVALUES_HSQLDB = exports.DBSYSTEMVALUES_CLOUDSCAPE = exports.DBSYSTEMVALUES_HIVE = exports.DBSYSTEMVALUES_REDSHIFT = exports.DBSYSTEMVALUES_POSTGRESQL = exports.DBSYSTEMVALUES_DB2 = exports.DBSYSTEMVALUES_ORACLE = exports.DBSYSTEMVALUES_MYSQL = exports.DBSYSTEMVALUES_MSSQL = exports.DBSYSTEMVALUES_OTHER_SQL = exports.SemanticAttributes = exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_ID = exports.SEMATTRS_MESSAGE_TYPE = exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = exports.SEMATTRS_RPC_JSONRPC_VERSION = exports.SEMATTRS_RPC_GRPC_STATUS_CODE = exports.SEMATTRS_RPC_METHOD = exports.SEMATTRS_RPC_SERVICE = exports.SEMATTRS_RPC_SYSTEM = exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = exports.SEMATTRS_MESSAGING_CONSUMER_ID = exports.SEMATTRS_MESSAGING_OPERATION = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = exports.SEMATTRS_MESSAGING_CONVERSATION_ID = exports.SEMATTRS_MESSAGING_MESSAGE_ID = exports.SEMATTRS_MESSAGING_URL = exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = exports.SEMATTRS_MESSAGING_PROTOCOL = exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
	exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = exports.FaasDocumentOperationValues = exports.FAASDOCUMENTOPERATIONVALUES_DELETE = exports.FAASDOCUMENTOPERATIONVALUES_EDIT = exports.FAASDOCUMENTOPERATIONVALUES_INSERT = exports.FaasTriggerValues = exports.FAASTRIGGERVALUES_OTHER = exports.FAASTRIGGERVALUES_TIMER = exports.FAASTRIGGERVALUES_PUBSUB = exports.FAASTRIGGERVALUES_HTTP = exports.FAASTRIGGERVALUES_DATASOURCE = exports.DbCassandraConsistencyLevelValues = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = exports.DbSystemValues = exports.DBSYSTEMVALUES_COCKROACHDB = exports.DBSYSTEMVALUES_MEMCACHED = exports.DBSYSTEMVALUES_ELASTICSEARCH = exports.DBSYSTEMVALUES_GEODE = exports.DBSYSTEMVALUES_NEO4J = exports.DBSYSTEMVALUES_DYNAMODB = exports.DBSYSTEMVALUES_COSMOSDB = exports.DBSYSTEMVALUES_COUCHDB = exports.DBSYSTEMVALUES_COUCHBASE = exports.DBSYSTEMVALUES_REDIS = exports.DBSYSTEMVALUES_MONGODB = exports.DBSYSTEMVALUES_HBASE = exports.DBSYSTEMVALUES_CASSANDRA = exports.DBSYSTEMVALUES_COLDFUSION = exports.DBSYSTEMVALUES_H2 = exports.DBSYSTEMVALUES_VERTICA = exports.DBSYSTEMVALUES_TERADATA = exports.DBSYSTEMVALUES_SYBASE = exports.DBSYSTEMVALUES_SQLITE = exports.DBSYSTEMVALUES_POINTBASE = exports.DBSYSTEMVALUES_PERVASIVE = exports.DBSYSTEMVALUES_NETEZZA = exports.DBSYSTEMVALUES_MARIADB = exports.DBSYSTEMVALUES_INTERBASE = exports.DBSYSTEMVALUES_INSTANTDB = exports.DBSYSTEMVALUES_INFORMIX = void 0;
	exports.MESSAGINGOPERATIONVALUES_RECEIVE = exports.MessagingDestinationKindValues = exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = exports.HttpFlavorValues = exports.HTTPFLAVORVALUES_QUIC = exports.HTTPFLAVORVALUES_SPDY = exports.HTTPFLAVORVALUES_HTTP_2_0 = exports.HTTPFLAVORVALUES_HTTP_1_1 = exports.HTTPFLAVORVALUES_HTTP_1_0 = exports.NetHostConnectionSubtypeValues = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = exports.NetHostConnectionTypeValues = exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = exports.NETHOSTCONNECTIONTYPEVALUES_CELL = exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = exports.NetTransportValues = exports.NETTRANSPORTVALUES_OTHER = exports.NETTRANSPORTVALUES_INPROC = exports.NETTRANSPORTVALUES_PIPE = exports.NETTRANSPORTVALUES_UNIX = exports.NETTRANSPORTVALUES_IP = exports.NETTRANSPORTVALUES_IP_UDP = exports.NETTRANSPORTVALUES_IP_TCP = exports.FaasInvokedProviderValues = exports.FAASINVOKEDPROVIDERVALUES_GCP = exports.FAASINVOKEDPROVIDERVALUES_AZURE = exports.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
	exports.MessageTypeValues = exports.MESSAGETYPEVALUES_RECEIVED = exports.MESSAGETYPEVALUES_SENT = exports.RpcGrpcStatusCodeValues = exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = exports.RPCGRPCSTATUSCODEVALUES_ABORTED = exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = exports.RPCGRPCSTATUSCODEVALUES_OK = exports.MessagingOperationValues = exports.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
	var utils_1 = require_utils();
	var TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
	var TMP_DB_SYSTEM = "db.system";
	var TMP_DB_CONNECTION_STRING = "db.connection_string";
	var TMP_DB_USER = "db.user";
	var TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
	var TMP_DB_NAME = "db.name";
	var TMP_DB_STATEMENT = "db.statement";
	var TMP_DB_OPERATION = "db.operation";
	var TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
	var TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
	var TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
	var TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
	var TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
	var TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
	var TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
	var TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
	var TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
	var TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
	var TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
	var TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
	var TMP_DB_SQL_TABLE = "db.sql.table";
	var TMP_EXCEPTION_TYPE = "exception.type";
	var TMP_EXCEPTION_MESSAGE = "exception.message";
	var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
	var TMP_EXCEPTION_ESCAPED = "exception.escaped";
	var TMP_FAAS_TRIGGER = "faas.trigger";
	var TMP_FAAS_EXECUTION = "faas.execution";
	var TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
	var TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
	var TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
	var TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
	var TMP_FAAS_TIME = "faas.time";
	var TMP_FAAS_CRON = "faas.cron";
	var TMP_FAAS_COLDSTART = "faas.coldstart";
	var TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
	var TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
	var TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
	var TMP_NET_TRANSPORT = "net.transport";
	var TMP_NET_PEER_IP = "net.peer.ip";
	var TMP_NET_PEER_PORT = "net.peer.port";
	var TMP_NET_PEER_NAME = "net.peer.name";
	var TMP_NET_HOST_IP = "net.host.ip";
	var TMP_NET_HOST_PORT = "net.host.port";
	var TMP_NET_HOST_NAME = "net.host.name";
	var TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
	var TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
	var TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
	var TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
	var TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
	var TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
	var TMP_PEER_SERVICE = "peer.service";
	var TMP_ENDUSER_ID = "enduser.id";
	var TMP_ENDUSER_ROLE = "enduser.role";
	var TMP_ENDUSER_SCOPE = "enduser.scope";
	var TMP_THREAD_ID = "thread.id";
	var TMP_THREAD_NAME = "thread.name";
	var TMP_CODE_FUNCTION = "code.function";
	var TMP_CODE_NAMESPACE = "code.namespace";
	var TMP_CODE_FILEPATH = "code.filepath";
	var TMP_CODE_LINENO = "code.lineno";
	var TMP_HTTP_METHOD = "http.method";
	var TMP_HTTP_URL = "http.url";
	var TMP_HTTP_TARGET = "http.target";
	var TMP_HTTP_HOST = "http.host";
	var TMP_HTTP_SCHEME = "http.scheme";
	var TMP_HTTP_STATUS_CODE = "http.status_code";
	var TMP_HTTP_FLAVOR = "http.flavor";
	var TMP_HTTP_USER_AGENT = "http.user_agent";
	var TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
	var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
	var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
	var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
	var TMP_HTTP_SERVER_NAME = "http.server_name";
	var TMP_HTTP_ROUTE = "http.route";
	var TMP_HTTP_CLIENT_IP = "http.client_ip";
	var TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
	var TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
	var TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
	var TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
	var TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
	var TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
	var TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
	var TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
	var TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
	var TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
	var TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
	var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
	var TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
	var TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
	var TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
	var TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
	var TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
	var TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
	var TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
	var TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
	var TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
	var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
	var TMP_MESSAGING_SYSTEM = "messaging.system";
	var TMP_MESSAGING_DESTINATION = "messaging.destination";
	var TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
	var TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
	var TMP_MESSAGING_PROTOCOL = "messaging.protocol";
	var TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
	var TMP_MESSAGING_URL = "messaging.url";
	var TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
	var TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
	var TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
	var TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
	var TMP_MESSAGING_OPERATION = "messaging.operation";
	var TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
	var TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
	var TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
	var TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
	var TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
	var TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
	var TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
	var TMP_RPC_SYSTEM = "rpc.system";
	var TMP_RPC_SERVICE = "rpc.service";
	var TMP_RPC_METHOD = "rpc.method";
	var TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
	var TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
	var TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
	var TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
	var TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
	var TMP_MESSAGE_TYPE = "message.type";
	var TMP_MESSAGE_ID = "message.id";
	var TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
	var TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
	/**
	* The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
	*
	* Note: This may be different from `faas.id` if an alias is involved.
	*
	* @deprecated Use ATTR_AWS_LAMBDA_INVOKED_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = TMP_AWS_LAMBDA_INVOKED_ARN;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use ATTR_DB_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_SYSTEM = TMP_DB_SYSTEM;
	/**
	* The connection string used to connect to the database. It is recommended to remove embedded credentials.
	*
	* @deprecated Use ATTR_DB_CONNECTION_STRING in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CONNECTION_STRING = TMP_DB_CONNECTION_STRING;
	/**
	* Username for accessing the database.
	*
	* @deprecated Use ATTR_DB_USER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_USER = TMP_DB_USER;
	/**
	* The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
	*
	* @deprecated Use ATTR_DB_JDBC_DRIVER_CLASSNAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = TMP_DB_JDBC_DRIVER_CLASSNAME;
	/**
	* If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
	*
	* Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_NAME = TMP_DB_NAME;
	/**
	* The database statement being executed.
	*
	* Note: The value may be sanitized to exclude sensitive information.
	*
	* @deprecated Use ATTR_DB_STATEMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_STATEMENT = TMP_DB_STATEMENT;
	/**
	* The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
	*
	* Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
	*
	* @deprecated Use ATTR_DB_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_OPERATION = TMP_DB_OPERATION;
	/**
	* The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
	*
	* Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
	*
	* @deprecated Use ATTR_DB_MSSQL_INSTANCE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = TMP_DB_MSSQL_INSTANCE_NAME;
	/**
	* The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = TMP_DB_CASSANDRA_KEYSPACE;
	/**
	* The fetch size used for paging, i.e. how many rows will be returned at once.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_PAGE_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = TMP_DB_CASSANDRA_PAGE_SIZE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = TMP_DB_CASSANDRA_CONSISTENCY_LEVEL;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_TABLE = TMP_DB_CASSANDRA_TABLE;
	/**
	* Whether or not the query is idempotent.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_IDEMPOTENCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = TMP_DB_CASSANDRA_IDEMPOTENCE;
	/**
	* The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT;
	/**
	* The ID of the coordinating node for a query.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = TMP_DB_CASSANDRA_COORDINATOR_ID;
	/**
	* The data center of the coordinating node for a query.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_DC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = TMP_DB_CASSANDRA_COORDINATOR_DC;
	/**
	* The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_HBASE_NAMESPACE = TMP_DB_HBASE_NAMESPACE;
	/**
	* The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_REDIS_DATABASE_INDEX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = TMP_DB_REDIS_DATABASE_INDEX;
	/**
	* The collection being accessed within the database stated in `db.name`.
	*
	* @deprecated Use ATTR_DB_MONGODB_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_MONGODB_COLLECTION = TMP_DB_MONGODB_COLLECTION;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*
	* @deprecated Use ATTR_DB_SQL_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_SQL_TABLE = TMP_DB_SQL_TABLE;
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*
	* @deprecated Use ATTR_EXCEPTION_TYPE.
	*/
	exports.SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
	/**
	* The exception message.
	*
	* @deprecated Use ATTR_EXCEPTION_MESSAGE.
	*/
	exports.SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*
	* @deprecated Use ATTR_EXCEPTION_STACKTRACE.
	*/
	exports.SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;
	/**
	* SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
	*
	* Note: An exception is considered to have escaped (or left) the scope of a span,
	if that span is ended while the exception is still logically &#34;in flight&#34;.
	This may be actually &#34;in flight&#34; in some languages (e.g. if the exception
	is passed to a Context manager&#39;s `__exit__` method in Python) but will
	usually be caught at the point of recording the exception in most languages.
	
	It is usually not possible to determine at the point where an exception is thrown
	whether it will escape the scope of a span.
	However, it is trivial to know that an exception
	will escape, if one checks for an active exception just before ending the span,
	as done in the [example above](#exception-end-example).
	
	It follows that an exception may still escape the scope of the span
	even if the `exception.escaped` attribute was not set or set to false,
	since the event might have been recorded at a time where it was not
	clear whether the exception will escape.
	*
	* @deprecated Use ATTR_EXCEPTION_ESCAPED.
	*/
	exports.SEMATTRS_EXCEPTION_ESCAPED = TMP_EXCEPTION_ESCAPED;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use ATTR_FAAS_TRIGGER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_TRIGGER = TMP_FAAS_TRIGGER;
	/**
	* The execution ID of the current function execution.
	*
	* @deprecated Use ATTR_FAAS_INVOCATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_EXECUTION = TMP_FAAS_EXECUTION;
	/**
	* The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = TMP_FAAS_DOCUMENT_COLLECTION;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = TMP_FAAS_DOCUMENT_OPERATION;
	/**
	* A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_TIME = TMP_FAAS_DOCUMENT_TIME;
	/**
	* The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_NAME = TMP_FAAS_DOCUMENT_NAME;
	/**
	* A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*
	* @deprecated Use ATTR_FAAS_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_TIME = TMP_FAAS_TIME;
	/**
	* A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
	*
	* @deprecated Use ATTR_FAAS_CRON in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_CRON = TMP_FAAS_CRON;
	/**
	* A boolean that is true if the serverless function is executed for the first time (aka cold-start).
	*
	* @deprecated Use ATTR_FAAS_COLDSTART in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_COLDSTART = TMP_FAAS_COLDSTART;
	/**
	* The name of the invoked function.
	*
	* Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_NAME = TMP_FAAS_INVOKED_NAME;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_PROVIDER = TMP_FAAS_INVOKED_PROVIDER;
	/**
	* The cloud region of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_REGION = TMP_FAAS_INVOKED_REGION;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use ATTR_NET_TRANSPORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_TRANSPORT = TMP_NET_TRANSPORT;
	/**
	* Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
	*
	* @deprecated Use ATTR_NET_PEER_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_IP = TMP_NET_PEER_IP;
	/**
	* Remote port number.
	*
	* @deprecated Use ATTR_NET_PEER_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_PORT = TMP_NET_PEER_PORT;
	/**
	* Remote hostname or similar, see note below.
	*
	* @deprecated Use ATTR_NET_PEER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_NAME = TMP_NET_PEER_NAME;
	/**
	* Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
	*
	* @deprecated Use ATTR_NET_HOST_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_IP = TMP_NET_HOST_IP;
	/**
	* Like `net.peer.port` but for the host port.
	*
	* @deprecated Use ATTR_NET_HOST_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_PORT = TMP_NET_HOST_PORT;
	/**
	* Local hostname or similar, see note below.
	*
	* @deprecated Use ATTR_NET_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_NAME = TMP_NET_HOST_NAME;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use ATTR_NETWORK_CONNECTION_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = TMP_NET_HOST_CONNECTION_TYPE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use ATTR_NETWORK_CONNECTION_SUBTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = TMP_NET_HOST_CONNECTION_SUBTYPE;
	/**
	* The name of the mobile carrier.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_NAME = TMP_NET_HOST_CARRIER_NAME;
	/**
	* The mobile carrier country code.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_MCC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_MCC = TMP_NET_HOST_CARRIER_MCC;
	/**
	* The mobile carrier network code.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_MNC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_MNC = TMP_NET_HOST_CARRIER_MNC;
	/**
	* The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_ICC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_ICC = TMP_NET_HOST_CARRIER_ICC;
	/**
	* The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
	*
	* @deprecated Use ATTR_PEER_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_PEER_SERVICE = TMP_PEER_SERVICE;
	/**
	* Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
	*
	* @deprecated Use ATTR_ENDUSER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_ID = TMP_ENDUSER_ID;
	/**
	* Actual/assumed role the client is making the request under extracted from token or application security context.
	*
	* @deprecated Use ATTR_ENDUSER_ROLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_ROLE = TMP_ENDUSER_ROLE;
	/**
	* Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
	*
	* @deprecated Use ATTR_ENDUSER_SCOPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_SCOPE = TMP_ENDUSER_SCOPE;
	/**
	* Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
	*
	* @deprecated Use ATTR_THREAD_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_THREAD_ID = TMP_THREAD_ID;
	/**
	* Current thread name.
	*
	* @deprecated Use ATTR_THREAD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_THREAD_NAME = TMP_THREAD_NAME;
	/**
	* The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
	*
	* @deprecated Use ATTR_CODE_FUNCTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_FUNCTION = TMP_CODE_FUNCTION;
	/**
	* The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
	*
	* @deprecated Use ATTR_CODE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_NAMESPACE = TMP_CODE_NAMESPACE;
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
	*
	* @deprecated Use ATTR_CODE_FILEPATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_FILEPATH = TMP_CODE_FILEPATH;
	/**
	* The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
	*
	* @deprecated Use ATTR_CODE_LINENO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_LINENO = TMP_CODE_LINENO;
	/**
	* HTTP request method.
	*
	* @deprecated Use ATTR_HTTP_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
	/**
	* Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
	*
	* Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
	*
	* @deprecated Use ATTR_HTTP_URL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_URL = TMP_HTTP_URL;
	/**
	* The full request target as passed in a HTTP request line or equivalent.
	*
	* @deprecated Use ATTR_HTTP_TARGET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_TARGET = TMP_HTTP_TARGET;
	/**
	* The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
	*
	* Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
	*
	* @deprecated Use ATTR_HTTP_HOST in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
	/**
	* The URI scheme identifying the used protocol.
	*
	* @deprecated Use ATTR_HTTP_SCHEME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*
	* @deprecated Use ATTR_HTTP_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use ATTR_HTTP_FLAVOR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_FLAVOR = TMP_HTTP_FLAVOR;
	/**
	* Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
	*
	* @deprecated Use ATTR_HTTP_USER_AGENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;
	/**
	* The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*
	* @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = TMP_HTTP_REQUEST_CONTENT_LENGTH;
	/**
	* The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
	*
	* @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
	/**
	* The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*
	* @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
	/**
	* The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
	*
	* @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;
	/**
	* The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
	*
	* Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
	*
	* @deprecated Use ATTR_HTTP_SERVER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_SERVER_NAME = TMP_HTTP_SERVER_NAME;
	/**
	* The matched route (path template).
	*
	* @deprecated Use ATTR_HTTP_ROUTE.
	*/
	exports.SEMATTRS_HTTP_ROUTE = TMP_HTTP_ROUTE;
	/**
	* The IP address of the original client behind all proxies, if known (e.g. from [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)).
	*
	* Note: This is not necessarily the same as `net.peer.ip`, which would
	identify the network-level peer, which may be a proxy.
	
	This attribute should be set when a source of information different
	from the one used for `net.peer.ip`, is available even if that other
	source just confirms the same value as `net.peer.ip`.
	Rationale: For `net.peer.ip`, one typically does not know if it
	comes from a proxy, reverse proxy, or the actual client. Setting
	`http.client_ip` when it&#39;s the same as `net.peer.ip` means that
	one is at least somewhat confident that the address is not that of
	the closest proxy.
	*
	* @deprecated Use ATTR_HTTP_CLIENT_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_CLIENT_IP = TMP_HTTP_CLIENT_IP;
	/**
	* The keys in the `RequestItems` object field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TABLE_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = TMP_AWS_DYNAMODB_TABLE_NAMES;
	/**
	* The JSON-serialized value of each item in the `ConsumedCapacity` response field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = TMP_AWS_DYNAMODB_CONSUMED_CAPACITY;
	/**
	* The JSON-serialized value of the `ItemCollectionMetrics` response field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS;
	/**
	* The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY;
	/**
	* The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY;
	/**
	* The value of the `ConsistentRead` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_CONSISTENT_READ in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = TMP_AWS_DYNAMODB_CONSISTENT_READ;
	/**
	* The value of the `ProjectionExpression` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROJECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = TMP_AWS_DYNAMODB_PROJECTION;
	/**
	* The value of the `Limit` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_LIMIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_LIMIT = TMP_AWS_DYNAMODB_LIMIT;
	/**
	* The value of the `AttributesToGet` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET;
	/**
	* The value of the `IndexName` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_INDEX_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = TMP_AWS_DYNAMODB_INDEX_NAME;
	/**
	* The value of the `Select` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SELECT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SELECT = TMP_AWS_DYNAMODB_SELECT;
	/**
	* The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES;
	/**
	* The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES;
	/**
	* The value of the `ExclusiveStartTableName` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE;
	/**
	* The the number of items in the `TableNames` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TABLE_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = TMP_AWS_DYNAMODB_TABLE_COUNT;
	/**
	* The value of the `ScanIndexForward` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SCAN_FORWARD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = TMP_AWS_DYNAMODB_SCAN_FORWARD;
	/**
	* The value of the `Segment` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SEGMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = TMP_AWS_DYNAMODB_SEGMENT;
	/**
	* The value of the `TotalSegments` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = TMP_AWS_DYNAMODB_TOTAL_SEGMENTS;
	/**
	* The value of the `Count` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_COUNT = TMP_AWS_DYNAMODB_COUNT;
	/**
	* The value of the `ScannedCount` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SCANNED_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = TMP_AWS_DYNAMODB_SCANNED_COUNT;
	/**
	* The JSON-serialized value of each item in the `AttributeDefinitions` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS;
	/**
	* The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES;
	/**
	* A string identifying the messaging system.
	*
	* @deprecated Use ATTR_MESSAGING_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_SYSTEM = TMP_MESSAGING_SYSTEM;
	/**
	* The message destination name. This might be equal to the span name but is required nevertheless.
	*
	* @deprecated Use ATTR_MESSAGING_DESTINATION_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_DESTINATION = TMP_MESSAGING_DESTINATION;
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.SEMATTRS_MESSAGING_DESTINATION_KIND = TMP_MESSAGING_DESTINATION_KIND;
	/**
	* A boolean that is true if the message destination is temporary.
	*
	* @deprecated Use ATTR_MESSAGING_DESTINATION_TEMPORARY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = TMP_MESSAGING_TEMP_DESTINATION;
	/**
	* The name of the transport protocol.
	*
	* @deprecated Use ATTR_NETWORK_PROTOCOL_NAME.
	*/
	exports.SEMATTRS_MESSAGING_PROTOCOL = TMP_MESSAGING_PROTOCOL;
	/**
	* The version of the transport protocol.
	*
	* @deprecated Use ATTR_NETWORK_PROTOCOL_VERSION.
	*/
	exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = TMP_MESSAGING_PROTOCOL_VERSION;
	/**
	* Connection string.
	*
	* @deprecated Removed in semconv v1.17.0.
	*/
	exports.SEMATTRS_MESSAGING_URL = TMP_MESSAGING_URL;
	/**
	* A value used by the messaging system as an identifier for the message, represented as a string.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_ID = TMP_MESSAGING_MESSAGE_ID;
	/**
	* The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_CONVERSATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_CONVERSATION_ID = TMP_MESSAGING_CONVERSATION_ID;
	/**
	* The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_BODY_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES;
	/**
	* The compressed size of the message payload in bytes.
	*
	* @deprecated Removed in semconv v1.22.0.
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES;
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use ATTR_MESSAGING_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_OPERATION = TMP_MESSAGING_OPERATION;
	/**
	* The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
	*
	* @deprecated Removed in semconv v1.21.0.
	*/
	exports.SEMATTRS_MESSAGING_CONSUMER_ID = TMP_MESSAGING_CONSUMER_ID;
	/**
	* RabbitMQ message routing key.
	*
	* @deprecated Use ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = TMP_MESSAGING_RABBITMQ_ROUTING_KEY;
	/**
	* Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
	*
	* Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = TMP_MESSAGING_KAFKA_MESSAGE_KEY;
	/**
	* Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_CONSUMER_GROUP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = TMP_MESSAGING_KAFKA_CONSUMER_GROUP;
	/**
	* Client Id for the Consumer or Producer that is handling the message.
	*
	* @deprecated Use ATTR_MESSAGING_CLIENT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = TMP_MESSAGING_KAFKA_CLIENT_ID;
	/**
	* Partition the message is sent to.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = TMP_MESSAGING_KAFKA_PARTITION;
	/**
	* A boolean that is true if the message is a tombstone.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = TMP_MESSAGING_KAFKA_TOMBSTONE;
	/**
	* A string identifying the remoting system.
	*
	* @deprecated Use ATTR_RPC_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_SYSTEM = TMP_RPC_SYSTEM;
	/**
	* The full (logical) name of the service being called, including its package name, if applicable.
	*
	* Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
	*
	* @deprecated Use ATTR_RPC_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_SERVICE = TMP_RPC_SERVICE;
	/**
	* The name of the (logical) method being called, must be equal to the $method part in the span name.
	*
	* Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
	*
	* @deprecated Use ATTR_RPC_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_METHOD = TMP_RPC_METHOD;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use ATTR_RPC_GRPC_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_GRPC_STATUS_CODE = TMP_RPC_GRPC_STATUS_CODE;
	/**
	* Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_VERSION = TMP_RPC_JSONRPC_VERSION;
	/**
	* `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_REQUEST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = TMP_RPC_JSONRPC_REQUEST_ID;
	/**
	* `error.code` property of response if it is an error response.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_ERROR_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = TMP_RPC_JSONRPC_ERROR_CODE;
	/**
	* `error.message` property of response if it is an error response.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_ERROR_MESSAGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = TMP_RPC_JSONRPC_ERROR_MESSAGE;
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use ATTR_MESSAGE_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_TYPE = TMP_MESSAGE_TYPE;
	/**
	* MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
	*
	* Note: This way we guarantee that the values will be consistent between different implementations.
	*
	* @deprecated Use ATTR_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_ID = TMP_MESSAGE_ID;
	/**
	* Compressed size of the message in bytes.
	*
	* @deprecated Use ATTR_MESSAGE_COMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = TMP_MESSAGE_COMPRESSED_SIZE;
	/**
	* Uncompressed size of the message in bytes.
	*
	* @deprecated Use ATTR_MESSAGE_UNCOMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = TMP_MESSAGE_UNCOMPRESSED_SIZE;
	/**
	* Create exported Value Map for SemanticAttributes values
	* @deprecated Use the SEMATTRS_XXXXX constants rather than the SemanticAttributes.XXXXX for bundle minification
	*/
	exports.SemanticAttributes = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_AWS_LAMBDA_INVOKED_ARN,
		TMP_DB_SYSTEM,
		TMP_DB_CONNECTION_STRING,
		TMP_DB_USER,
		TMP_DB_JDBC_DRIVER_CLASSNAME,
		TMP_DB_NAME,
		TMP_DB_STATEMENT,
		TMP_DB_OPERATION,
		TMP_DB_MSSQL_INSTANCE_NAME,
		TMP_DB_CASSANDRA_KEYSPACE,
		TMP_DB_CASSANDRA_PAGE_SIZE,
		TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
		TMP_DB_CASSANDRA_TABLE,
		TMP_DB_CASSANDRA_IDEMPOTENCE,
		TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
		TMP_DB_CASSANDRA_COORDINATOR_ID,
		TMP_DB_CASSANDRA_COORDINATOR_DC,
		TMP_DB_HBASE_NAMESPACE,
		TMP_DB_REDIS_DATABASE_INDEX,
		TMP_DB_MONGODB_COLLECTION,
		TMP_DB_SQL_TABLE,
		TMP_EXCEPTION_TYPE,
		TMP_EXCEPTION_MESSAGE,
		TMP_EXCEPTION_STACKTRACE,
		TMP_EXCEPTION_ESCAPED,
		TMP_FAAS_TRIGGER,
		TMP_FAAS_EXECUTION,
		TMP_FAAS_DOCUMENT_COLLECTION,
		TMP_FAAS_DOCUMENT_OPERATION,
		TMP_FAAS_DOCUMENT_TIME,
		TMP_FAAS_DOCUMENT_NAME,
		TMP_FAAS_TIME,
		TMP_FAAS_CRON,
		TMP_FAAS_COLDSTART,
		TMP_FAAS_INVOKED_NAME,
		TMP_FAAS_INVOKED_PROVIDER,
		TMP_FAAS_INVOKED_REGION,
		TMP_NET_TRANSPORT,
		TMP_NET_PEER_IP,
		TMP_NET_PEER_PORT,
		TMP_NET_PEER_NAME,
		TMP_NET_HOST_IP,
		TMP_NET_HOST_PORT,
		TMP_NET_HOST_NAME,
		TMP_NET_HOST_CONNECTION_TYPE,
		TMP_NET_HOST_CONNECTION_SUBTYPE,
		TMP_NET_HOST_CARRIER_NAME,
		TMP_NET_HOST_CARRIER_MCC,
		TMP_NET_HOST_CARRIER_MNC,
		TMP_NET_HOST_CARRIER_ICC,
		TMP_PEER_SERVICE,
		TMP_ENDUSER_ID,
		TMP_ENDUSER_ROLE,
		TMP_ENDUSER_SCOPE,
		TMP_THREAD_ID,
		TMP_THREAD_NAME,
		TMP_CODE_FUNCTION,
		TMP_CODE_NAMESPACE,
		TMP_CODE_FILEPATH,
		TMP_CODE_LINENO,
		TMP_HTTP_METHOD,
		TMP_HTTP_URL,
		TMP_HTTP_TARGET,
		TMP_HTTP_HOST,
		TMP_HTTP_SCHEME,
		TMP_HTTP_STATUS_CODE,
		TMP_HTTP_FLAVOR,
		TMP_HTTP_USER_AGENT,
		TMP_HTTP_REQUEST_CONTENT_LENGTH,
		TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_SERVER_NAME,
		TMP_HTTP_ROUTE,
		TMP_HTTP_CLIENT_IP,
		TMP_AWS_DYNAMODB_TABLE_NAMES,
		TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
		TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
		TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
		TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
		TMP_AWS_DYNAMODB_CONSISTENT_READ,
		TMP_AWS_DYNAMODB_PROJECTION,
		TMP_AWS_DYNAMODB_LIMIT,
		TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
		TMP_AWS_DYNAMODB_INDEX_NAME,
		TMP_AWS_DYNAMODB_SELECT,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
		TMP_AWS_DYNAMODB_TABLE_COUNT,
		TMP_AWS_DYNAMODB_SCAN_FORWARD,
		TMP_AWS_DYNAMODB_SEGMENT,
		TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
		TMP_AWS_DYNAMODB_COUNT,
		TMP_AWS_DYNAMODB_SCANNED_COUNT,
		TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
		TMP_MESSAGING_SYSTEM,
		TMP_MESSAGING_DESTINATION,
		TMP_MESSAGING_DESTINATION_KIND,
		TMP_MESSAGING_TEMP_DESTINATION,
		TMP_MESSAGING_PROTOCOL,
		TMP_MESSAGING_PROTOCOL_VERSION,
		TMP_MESSAGING_URL,
		TMP_MESSAGING_MESSAGE_ID,
		TMP_MESSAGING_CONVERSATION_ID,
		TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
		TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
		TMP_MESSAGING_OPERATION,
		TMP_MESSAGING_CONSUMER_ID,
		TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
		TMP_MESSAGING_KAFKA_MESSAGE_KEY,
		TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
		TMP_MESSAGING_KAFKA_CLIENT_ID,
		TMP_MESSAGING_KAFKA_PARTITION,
		TMP_MESSAGING_KAFKA_TOMBSTONE,
		TMP_RPC_SYSTEM,
		TMP_RPC_SERVICE,
		TMP_RPC_METHOD,
		TMP_RPC_GRPC_STATUS_CODE,
		TMP_RPC_JSONRPC_VERSION,
		TMP_RPC_JSONRPC_REQUEST_ID,
		TMP_RPC_JSONRPC_ERROR_CODE,
		TMP_RPC_JSONRPC_ERROR_MESSAGE,
		TMP_MESSAGE_TYPE,
		TMP_MESSAGE_ID,
		TMP_MESSAGE_COMPRESSED_SIZE,
		TMP_MESSAGE_UNCOMPRESSED_SIZE
	]);
	var TMP_DBSYSTEMVALUES_OTHER_SQL = "other_sql";
	var TMP_DBSYSTEMVALUES_MSSQL = "mssql";
	var TMP_DBSYSTEMVALUES_MYSQL = "mysql";
	var TMP_DBSYSTEMVALUES_ORACLE = "oracle";
	var TMP_DBSYSTEMVALUES_DB2 = "db2";
	var TMP_DBSYSTEMVALUES_POSTGRESQL = "postgresql";
	var TMP_DBSYSTEMVALUES_REDSHIFT = "redshift";
	var TMP_DBSYSTEMVALUES_HIVE = "hive";
	var TMP_DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
	var TMP_DBSYSTEMVALUES_HSQLDB = "hsqldb";
	var TMP_DBSYSTEMVALUES_PROGRESS = "progress";
	var TMP_DBSYSTEMVALUES_MAXDB = "maxdb";
	var TMP_DBSYSTEMVALUES_HANADB = "hanadb";
	var TMP_DBSYSTEMVALUES_INGRES = "ingres";
	var TMP_DBSYSTEMVALUES_FIRSTSQL = "firstsql";
	var TMP_DBSYSTEMVALUES_EDB = "edb";
	var TMP_DBSYSTEMVALUES_CACHE = "cache";
	var TMP_DBSYSTEMVALUES_ADABAS = "adabas";
	var TMP_DBSYSTEMVALUES_FIREBIRD = "firebird";
	var TMP_DBSYSTEMVALUES_DERBY = "derby";
	var TMP_DBSYSTEMVALUES_FILEMAKER = "filemaker";
	var TMP_DBSYSTEMVALUES_INFORMIX = "informix";
	var TMP_DBSYSTEMVALUES_INSTANTDB = "instantdb";
	var TMP_DBSYSTEMVALUES_INTERBASE = "interbase";
	var TMP_DBSYSTEMVALUES_MARIADB = "mariadb";
	var TMP_DBSYSTEMVALUES_NETEZZA = "netezza";
	var TMP_DBSYSTEMVALUES_PERVASIVE = "pervasive";
	var TMP_DBSYSTEMVALUES_POINTBASE = "pointbase";
	var TMP_DBSYSTEMVALUES_SQLITE = "sqlite";
	var TMP_DBSYSTEMVALUES_SYBASE = "sybase";
	var TMP_DBSYSTEMVALUES_TERADATA = "teradata";
	var TMP_DBSYSTEMVALUES_VERTICA = "vertica";
	var TMP_DBSYSTEMVALUES_H2 = "h2";
	var TMP_DBSYSTEMVALUES_COLDFUSION = "coldfusion";
	var TMP_DBSYSTEMVALUES_CASSANDRA = "cassandra";
	var TMP_DBSYSTEMVALUES_HBASE = "hbase";
	var TMP_DBSYSTEMVALUES_MONGODB = "mongodb";
	var TMP_DBSYSTEMVALUES_REDIS = "redis";
	var TMP_DBSYSTEMVALUES_COUCHBASE = "couchbase";
	var TMP_DBSYSTEMVALUES_COUCHDB = "couchdb";
	var TMP_DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
	var TMP_DBSYSTEMVALUES_DYNAMODB = "dynamodb";
	var TMP_DBSYSTEMVALUES_NEO4J = "neo4j";
	var TMP_DBSYSTEMVALUES_GEODE = "geode";
	var TMP_DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
	var TMP_DBSYSTEMVALUES_MEMCACHED = "memcached";
	var TMP_DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_OTHER_SQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_OTHER_SQL = TMP_DBSYSTEMVALUES_OTHER_SQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MSSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MSSQL = TMP_DBSYSTEMVALUES_MSSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MYSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MYSQL = TMP_DBSYSTEMVALUES_MYSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ORACLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ORACLE = TMP_DBSYSTEMVALUES_ORACLE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DB2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DB2 = TMP_DBSYSTEMVALUES_DB2;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_POSTGRESQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_POSTGRESQL = TMP_DBSYSTEMVALUES_POSTGRESQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_REDSHIFT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_REDSHIFT = TMP_DBSYSTEMVALUES_REDSHIFT;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HIVE = TMP_DBSYSTEMVALUES_HIVE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CLOUDSCAPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CLOUDSCAPE = TMP_DBSYSTEMVALUES_CLOUDSCAPE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HSQLDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HSQLDB = TMP_DBSYSTEMVALUES_HSQLDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_PROGRESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_PROGRESS = TMP_DBSYSTEMVALUES_PROGRESS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MAXDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MAXDB = TMP_DBSYSTEMVALUES_MAXDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HANADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HANADB = TMP_DBSYSTEMVALUES_HANADB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INGRES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INGRES = TMP_DBSYSTEMVALUES_INGRES;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FIRSTSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FIRSTSQL = TMP_DBSYSTEMVALUES_FIRSTSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_EDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_EDB = TMP_DBSYSTEMVALUES_EDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CACHE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CACHE = TMP_DBSYSTEMVALUES_CACHE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ADABAS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ADABAS = TMP_DBSYSTEMVALUES_ADABAS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FIREBIRD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FIREBIRD = TMP_DBSYSTEMVALUES_FIREBIRD;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DERBY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DERBY = TMP_DBSYSTEMVALUES_DERBY;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FILEMAKER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FILEMAKER = TMP_DBSYSTEMVALUES_FILEMAKER;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INFORMIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INFORMIX = TMP_DBSYSTEMVALUES_INFORMIX;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INSTANTDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INSTANTDB = TMP_DBSYSTEMVALUES_INSTANTDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INTERBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INTERBASE = TMP_DBSYSTEMVALUES_INTERBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MARIADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MARIADB = TMP_DBSYSTEMVALUES_MARIADB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_NETEZZA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_NETEZZA = TMP_DBSYSTEMVALUES_NETEZZA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_PERVASIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_PERVASIVE = TMP_DBSYSTEMVALUES_PERVASIVE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_POINTBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_POINTBASE = TMP_DBSYSTEMVALUES_POINTBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_SQLITE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_SQLITE = TMP_DBSYSTEMVALUES_SQLITE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_SYBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_SYBASE = TMP_DBSYSTEMVALUES_SYBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_TERADATA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_TERADATA = TMP_DBSYSTEMVALUES_TERADATA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_VERTICA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_VERTICA = TMP_DBSYSTEMVALUES_VERTICA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_H2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_H2 = TMP_DBSYSTEMVALUES_H2;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COLDFUSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COLDFUSION = TMP_DBSYSTEMVALUES_COLDFUSION;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CASSANDRA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CASSANDRA = TMP_DBSYSTEMVALUES_CASSANDRA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HBASE = TMP_DBSYSTEMVALUES_HBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MONGODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MONGODB = TMP_DBSYSTEMVALUES_MONGODB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_REDIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_REDIS = TMP_DBSYSTEMVALUES_REDIS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COUCHBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COUCHBASE = TMP_DBSYSTEMVALUES_COUCHBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COUCHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COUCHDB = TMP_DBSYSTEMVALUES_COUCHDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COSMOSDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COSMOSDB = TMP_DBSYSTEMVALUES_COSMOSDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DYNAMODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DYNAMODB = TMP_DBSYSTEMVALUES_DYNAMODB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_NEO4J in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_NEO4J = TMP_DBSYSTEMVALUES_NEO4J;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_GEODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_GEODE = TMP_DBSYSTEMVALUES_GEODE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ELASTICSEARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ELASTICSEARCH = TMP_DBSYSTEMVALUES_ELASTICSEARCH;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MEMCACHED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MEMCACHED = TMP_DBSYSTEMVALUES_MEMCACHED;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COCKROACHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COCKROACHDB = TMP_DBSYSTEMVALUES_COCKROACHDB;
	/**
	* The constant map of values for DbSystemValues.
	* @deprecated Use the DBSYSTEMVALUES_XXXXX constants rather than the DbSystemValues.XXXXX for bundle minification.
	*/
	exports.DbSystemValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_DBSYSTEMVALUES_OTHER_SQL,
		TMP_DBSYSTEMVALUES_MSSQL,
		TMP_DBSYSTEMVALUES_MYSQL,
		TMP_DBSYSTEMVALUES_ORACLE,
		TMP_DBSYSTEMVALUES_DB2,
		TMP_DBSYSTEMVALUES_POSTGRESQL,
		TMP_DBSYSTEMVALUES_REDSHIFT,
		TMP_DBSYSTEMVALUES_HIVE,
		TMP_DBSYSTEMVALUES_CLOUDSCAPE,
		TMP_DBSYSTEMVALUES_HSQLDB,
		TMP_DBSYSTEMVALUES_PROGRESS,
		TMP_DBSYSTEMVALUES_MAXDB,
		TMP_DBSYSTEMVALUES_HANADB,
		TMP_DBSYSTEMVALUES_INGRES,
		TMP_DBSYSTEMVALUES_FIRSTSQL,
		TMP_DBSYSTEMVALUES_EDB,
		TMP_DBSYSTEMVALUES_CACHE,
		TMP_DBSYSTEMVALUES_ADABAS,
		TMP_DBSYSTEMVALUES_FIREBIRD,
		TMP_DBSYSTEMVALUES_DERBY,
		TMP_DBSYSTEMVALUES_FILEMAKER,
		TMP_DBSYSTEMVALUES_INFORMIX,
		TMP_DBSYSTEMVALUES_INSTANTDB,
		TMP_DBSYSTEMVALUES_INTERBASE,
		TMP_DBSYSTEMVALUES_MARIADB,
		TMP_DBSYSTEMVALUES_NETEZZA,
		TMP_DBSYSTEMVALUES_PERVASIVE,
		TMP_DBSYSTEMVALUES_POINTBASE,
		TMP_DBSYSTEMVALUES_SQLITE,
		TMP_DBSYSTEMVALUES_SYBASE,
		TMP_DBSYSTEMVALUES_TERADATA,
		TMP_DBSYSTEMVALUES_VERTICA,
		TMP_DBSYSTEMVALUES_H2,
		TMP_DBSYSTEMVALUES_COLDFUSION,
		TMP_DBSYSTEMVALUES_CASSANDRA,
		TMP_DBSYSTEMVALUES_HBASE,
		TMP_DBSYSTEMVALUES_MONGODB,
		TMP_DBSYSTEMVALUES_REDIS,
		TMP_DBSYSTEMVALUES_COUCHBASE,
		TMP_DBSYSTEMVALUES_COUCHDB,
		TMP_DBSYSTEMVALUES_COSMOSDB,
		TMP_DBSYSTEMVALUES_DYNAMODB,
		TMP_DBSYSTEMVALUES_NEO4J,
		TMP_DBSYSTEMVALUES_GEODE,
		TMP_DBSYSTEMVALUES_ELASTICSEARCH,
		TMP_DBSYSTEMVALUES_MEMCACHED,
		TMP_DBSYSTEMVALUES_COCKROACHDB
	]);
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL;
	/**
	* The constant map of values for DbCassandraConsistencyLevelValues.
	* @deprecated Use the DBCASSANDRACONSISTENCYLEVELVALUES_XXXXX constants rather than the DbCassandraConsistencyLevelValues.XXXXX for bundle minification.
	*/
	exports.DbCassandraConsistencyLevelValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL
	]);
	var TMP_FAASTRIGGERVALUES_DATASOURCE = "datasource";
	var TMP_FAASTRIGGERVALUES_HTTP = "http";
	var TMP_FAASTRIGGERVALUES_PUBSUB = "pubsub";
	var TMP_FAASTRIGGERVALUES_TIMER = "timer";
	var TMP_FAASTRIGGERVALUES_OTHER = "other";
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_DATASOURCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_DATASOURCE = TMP_FAASTRIGGERVALUES_DATASOURCE;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_HTTP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_HTTP = TMP_FAASTRIGGERVALUES_HTTP;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_PUBSUB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_PUBSUB = TMP_FAASTRIGGERVALUES_PUBSUB;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_TIMER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_TIMER = TMP_FAASTRIGGERVALUES_TIMER;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_OTHER = TMP_FAASTRIGGERVALUES_OTHER;
	/**
	* The constant map of values for FaasTriggerValues.
	* @deprecated Use the FAASTRIGGERVALUES_XXXXX constants rather than the FaasTriggerValues.XXXXX for bundle minification.
	*/
	exports.FaasTriggerValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASTRIGGERVALUES_DATASOURCE,
		TMP_FAASTRIGGERVALUES_HTTP,
		TMP_FAASTRIGGERVALUES_PUBSUB,
		TMP_FAASTRIGGERVALUES_TIMER,
		TMP_FAASTRIGGERVALUES_OTHER
	]);
	var TMP_FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
	var TMP_FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
	var TMP_FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_INSERT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_INSERT = TMP_FAASDOCUMENTOPERATIONVALUES_INSERT;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_EDIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_EDIT = TMP_FAASDOCUMENTOPERATIONVALUES_EDIT;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_DELETE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_DELETE = TMP_FAASDOCUMENTOPERATIONVALUES_DELETE;
	/**
	* The constant map of values for FaasDocumentOperationValues.
	* @deprecated Use the FAASDOCUMENTOPERATIONVALUES_XXXXX constants rather than the FaasDocumentOperationValues.XXXXX for bundle minification.
	*/
	exports.FaasDocumentOperationValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASDOCUMENTOPERATIONVALUES_INSERT,
		TMP_FAASDOCUMENTOPERATIONVALUES_EDIT,
		TMP_FAASDOCUMENTOPERATIONVALUES_DELETE
	]);
	var TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	var TMP_FAASINVOKEDPROVIDERVALUES_AWS = "aws";
	var TMP_FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
	var TMP_FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_AWS = TMP_FAASINVOKEDPROVIDERVALUES_AWS;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_AZURE = TMP_FAASINVOKEDPROVIDERVALUES_AZURE;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_GCP = TMP_FAASINVOKEDPROVIDERVALUES_GCP;
	/**
	* The constant map of values for FaasInvokedProviderValues.
	* @deprecated Use the FAASINVOKEDPROVIDERVALUES_XXXXX constants rather than the FaasInvokedProviderValues.XXXXX for bundle minification.
	*/
	exports.FaasInvokedProviderValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_FAASINVOKEDPROVIDERVALUES_AWS,
		TMP_FAASINVOKEDPROVIDERVALUES_AZURE,
		TMP_FAASINVOKEDPROVIDERVALUES_GCP
	]);
	var TMP_NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
	var TMP_NETTRANSPORTVALUES_IP_UDP = "ip_udp";
	var TMP_NETTRANSPORTVALUES_IP = "ip";
	var TMP_NETTRANSPORTVALUES_UNIX = "unix";
	var TMP_NETTRANSPORTVALUES_PIPE = "pipe";
	var TMP_NETTRANSPORTVALUES_INPROC = "inproc";
	var TMP_NETTRANSPORTVALUES_OTHER = "other";
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_IP_TCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_IP_TCP = TMP_NETTRANSPORTVALUES_IP_TCP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_IP_UDP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_IP_UDP = TMP_NETTRANSPORTVALUES_IP_UDP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Removed in v1.21.0.
	*/
	exports.NETTRANSPORTVALUES_IP = TMP_NETTRANSPORTVALUES_IP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Removed in v1.21.0.
	*/
	exports.NETTRANSPORTVALUES_UNIX = TMP_NETTRANSPORTVALUES_UNIX;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_PIPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_PIPE = TMP_NETTRANSPORTVALUES_PIPE;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_INPROC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_INPROC = TMP_NETTRANSPORTVALUES_INPROC;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_OTHER = TMP_NETTRANSPORTVALUES_OTHER;
	/**
	* The constant map of values for NetTransportValues.
	* @deprecated Use the NETTRANSPORTVALUES_XXXXX constants rather than the NetTransportValues.XXXXX for bundle minification.
	*/
	exports.NetTransportValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETTRANSPORTVALUES_IP_TCP,
		TMP_NETTRANSPORTVALUES_IP_UDP,
		TMP_NETTRANSPORTVALUES_IP,
		TMP_NETTRANSPORTVALUES_UNIX,
		TMP_NETTRANSPORTVALUES_PIPE,
		TMP_NETTRANSPORTVALUES_INPROC,
		TMP_NETTRANSPORTVALUES_OTHER
	]);
	var TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIFI in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIRED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_CELL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_CELL = TMP_NETHOSTCONNECTIONTYPEVALUES_CELL;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN;
	/**
	* The constant map of values for NetHostConnectionTypeValues.
	* @deprecated Use the NETHOSTCONNECTIONTYPEVALUES_XXXXX constants rather than the NetHostConnectionTypeValues.XXXXX for bundle minification.
	*/
	exports.NetHostConnectionTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI,
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED,
		TMP_NETHOSTCONNECTIONTYPEVALUES_CELL,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN
	]);
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GSM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA;
	/**
	* The constant map of values for NetHostConnectionSubtypeValues.
	* @deprecated Use the NETHOSTCONNECTIONSUBTYPEVALUES_XXXXX constants rather than the NetHostConnectionSubtypeValues.XXXXX for bundle minification.
	*/
	exports.NetHostConnectionSubtypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA
	]);
	var TMP_HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
	var TMP_HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
	var TMP_HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
	var TMP_HTTPFLAVORVALUES_SPDY = "SPDY";
	var TMP_HTTPFLAVORVALUES_QUIC = "QUIC";
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_1_0 = TMP_HTTPFLAVORVALUES_HTTP_1_0;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_1 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_1_1 = TMP_HTTPFLAVORVALUES_HTTP_1_1;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_2_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_2_0 = TMP_HTTPFLAVORVALUES_HTTP_2_0;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_SPDY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_SPDY = TMP_HTTPFLAVORVALUES_SPDY;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_QUIC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_QUIC = TMP_HTTPFLAVORVALUES_QUIC;
	/**
	* The constant map of values for HttpFlavorValues.
	* @deprecated Use the HTTPFLAVORVALUES_XXXXX constants rather than the HttpFlavorValues.XXXXX for bundle minification.
	*/
	exports.HttpFlavorValues = {
		HTTP_1_0: TMP_HTTPFLAVORVALUES_HTTP_1_0,
		HTTP_1_1: TMP_HTTPFLAVORVALUES_HTTP_1_1,
		HTTP_2_0: TMP_HTTPFLAVORVALUES_HTTP_2_0,
		SPDY: TMP_HTTPFLAVORVALUES_SPDY,
		QUIC: TMP_HTTPFLAVORVALUES_QUIC
	};
	var TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
	var TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE;
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC;
	/**
	* The constant map of values for MessagingDestinationKindValues.
	* @deprecated Use the MESSAGINGDESTINATIONKINDVALUES_XXXXX constants rather than the MessagingDestinationKindValues.XXXXX for bundle minification.
	*/
	exports.MessagingDestinationKindValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE, TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC]);
	var TMP_MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
	var TMP_MESSAGINGOPERATIONVALUES_PROCESS = "process";
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_RECEIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGINGOPERATIONVALUES_RECEIVE = TMP_MESSAGINGOPERATIONVALUES_RECEIVE;
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_PROCESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGINGOPERATIONVALUES_PROCESS = TMP_MESSAGINGOPERATIONVALUES_PROCESS;
	/**
	* The constant map of values for MessagingOperationValues.
	* @deprecated Use the MESSAGINGOPERATIONVALUES_XXXXX constants rather than the MessagingOperationValues.XXXXX for bundle minification.
	*/
	exports.MessagingOperationValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGINGOPERATIONVALUES_RECEIVE, TMP_MESSAGINGOPERATIONVALUES_PROCESS]);
	var TMP_RPCGRPCSTATUSCODEVALUES_OK = 0;
	var TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
	var TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
	var TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
	var TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
	var TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
	var TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
	var TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
	var TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
	var TMP_RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
	var TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
	var TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
	var TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_OK = TMP_RPCGRPCSTATUSCODEVALUES_OK;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_CANCELLED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ABORTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_ABORTED = TMP_RPCGRPCSTATUSCODEVALUES_ABORTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INTERNAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED;
	/**
	* The constant map of values for RpcGrpcStatusCodeValues.
	* @deprecated Use the RPCGRPCSTATUSCODEVALUES_XXXXX constants rather than the RpcGrpcStatusCodeValues.XXXXX for bundle minification.
	*/
	exports.RpcGrpcStatusCodeValues = {
		OK: TMP_RPCGRPCSTATUSCODEVALUES_OK,
		CANCELLED: TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED,
		UNKNOWN: TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN,
		INVALID_ARGUMENT: TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
		DEADLINE_EXCEEDED: TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
		NOT_FOUND: TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
		ALREADY_EXISTS: TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
		PERMISSION_DENIED: TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
		RESOURCE_EXHAUSTED: TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
		FAILED_PRECONDITION: TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
		ABORTED: TMP_RPCGRPCSTATUSCODEVALUES_ABORTED,
		OUT_OF_RANGE: TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
		UNIMPLEMENTED: TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
		INTERNAL: TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL,
		UNAVAILABLE: TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
		DATA_LOSS: TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
		UNAUTHENTICATED: TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED
	};
	var TMP_MESSAGETYPEVALUES_SENT = "SENT";
	var TMP_MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use MESSAGE_TYPE_VALUE_SENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGETYPEVALUES_SENT = TMP_MESSAGETYPEVALUES_SENT;
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use MESSAGE_TYPE_VALUE_RECEIVED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGETYPEVALUES_RECEIVED = TMP_MESSAGETYPEVALUES_RECEIVED;
	/**
	* The constant map of values for MessageTypeValues.
	* @deprecated Use the MESSAGETYPEVALUES_XXXXX constants rather than the MessageTypeValues.XXXXX for bundle minification.
	*/
	exports.MessageTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGETYPEVALUES_SENT, TMP_MESSAGETYPEVALUES_RECEIVED]);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/trace/index.js
var require_trace = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_SemanticAttributes(), exports);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/resource/SemanticResourceAttributes.js
var require_SemanticResourceAttributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SEMRESATTRS_K8S_STATEFULSET_NAME = exports.SEMRESATTRS_K8S_STATEFULSET_UID = exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = exports.SEMRESATTRS_K8S_REPLICASET_NAME = exports.SEMRESATTRS_K8S_REPLICASET_UID = exports.SEMRESATTRS_K8S_CONTAINER_NAME = exports.SEMRESATTRS_K8S_POD_NAME = exports.SEMRESATTRS_K8S_POD_UID = exports.SEMRESATTRS_K8S_NAMESPACE_NAME = exports.SEMRESATTRS_K8S_NODE_UID = exports.SEMRESATTRS_K8S_NODE_NAME = exports.SEMRESATTRS_K8S_CLUSTER_NAME = exports.SEMRESATTRS_HOST_IMAGE_VERSION = exports.SEMRESATTRS_HOST_IMAGE_ID = exports.SEMRESATTRS_HOST_IMAGE_NAME = exports.SEMRESATTRS_HOST_ARCH = exports.SEMRESATTRS_HOST_TYPE = exports.SEMRESATTRS_HOST_NAME = exports.SEMRESATTRS_HOST_ID = exports.SEMRESATTRS_FAAS_MAX_MEMORY = exports.SEMRESATTRS_FAAS_INSTANCE = exports.SEMRESATTRS_FAAS_VERSION = exports.SEMRESATTRS_FAAS_ID = exports.SEMRESATTRS_FAAS_NAME = exports.SEMRESATTRS_DEVICE_MODEL_NAME = exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = exports.SEMRESATTRS_DEVICE_ID = exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = exports.SEMRESATTRS_CONTAINER_RUNTIME = exports.SEMRESATTRS_CONTAINER_ID = exports.SEMRESATTRS_CONTAINER_NAME = exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = exports.SEMRESATTRS_AWS_ECS_TASK_ARN = exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = exports.SEMRESATTRS_CLOUD_PLATFORM = exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = exports.SEMRESATTRS_CLOUD_REGION = exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = exports.SEMRESATTRS_CLOUD_PROVIDER = void 0;
	exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = exports.CLOUDPLATFORMVALUES_AZURE_AKS = exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = exports.CLOUDPLATFORMVALUES_AZURE_VM = exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = exports.CLOUDPLATFORMVALUES_AWS_EKS = exports.CLOUDPLATFORMVALUES_AWS_ECS = exports.CLOUDPLATFORMVALUES_AWS_EC2 = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = exports.CloudProviderValues = exports.CLOUDPROVIDERVALUES_GCP = exports.CLOUDPROVIDERVALUES_AZURE = exports.CLOUDPROVIDERVALUES_AWS = exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = exports.SemanticResourceAttributes = exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = exports.SEMRESATTRS_WEBENGINE_VERSION = exports.SEMRESATTRS_WEBENGINE_NAME = exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = exports.SEMRESATTRS_TELEMETRY_SDK_NAME = exports.SEMRESATTRS_SERVICE_VERSION = exports.SEMRESATTRS_SERVICE_INSTANCE_ID = exports.SEMRESATTRS_SERVICE_NAMESPACE = exports.SEMRESATTRS_SERVICE_NAME = exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = exports.SEMRESATTRS_PROCESS_OWNER = exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = exports.SEMRESATTRS_PROCESS_COMMAND_LINE = exports.SEMRESATTRS_PROCESS_COMMAND = exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = exports.SEMRESATTRS_PROCESS_PID = exports.SEMRESATTRS_OS_VERSION = exports.SEMRESATTRS_OS_NAME = exports.SEMRESATTRS_OS_DESCRIPTION = exports.SEMRESATTRS_OS_TYPE = exports.SEMRESATTRS_K8S_CRONJOB_NAME = exports.SEMRESATTRS_K8S_CRONJOB_UID = exports.SEMRESATTRS_K8S_JOB_NAME = exports.SEMRESATTRS_K8S_JOB_UID = exports.SEMRESATTRS_K8S_DAEMONSET_NAME = exports.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
	exports.TelemetrySdkLanguageValues = exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = exports.TELEMETRYSDKLANGUAGEVALUES_PHP = exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = exports.TELEMETRYSDKLANGUAGEVALUES_GO = exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = exports.TELEMETRYSDKLANGUAGEVALUES_CPP = exports.OsTypeValues = exports.OSTYPEVALUES_Z_OS = exports.OSTYPEVALUES_SOLARIS = exports.OSTYPEVALUES_AIX = exports.OSTYPEVALUES_HPUX = exports.OSTYPEVALUES_DRAGONFLYBSD = exports.OSTYPEVALUES_OPENBSD = exports.OSTYPEVALUES_NETBSD = exports.OSTYPEVALUES_FREEBSD = exports.OSTYPEVALUES_DARWIN = exports.OSTYPEVALUES_LINUX = exports.OSTYPEVALUES_WINDOWS = exports.HostArchValues = exports.HOSTARCHVALUES_X86 = exports.HOSTARCHVALUES_PPC64 = exports.HOSTARCHVALUES_PPC32 = exports.HOSTARCHVALUES_IA64 = exports.HOSTARCHVALUES_ARM64 = exports.HOSTARCHVALUES_ARM32 = exports.HOSTARCHVALUES_AMD64 = exports.AwsEcsLaunchtypeValues = exports.AWSECSLAUNCHTYPEVALUES_FARGATE = exports.AWSECSLAUNCHTYPEVALUES_EC2 = exports.CloudPlatformValues = exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
	var utils_1 = require_utils();
	var TMP_CLOUD_PROVIDER = "cloud.provider";
	var TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
	var TMP_CLOUD_REGION = "cloud.region";
	var TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
	var TMP_CLOUD_PLATFORM = "cloud.platform";
	var TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
	var TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
	var TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
	var TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
	var TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
	var TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
	var TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
	var TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
	var TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
	var TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
	var TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
	var TMP_CONTAINER_NAME = "container.name";
	var TMP_CONTAINER_ID = "container.id";
	var TMP_CONTAINER_RUNTIME = "container.runtime";
	var TMP_CONTAINER_IMAGE_NAME = "container.image.name";
	var TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
	var TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
	var TMP_DEVICE_ID = "device.id";
	var TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
	var TMP_DEVICE_MODEL_NAME = "device.model.name";
	var TMP_FAAS_NAME = "faas.name";
	var TMP_FAAS_ID = "faas.id";
	var TMP_FAAS_VERSION = "faas.version";
	var TMP_FAAS_INSTANCE = "faas.instance";
	var TMP_FAAS_MAX_MEMORY = "faas.max_memory";
	var TMP_HOST_ID = "host.id";
	var TMP_HOST_NAME = "host.name";
	var TMP_HOST_TYPE = "host.type";
	var TMP_HOST_ARCH = "host.arch";
	var TMP_HOST_IMAGE_NAME = "host.image.name";
	var TMP_HOST_IMAGE_ID = "host.image.id";
	var TMP_HOST_IMAGE_VERSION = "host.image.version";
	var TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
	var TMP_K8S_NODE_NAME = "k8s.node.name";
	var TMP_K8S_NODE_UID = "k8s.node.uid";
	var TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	var TMP_K8S_POD_UID = "k8s.pod.uid";
	var TMP_K8S_POD_NAME = "k8s.pod.name";
	var TMP_K8S_CONTAINER_NAME = "k8s.container.name";
	var TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	var TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	var TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	var TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	var TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	var TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	var TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	var TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	var TMP_K8S_JOB_UID = "k8s.job.uid";
	var TMP_K8S_JOB_NAME = "k8s.job.name";
	var TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	var TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	var TMP_OS_TYPE = "os.type";
	var TMP_OS_DESCRIPTION = "os.description";
	var TMP_OS_NAME = "os.name";
	var TMP_OS_VERSION = "os.version";
	var TMP_PROCESS_PID = "process.pid";
	var TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
	var TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
	var TMP_PROCESS_COMMAND = "process.command";
	var TMP_PROCESS_COMMAND_LINE = "process.command_line";
	var TMP_PROCESS_COMMAND_ARGS = "process.command_args";
	var TMP_PROCESS_OWNER = "process.owner";
	var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
	var TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
	var TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
	var TMP_SERVICE_NAME = "service.name";
	var TMP_SERVICE_NAMESPACE = "service.namespace";
	var TMP_SERVICE_INSTANCE_ID = "service.instance.id";
	var TMP_SERVICE_VERSION = "service.version";
	var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	var TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
	var TMP_WEBENGINE_NAME = "webengine.name";
	var TMP_WEBENGINE_VERSION = "webengine.version";
	var TMP_WEBENGINE_DESCRIPTION = "webengine.description";
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use ATTR_CLOUD_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_PROVIDER = TMP_CLOUD_PROVIDER;
	/**
	* The cloud account ID the resource is assigned to.
	*
	* @deprecated Use ATTR_CLOUD_ACCOUNT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = TMP_CLOUD_ACCOUNT_ID;
	/**
	* The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
	*
	* @deprecated Use ATTR_CLOUD_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_REGION = TMP_CLOUD_REGION;
	/**
	* Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
	*
	* Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
	*
	* @deprecated Use ATTR_CLOUD_AVAILABILITY_ZONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = TMP_CLOUD_AVAILABILITY_ZONE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use ATTR_CLOUD_PLATFORM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_PLATFORM = TMP_CLOUD_PLATFORM;
	/**
	* The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
	*
	* @deprecated Use ATTR_AWS_ECS_CONTAINER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = TMP_AWS_ECS_CONTAINER_ARN;
	/**
	* The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
	*
	* @deprecated Use ATTR_AWS_ECS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = TMP_AWS_ECS_CLUSTER_ARN;
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use ATTR_AWS_ECS_LAUNCHTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = TMP_AWS_ECS_LAUNCHTYPE;
	/**
	* The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_ARN = TMP_AWS_ECS_TASK_ARN;
	/**
	* The task definition family this task definition is a member of.
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_FAMILY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = TMP_AWS_ECS_TASK_FAMILY;
	/**
	* The revision for this task definition.
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_REVISION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = TMP_AWS_ECS_TASK_REVISION;
	/**
	* The ARN of an EKS cluster.
	*
	* @deprecated Use ATTR_AWS_EKS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TMP_AWS_EKS_CLUSTER_ARN;
	/**
	* The name(s) of the AWS log group(s) an application is writing to.
	*
	* Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
	*
	* @deprecated Use ATTR_AWS_LOG_GROUP_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = TMP_AWS_LOG_GROUP_NAMES;
	/**
	* The Amazon Resource Name(s) (ARN) of the AWS log group(s).
	*
	* Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
	*
	* @deprecated Use ATTR_AWS_LOG_GROUP_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = TMP_AWS_LOG_GROUP_ARNS;
	/**
	* The name(s) of the AWS log stream(s) an application is writing to.
	*
	* @deprecated Use ATTR_AWS_LOG_STREAM_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = TMP_AWS_LOG_STREAM_NAMES;
	/**
	* The ARN(s) of the AWS log stream(s).
	*
	* Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
	*
	* @deprecated Use ATTR_AWS_LOG_STREAM_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = TMP_AWS_LOG_STREAM_ARNS;
	/**
	* Container name.
	*
	* @deprecated Use ATTR_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_NAME = TMP_CONTAINER_NAME;
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
	*
	* @deprecated Use ATTR_CONTAINER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_ID = TMP_CONTAINER_ID;
	/**
	* The container runtime managing this container.
	*
	* @deprecated Use ATTR_CONTAINER_RUNTIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_RUNTIME = TMP_CONTAINER_RUNTIME;
	/**
	* Name of the image the container was built on.
	*
	* @deprecated Use ATTR_CONTAINER_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = TMP_CONTAINER_IMAGE_NAME;
	/**
	* Container image tag.
	*
	* @deprecated Use ATTR_CONTAINER_IMAGE_TAGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = TMP_CONTAINER_IMAGE_TAG;
	/**
	* Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*
	* @deprecated Use ATTR_DEPLOYMENT_ENVIRONMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = TMP_DEPLOYMENT_ENVIRONMENT;
	/**
	* A unique identifier representing the device.
	*
	* Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
	*
	* @deprecated Use ATTR_DEVICE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_ID = TMP_DEVICE_ID;
	/**
	* The model identifier for the device.
	*
	* Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
	*
	* @deprecated Use ATTR_DEVICE_MODEL_IDENTIFIER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = TMP_DEVICE_MODEL_IDENTIFIER;
	/**
	* The marketing name for the device model.
	*
	* Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
	*
	* @deprecated Use ATTR_DEVICE_MODEL_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_MODEL_NAME = TMP_DEVICE_MODEL_NAME;
	/**
	* The name of the single function that this runtime instance executes.
	*
	* Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
	*
	* @deprecated Use ATTR_FAAS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_NAME = TMP_FAAS_NAME;
	/**
	* The unique ID of the single function that this runtime instance executes.
	*
	* Note: Depending on the cloud provider, use:
	
	* **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
	Take care not to use the &#34;invoked ARN&#34; directly but replace any
	[alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) with the resolved function version, as the same runtime instance may be invokable with multiple
	different aliases.
	* **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
	* **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/en-us/rest/api/resources/resources/get-by-id).
	
	On some providers, it may not be possible to determine the full ID at startup,
	which is why this field cannot be made required. For example, on AWS the account ID
	part of the ARN is not available without calling another AWS API
	which may be deemed too slow for a short-running lambda function.
	As an alternative, consider setting `faas.id` as a span attribute instead.
	*
	* @deprecated Use ATTR_CLOUD_RESOURCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_ID = TMP_FAAS_ID;
	/**
	* The immutable version of the function being executed.
	*
	* Note: Depending on the cloud provider and platform, use:
	
	* **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
	(an integer represented as a decimal string).
	* **Google Cloud Run:** The [revision](https://cloud.google.com/run/docs/managing/revisions)
	(i.e., the function name plus the revision suffix).
	* **Google Cloud Functions:** The value of the
	[`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
	* **Azure Functions:** Not applicable. Do not set this attribute.
	*
	* @deprecated Use ATTR_FAAS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_VERSION = TMP_FAAS_VERSION;
	/**
	* The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
	*
	* Note: * **AWS Lambda:** Use the (full) log stream name.
	*
	* @deprecated Use ATTR_FAAS_INSTANCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_INSTANCE = TMP_FAAS_INSTANCE;
	/**
	* The amount of memory available to the serverless function in MiB.
	*
	* Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
	*
	* @deprecated Use ATTR_FAAS_MAX_MEMORY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_MAX_MEMORY = TMP_FAAS_MAX_MEMORY;
	/**
	* Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
	*
	* @deprecated Use ATTR_HOST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_ID = TMP_HOST_ID;
	/**
	* Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
	*
	* @deprecated Use ATTR_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_NAME = TMP_HOST_NAME;
	/**
	* Type of host. For Cloud, this must be the machine type.
	*
	* @deprecated Use ATTR_HOST_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_TYPE = TMP_HOST_TYPE;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use ATTR_HOST_ARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_ARCH = TMP_HOST_ARCH;
	/**
	* Name of the VM image or OS install the host was instantiated from.
	*
	* @deprecated Use ATTR_HOST_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_NAME = TMP_HOST_IMAGE_NAME;
	/**
	* VM image ID. For Cloud, this value is from the provider.
	*
	* @deprecated Use ATTR_HOST_IMAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_ID = TMP_HOST_IMAGE_ID;
	/**
	* The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
	*
	* @deprecated Use ATTR_HOST_IMAGE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_VERSION = TMP_HOST_IMAGE_VERSION;
	/**
	* The name of the cluster.
	*
	* @deprecated Use ATTR_K8S_CLUSTER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CLUSTER_NAME = TMP_K8S_CLUSTER_NAME;
	/**
	* The name of the Node.
	*
	* @deprecated Use ATTR_K8S_NODE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NODE_NAME = TMP_K8S_NODE_NAME;
	/**
	* The UID of the Node.
	*
	* @deprecated Use ATTR_K8S_NODE_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NODE_UID = TMP_K8S_NODE_UID;
	/**
	* The name of the namespace that the pod is running in.
	*
	* @deprecated Use ATTR_K8S_NAMESPACE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NAMESPACE_NAME = TMP_K8S_NAMESPACE_NAME;
	/**
	* The UID of the Pod.
	*
	* @deprecated Use ATTR_K8S_POD_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_POD_UID = TMP_K8S_POD_UID;
	/**
	* The name of the Pod.
	*
	* @deprecated Use ATTR_K8S_POD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_POD_NAME = TMP_K8S_POD_NAME;
	/**
	* The name of the Container in a Pod template.
	*
	* @deprecated Use ATTR_K8S_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CONTAINER_NAME = TMP_K8S_CONTAINER_NAME;
	/**
	* The UID of the ReplicaSet.
	*
	* @deprecated Use ATTR_K8S_REPLICASET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_REPLICASET_UID = TMP_K8S_REPLICASET_UID;
	/**
	* The name of the ReplicaSet.
	*
	* @deprecated Use ATTR_K8S_REPLICASET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_REPLICASET_NAME = TMP_K8S_REPLICASET_NAME;
	/**
	* The UID of the Deployment.
	*
	* @deprecated Use ATTR_K8S_DEPLOYMENT_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = TMP_K8S_DEPLOYMENT_UID;
	/**
	* The name of the Deployment.
	*
	* @deprecated Use ATTR_K8S_DEPLOYMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = TMP_K8S_DEPLOYMENT_NAME;
	/**
	* The UID of the StatefulSet.
	*
	* @deprecated Use ATTR_K8S_STATEFULSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_STATEFULSET_UID = TMP_K8S_STATEFULSET_UID;
	/**
	* The name of the StatefulSet.
	*
	* @deprecated Use ATTR_K8S_STATEFULSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_STATEFULSET_NAME = TMP_K8S_STATEFULSET_NAME;
	/**
	* The UID of the DaemonSet.
	*
	* @deprecated Use ATTR_K8S_DAEMONSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DAEMONSET_UID = TMP_K8S_DAEMONSET_UID;
	/**
	* The name of the DaemonSet.
	*
	* @deprecated Use ATTR_K8S_DAEMONSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DAEMONSET_NAME = TMP_K8S_DAEMONSET_NAME;
	/**
	* The UID of the Job.
	*
	* @deprecated Use ATTR_K8S_JOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_JOB_UID = TMP_K8S_JOB_UID;
	/**
	* The name of the Job.
	*
	* @deprecated Use ATTR_K8S_JOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_JOB_NAME = TMP_K8S_JOB_NAME;
	/**
	* The UID of the CronJob.
	*
	* @deprecated Use ATTR_K8S_CRONJOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CRONJOB_UID = TMP_K8S_CRONJOB_UID;
	/**
	* The name of the CronJob.
	*
	* @deprecated Use ATTR_K8S_CRONJOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CRONJOB_NAME = TMP_K8S_CRONJOB_NAME;
	/**
	* The operating system type.
	*
	* @deprecated Use ATTR_OS_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_TYPE = TMP_OS_TYPE;
	/**
	* Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
	*
	* @deprecated Use ATTR_OS_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_DESCRIPTION = TMP_OS_DESCRIPTION;
	/**
	* Human readable operating system name.
	*
	* @deprecated Use ATTR_OS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_NAME = TMP_OS_NAME;
	/**
	* The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
	*
	* @deprecated Use ATTR_OS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_VERSION = TMP_OS_VERSION;
	/**
	* Process identifier (PID).
	*
	* @deprecated Use ATTR_PROCESS_PID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_PID = TMP_PROCESS_PID;
	/**
	* The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
	*
	* @deprecated Use ATTR_PROCESS_EXECUTABLE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = TMP_PROCESS_EXECUTABLE_NAME;
	/**
	* The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
	*
	* @deprecated Use ATTR_PROCESS_EXECUTABLE_PATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = TMP_PROCESS_EXECUTABLE_PATH;
	/**
	* The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND = TMP_PROCESS_COMMAND;
	/**
	* The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND_LINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND_LINE = TMP_PROCESS_COMMAND_LINE;
	/**
	* All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND_ARGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = TMP_PROCESS_COMMAND_ARGS;
	/**
	* The username of the user that owns the process.
	*
	* @deprecated Use ATTR_PROCESS_OWNER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_OWNER = TMP_PROCESS_OWNER;
	/**
	* The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
	/**
	* The version of the runtime of this process, as returned by the runtime without modification.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
	/**
	* An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = TMP_PROCESS_RUNTIME_DESCRIPTION;
	/**
	* Logical name of the service.
	*
	* Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
	*
	* @deprecated Use ATTR_SERVICE_NAME.
	*/
	exports.SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
	/**
	* A namespace for `service.name`.
	*
	* Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*
	* @deprecated Use ATTR_SERVICE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_SERVICE_NAMESPACE = TMP_SERVICE_NAMESPACE;
	/**
	* The string ID of the service instance.
	*
	* Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
	*
	* @deprecated Use ATTR_SERVICE_INSTANCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_SERVICE_INSTANCE_ID = TMP_SERVICE_INSTANCE_ID;
	/**
	* The version string of the service API or implementation.
	*
	* @deprecated Use ATTR_SERVICE_VERSION.
	*/
	exports.SEMRESATTRS_SERVICE_VERSION = TMP_SERVICE_VERSION;
	/**
	* The name of the telemetry SDK as defined above.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_NAME.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_LANGUAGE.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
	/**
	* The version string of the telemetry SDK.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_VERSION.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
	/**
	* The version string of the auto instrumentation agent, if used.
	*
	* @deprecated Use ATTR_TELEMETRY_DISTRO_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = TMP_TELEMETRY_AUTO_VERSION;
	/**
	* The name of the web engine.
	*
	* @deprecated Use ATTR_WEBENGINE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_NAME = TMP_WEBENGINE_NAME;
	/**
	* The version of the web engine.
	*
	* @deprecated Use ATTR_WEBENGINE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_VERSION = TMP_WEBENGINE_VERSION;
	/**
	* Additional description of the web engine (e.g. detailed version and edition information).
	*
	* @deprecated Use ATTR_WEBENGINE_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = TMP_WEBENGINE_DESCRIPTION;
	/**
	* Create exported Value Map for SemanticResourceAttributes values
	* @deprecated Use the SEMRESATTRS_XXXXX constants rather than the SemanticResourceAttributes.XXXXX for bundle minification
	*/
	exports.SemanticResourceAttributes = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUD_PROVIDER,
		TMP_CLOUD_ACCOUNT_ID,
		TMP_CLOUD_REGION,
		TMP_CLOUD_AVAILABILITY_ZONE,
		TMP_CLOUD_PLATFORM,
		TMP_AWS_ECS_CONTAINER_ARN,
		TMP_AWS_ECS_CLUSTER_ARN,
		TMP_AWS_ECS_LAUNCHTYPE,
		TMP_AWS_ECS_TASK_ARN,
		TMP_AWS_ECS_TASK_FAMILY,
		TMP_AWS_ECS_TASK_REVISION,
		TMP_AWS_EKS_CLUSTER_ARN,
		TMP_AWS_LOG_GROUP_NAMES,
		TMP_AWS_LOG_GROUP_ARNS,
		TMP_AWS_LOG_STREAM_NAMES,
		TMP_AWS_LOG_STREAM_ARNS,
		TMP_CONTAINER_NAME,
		TMP_CONTAINER_ID,
		TMP_CONTAINER_RUNTIME,
		TMP_CONTAINER_IMAGE_NAME,
		TMP_CONTAINER_IMAGE_TAG,
		TMP_DEPLOYMENT_ENVIRONMENT,
		TMP_DEVICE_ID,
		TMP_DEVICE_MODEL_IDENTIFIER,
		TMP_DEVICE_MODEL_NAME,
		TMP_FAAS_NAME,
		TMP_FAAS_ID,
		TMP_FAAS_VERSION,
		TMP_FAAS_INSTANCE,
		TMP_FAAS_MAX_MEMORY,
		TMP_HOST_ID,
		TMP_HOST_NAME,
		TMP_HOST_TYPE,
		TMP_HOST_ARCH,
		TMP_HOST_IMAGE_NAME,
		TMP_HOST_IMAGE_ID,
		TMP_HOST_IMAGE_VERSION,
		TMP_K8S_CLUSTER_NAME,
		TMP_K8S_NODE_NAME,
		TMP_K8S_NODE_UID,
		TMP_K8S_NAMESPACE_NAME,
		TMP_K8S_POD_UID,
		TMP_K8S_POD_NAME,
		TMP_K8S_CONTAINER_NAME,
		TMP_K8S_REPLICASET_UID,
		TMP_K8S_REPLICASET_NAME,
		TMP_K8S_DEPLOYMENT_UID,
		TMP_K8S_DEPLOYMENT_NAME,
		TMP_K8S_STATEFULSET_UID,
		TMP_K8S_STATEFULSET_NAME,
		TMP_K8S_DAEMONSET_UID,
		TMP_K8S_DAEMONSET_NAME,
		TMP_K8S_JOB_UID,
		TMP_K8S_JOB_NAME,
		TMP_K8S_CRONJOB_UID,
		TMP_K8S_CRONJOB_NAME,
		TMP_OS_TYPE,
		TMP_OS_DESCRIPTION,
		TMP_OS_NAME,
		TMP_OS_VERSION,
		TMP_PROCESS_PID,
		TMP_PROCESS_EXECUTABLE_NAME,
		TMP_PROCESS_EXECUTABLE_PATH,
		TMP_PROCESS_COMMAND,
		TMP_PROCESS_COMMAND_LINE,
		TMP_PROCESS_COMMAND_ARGS,
		TMP_PROCESS_OWNER,
		TMP_PROCESS_RUNTIME_NAME,
		TMP_PROCESS_RUNTIME_VERSION,
		TMP_PROCESS_RUNTIME_DESCRIPTION,
		TMP_SERVICE_NAME,
		TMP_SERVICE_NAMESPACE,
		TMP_SERVICE_INSTANCE_ID,
		TMP_SERVICE_VERSION,
		TMP_TELEMETRY_SDK_NAME,
		TMP_TELEMETRY_SDK_LANGUAGE,
		TMP_TELEMETRY_SDK_VERSION,
		TMP_TELEMETRY_AUTO_VERSION,
		TMP_WEBENGINE_NAME,
		TMP_WEBENGINE_VERSION,
		TMP_WEBENGINE_DESCRIPTION
	]);
	var TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	var TMP_CLOUDPROVIDERVALUES_AWS = "aws";
	var TMP_CLOUDPROVIDERVALUES_AZURE = "azure";
	var TMP_CLOUDPROVIDERVALUES_GCP = "gcp";
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_AWS = TMP_CLOUDPROVIDERVALUES_AWS;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_AZURE = TMP_CLOUDPROVIDERVALUES_AZURE;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_GCP = TMP_CLOUDPROVIDERVALUES_GCP;
	/**
	* The constant map of values for CloudProviderValues.
	* @deprecated Use the CLOUDPROVIDERVALUES_XXXXX constants rather than the CloudProviderValues.XXXXX for bundle minification.
	*/
	exports.CloudProviderValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_CLOUDPROVIDERVALUES_AWS,
		TMP_CLOUDPROVIDERVALUES_AZURE,
		TMP_CLOUDPROVIDERVALUES_GCP
	]);
	var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
	var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
	var TMP_CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
	var TMP_CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
	var TMP_CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
	var TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
	var TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
	var TMP_CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
	var TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
	var TMP_CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
	var TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
	var TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
	var TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
	var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
	var TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
	var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
	var TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_EC2 = TMP_CLOUDPLATFORMVALUES_AWS_EC2;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_ECS = TMP_CLOUDPLATFORMVALUES_AWS_ECS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_EKS = TMP_CLOUDPLATFORMVALUES_AWS_EKS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_LAMBDA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_VM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_VM = TMP_CLOUDPLATFORMVALUES_AZURE_VM;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_AKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_AKS = TMP_CLOUDPLATFORMVALUES_AZURE_AKS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE;
	/**
	* The constant map of values for CloudPlatformValues.
	* @deprecated Use the CLOUDPLATFORMVALUES_XXXXX constants rather than the CloudPlatformValues.XXXXX for bundle minification.
	*/
	exports.CloudPlatformValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
		TMP_CLOUDPLATFORMVALUES_AWS_EC2,
		TMP_CLOUDPLATFORMVALUES_AWS_ECS,
		TMP_CLOUDPLATFORMVALUES_AWS_EKS,
		TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA,
		TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
		TMP_CLOUDPLATFORMVALUES_AZURE_VM,
		TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
		TMP_CLOUDPLATFORMVALUES_AZURE_AKS,
		TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
		TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
		TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE
	]);
	var TMP_AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
	var TMP_AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.AWSECSLAUNCHTYPEVALUES_EC2 = TMP_AWSECSLAUNCHTYPEVALUES_EC2;
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_FARGATE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.AWSECSLAUNCHTYPEVALUES_FARGATE = TMP_AWSECSLAUNCHTYPEVALUES_FARGATE;
	/**
	* The constant map of values for AwsEcsLaunchtypeValues.
	* @deprecated Use the AWSECSLAUNCHTYPEVALUES_XXXXX constants rather than the AwsEcsLaunchtypeValues.XXXXX for bundle minification.
	*/
	exports.AwsEcsLaunchtypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_AWSECSLAUNCHTYPEVALUES_EC2, TMP_AWSECSLAUNCHTYPEVALUES_FARGATE]);
	var TMP_HOSTARCHVALUES_AMD64 = "amd64";
	var TMP_HOSTARCHVALUES_ARM32 = "arm32";
	var TMP_HOSTARCHVALUES_ARM64 = "arm64";
	var TMP_HOSTARCHVALUES_IA64 = "ia64";
	var TMP_HOSTARCHVALUES_PPC32 = "ppc32";
	var TMP_HOSTARCHVALUES_PPC64 = "ppc64";
	var TMP_HOSTARCHVALUES_X86 = "x86";
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_AMD64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_AMD64 = TMP_HOSTARCHVALUES_AMD64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_ARM32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_ARM32 = TMP_HOSTARCHVALUES_ARM32;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_ARM64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_ARM64 = TMP_HOSTARCHVALUES_ARM64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_IA64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_IA64 = TMP_HOSTARCHVALUES_IA64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_PPC32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_PPC32 = TMP_HOSTARCHVALUES_PPC32;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_PPC64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_PPC64 = TMP_HOSTARCHVALUES_PPC64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_X86 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_X86 = TMP_HOSTARCHVALUES_X86;
	/**
	* The constant map of values for HostArchValues.
	* @deprecated Use the HOSTARCHVALUES_XXXXX constants rather than the HostArchValues.XXXXX for bundle minification.
	*/
	exports.HostArchValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_HOSTARCHVALUES_AMD64,
		TMP_HOSTARCHVALUES_ARM32,
		TMP_HOSTARCHVALUES_ARM64,
		TMP_HOSTARCHVALUES_IA64,
		TMP_HOSTARCHVALUES_PPC32,
		TMP_HOSTARCHVALUES_PPC64,
		TMP_HOSTARCHVALUES_X86
	]);
	var TMP_OSTYPEVALUES_WINDOWS = "windows";
	var TMP_OSTYPEVALUES_LINUX = "linux";
	var TMP_OSTYPEVALUES_DARWIN = "darwin";
	var TMP_OSTYPEVALUES_FREEBSD = "freebsd";
	var TMP_OSTYPEVALUES_NETBSD = "netbsd";
	var TMP_OSTYPEVALUES_OPENBSD = "openbsd";
	var TMP_OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
	var TMP_OSTYPEVALUES_HPUX = "hpux";
	var TMP_OSTYPEVALUES_AIX = "aix";
	var TMP_OSTYPEVALUES_SOLARIS = "solaris";
	var TMP_OSTYPEVALUES_Z_OS = "z_os";
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_WINDOWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_WINDOWS = TMP_OSTYPEVALUES_WINDOWS;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_LINUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_LINUX = TMP_OSTYPEVALUES_LINUX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_DARWIN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_DARWIN = TMP_OSTYPEVALUES_DARWIN;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_FREEBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_FREEBSD = TMP_OSTYPEVALUES_FREEBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_NETBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_NETBSD = TMP_OSTYPEVALUES_NETBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_OPENBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_OPENBSD = TMP_OSTYPEVALUES_OPENBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_DRAGONFLYBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_DRAGONFLYBSD = TMP_OSTYPEVALUES_DRAGONFLYBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_HPUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_HPUX = TMP_OSTYPEVALUES_HPUX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_AIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_AIX = TMP_OSTYPEVALUES_AIX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_SOLARIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_SOLARIS = TMP_OSTYPEVALUES_SOLARIS;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_Z_OS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_Z_OS = TMP_OSTYPEVALUES_Z_OS;
	/**
	* The constant map of values for OsTypeValues.
	* @deprecated Use the OSTYPEVALUES_XXXXX constants rather than the OsTypeValues.XXXXX for bundle minification.
	*/
	exports.OsTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_OSTYPEVALUES_WINDOWS,
		TMP_OSTYPEVALUES_LINUX,
		TMP_OSTYPEVALUES_DARWIN,
		TMP_OSTYPEVALUES_FREEBSD,
		TMP_OSTYPEVALUES_NETBSD,
		TMP_OSTYPEVALUES_OPENBSD,
		TMP_OSTYPEVALUES_DRAGONFLYBSD,
		TMP_OSTYPEVALUES_HPUX,
		TMP_OSTYPEVALUES_AIX,
		TMP_OSTYPEVALUES_SOLARIS,
		TMP_OSTYPEVALUES_Z_OS
	]);
	var TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_CPP.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_CPP = TMP_TELEMETRYSDKLANGUAGEVALUES_CPP;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_GO.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_GO = TMP_TELEMETRYSDKLANGUAGEVALUES_GO;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_JAVA.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PHP.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_PHP = TMP_TELEMETRYSDKLANGUAGEVALUES_PHP;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_RUBY.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;
	/**
	* The constant map of values for TelemetrySdkLanguageValues.
	* @deprecated Use the TELEMETRYSDKLANGUAGEVALUES_XXXXX constants rather than the TelemetrySdkLanguageValues.XXXXX for bundle minification.
	*/
	exports.TelemetrySdkLanguageValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
		TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
		TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
		TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
		TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
		TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
		TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
	]);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/resource/index.js
var require_resource = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_SemanticResourceAttributes(), exports);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/stable_attributes.js
var require_stable_attributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = exports.ATTR_DOTNET_GC_HEAP_GENERATION = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = exports.DB_SYSTEM_NAME_VALUE_MYSQL = exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = exports.DB_SYSTEM_NAME_VALUE_MARIADB = exports.ATTR_DB_SYSTEM_NAME = exports.ATTR_DB_STORED_PROCEDURE_NAME = exports.ATTR_DB_RESPONSE_STATUS_CODE = exports.ATTR_DB_QUERY_TEXT = exports.ATTR_DB_QUERY_SUMMARY = exports.ATTR_DB_OPERATION_NAME = exports.ATTR_DB_OPERATION_BATCH_SIZE = exports.ATTR_DB_NAMESPACE = exports.ATTR_DB_COLLECTION_NAME = exports.ATTR_CONTAINER_IMAGE_TAGS = exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = exports.ATTR_CONTAINER_IMAGE_NAME = exports.ATTR_CONTAINER_ID = exports.ATTR_CODE_STACKTRACE = exports.ATTR_CODE_LINE_NUMBER = exports.ATTR_CODE_FUNCTION_NAME = exports.ATTR_CODE_FILE_PATH = exports.ATTR_CODE_COLUMN_NUMBER = exports.ATTR_CLIENT_PORT = exports.ATTR_CLIENT_ADDRESS = exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
	exports.ATTR_K8S_DAEMONSET_LABEL = exports.ATTR_K8S_DAEMONSET_ANNOTATION = exports.ATTR_K8S_CRONJOB_UID = exports.ATTR_K8S_CRONJOB_NAME = exports.ATTR_K8S_CRONJOB_LABEL = exports.ATTR_K8S_CRONJOB_ANNOTATION = exports.ATTR_K8S_CONTAINER_RESTART_COUNT = exports.ATTR_K8S_CONTAINER_NAME = exports.ATTR_K8S_CLUSTER_UID = exports.ATTR_K8S_CLUSTER_NAME = exports.JVM_THREAD_STATE_VALUE_WAITING = exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = exports.JVM_THREAD_STATE_VALUE_TERMINATED = exports.JVM_THREAD_STATE_VALUE_RUNNABLE = exports.JVM_THREAD_STATE_VALUE_NEW = exports.JVM_THREAD_STATE_VALUE_BLOCKED = exports.ATTR_JVM_THREAD_STATE = exports.ATTR_JVM_THREAD_DAEMON = exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = exports.JVM_MEMORY_TYPE_VALUE_HEAP = exports.ATTR_JVM_MEMORY_TYPE = exports.ATTR_JVM_MEMORY_POOL_NAME = exports.ATTR_JVM_GC_NAME = exports.ATTR_JVM_GC_ACTION = exports.ATTR_HTTP_ROUTE = exports.ATTR_HTTP_RESPONSE_STATUS_CODE = exports.ATTR_HTTP_RESPONSE_HEADER = exports.ATTR_HTTP_REQUEST_RESEND_COUNT = exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = exports.HTTP_REQUEST_METHOD_VALUE_TRACE = exports.HTTP_REQUEST_METHOD_VALUE_PUT = exports.HTTP_REQUEST_METHOD_VALUE_POST = exports.HTTP_REQUEST_METHOD_VALUE_PATCH = exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = exports.HTTP_REQUEST_METHOD_VALUE_HEAD = exports.HTTP_REQUEST_METHOD_VALUE_GET = exports.HTTP_REQUEST_METHOD_VALUE_DELETE = exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = exports.HTTP_REQUEST_METHOD_VALUE_OTHER = exports.ATTR_HTTP_REQUEST_METHOD = exports.ATTR_HTTP_REQUEST_HEADER = exports.ATTR_EXCEPTION_TYPE = exports.ATTR_EXCEPTION_STACKTRACE = exports.ATTR_EXCEPTION_MESSAGE = exports.ATTR_EXCEPTION_ESCAPED = exports.ERROR_TYPE_VALUE_OTHER = exports.ATTR_ERROR_TYPE = exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = void 0;
	exports.ATTR_OTEL_SCOPE_VERSION = exports.ATTR_OTEL_SCOPE_NAME = exports.ATTR_OTEL_EVENT_NAME = exports.NETWORK_TYPE_VALUE_IPV6 = exports.NETWORK_TYPE_VALUE_IPV4 = exports.ATTR_NETWORK_TYPE = exports.NETWORK_TRANSPORT_VALUE_UNIX = exports.NETWORK_TRANSPORT_VALUE_UDP = exports.NETWORK_TRANSPORT_VALUE_TCP = exports.NETWORK_TRANSPORT_VALUE_QUIC = exports.NETWORK_TRANSPORT_VALUE_PIPE = exports.ATTR_NETWORK_TRANSPORT = exports.ATTR_NETWORK_PROTOCOL_VERSION = exports.ATTR_NETWORK_PROTOCOL_NAME = exports.ATTR_NETWORK_PEER_PORT = exports.ATTR_NETWORK_PEER_ADDRESS = exports.ATTR_NETWORK_LOCAL_PORT = exports.ATTR_NETWORK_LOCAL_ADDRESS = exports.ATTR_K8S_STATEFULSET_UID = exports.ATTR_K8S_STATEFULSET_NAME = exports.ATTR_K8S_STATEFULSET_LABEL = exports.ATTR_K8S_STATEFULSET_ANNOTATION = exports.ATTR_K8S_REPLICASET_UID = exports.ATTR_K8S_REPLICASET_NAME = exports.ATTR_K8S_REPLICASET_LABEL = exports.ATTR_K8S_REPLICASET_ANNOTATION = exports.ATTR_K8S_POD_UID = exports.ATTR_K8S_POD_START_TIME = exports.ATTR_K8S_POD_NAME = exports.ATTR_K8S_POD_LABEL = exports.ATTR_K8S_POD_IP = exports.ATTR_K8S_POD_HOSTNAME = exports.ATTR_K8S_POD_ANNOTATION = exports.ATTR_K8S_NODE_UID = exports.ATTR_K8S_NODE_NAME = exports.ATTR_K8S_NODE_LABEL = exports.ATTR_K8S_NODE_ANNOTATION = exports.ATTR_K8S_NAMESPACE_NAME = exports.ATTR_K8S_NAMESPACE_LABEL = exports.ATTR_K8S_NAMESPACE_ANNOTATION = exports.ATTR_K8S_JOB_UID = exports.ATTR_K8S_JOB_NAME = exports.ATTR_K8S_JOB_LABEL = exports.ATTR_K8S_JOB_ANNOTATION = exports.ATTR_K8S_DEPLOYMENT_UID = exports.ATTR_K8S_DEPLOYMENT_NAME = exports.ATTR_K8S_DEPLOYMENT_LABEL = exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = exports.ATTR_K8S_DAEMONSET_UID = exports.ATTR_K8S_DAEMONSET_NAME = void 0;
	exports.ATTR_USER_AGENT_ORIGINAL = exports.ATTR_URL_SCHEME = exports.ATTR_URL_QUERY = exports.ATTR_URL_PATH = exports.ATTR_URL_FULL = exports.ATTR_URL_FRAGMENT = exports.ATTR_TELEMETRY_SDK_VERSION = exports.ATTR_TELEMETRY_SDK_NAME = exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN = exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = exports.ATTR_TELEMETRY_SDK_LANGUAGE = exports.ATTR_TELEMETRY_DISTRO_VERSION = exports.ATTR_TELEMETRY_DISTRO_NAME = exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = exports.ATTR_SIGNALR_TRANSPORT = exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = exports.ATTR_SIGNALR_CONNECTION_STATUS = exports.ATTR_SERVICE_VERSION = exports.ATTR_SERVICE_NAMESPACE = exports.ATTR_SERVICE_NAME = exports.ATTR_SERVICE_INSTANCE_ID = exports.ATTR_SERVER_PORT = exports.ATTR_SERVER_ADDRESS = exports.ATTR_OTEL_STATUS_DESCRIPTION = exports.OTEL_STATUS_CODE_VALUE_OK = exports.OTEL_STATUS_CODE_VALUE_ERROR = exports.ATTR_OTEL_STATUS_CODE = void 0;
	/**
	* ASP.NET Core exception middleware handling result.
	*
	* @example handled
	* @example unhandled
	*/
	exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
	/**
	* Enum value "aborted" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception handling didn't run because the request was aborted.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
	/**
	* Enum value "handled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception was handled by the exception handling middleware.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
	/**
	* Enum value "skipped" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception handling was skipped because the response had started.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
	/**
	* Enum value "unhandled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception was not handled by the exception handling middleware.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
	/**
	* Full type name of the [`IExceptionHandler`](https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.diagnostics.iexceptionhandler) implementation that handled the exception.
	*
	* @example Contoso.MyHandler
	*/
	exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
	/**
	* Rate limiting policy name.
	*
	* @example fixed
	* @example sliding
	* @example token
	*/
	exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
	/**
	* Rate-limiting result, shows whether the lease was acquired or contains a rejection reason
	*
	* @example acquired
	* @example request_canceled
	*/
	exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
	/**
	* Enum value "acquired" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease was acquired
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
	/**
	* Enum value "endpoint_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was rejected by the endpoint limiter
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
	/**
	* Enum value "global_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was rejected by the global limiter
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
	/**
	* Enum value "request_canceled" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was canceled
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
	/**
	* Flag indicating if request was handled by the application pipeline.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
	/**
	* A value that indicates whether the matched route is a fallback route.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
	/**
	* Match result - success or failure
	*
	* @example success
	* @example failure
	*/
	exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
	/**
	* Enum value "failure" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
	*
	* Match failed
	*/
	exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
	/**
	* Enum value "success" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
	*
	* Match succeeded
	*/
	exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
	/**
	* A value that indicates whether the user is authenticated.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
	/**
	* Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
	*
	* @example client.example.com
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*
	* @note When observed from the server side, and when communicating through an intermediary, `client.address` **SHOULD** represent the client address behind any intermediaries,  for example proxies, if it's available.
	*/
	exports.ATTR_CLIENT_ADDRESS = "client.address";
	/**
	* Client port number.
	*
	* @example 65123
	*
	* @note When observed from the server side, and when communicating through an intermediary, `client.port` **SHOULD** represent the client port behind any intermediaries,  for example proxies, if it's available.
	*/
	exports.ATTR_CLIENT_PORT = "client.port";
	/**
	* The column number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Line'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example 16
	*/
	exports.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path). This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Function'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example "/usr/local/MyApplication/content_root/app/index.php"
	*/
	exports.ATTR_CODE_FILE_PATH = "code.file.path";
	/**
	* The method or function fully-qualified name without arguments. The value should fit the natural representation of the language runtime, which is also likely the same used within `code.stacktrace` attribute value. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Function'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example com.example.MyHttpService.serveRequest
	* @example GuzzleHttp\\Client::transfer
	* @example fopen
	*
	* @note Values and format depends on each language runtime, thus it is impossible to provide an exhaustive list of examples.
	* The values are usually the same (or prefixes of) the ones found in native stack trace representation stored in
	* `code.stacktrace` without information on arguments.
	*
	* Examples:
	*
	*   - Java method: `com.example.MyHttpService.serveRequest`
	*   - Java anonymous class method: `com.mycompany.Main$1.myMethod`
	*   - Java lambda method: `com.mycompany.Main$$Lambda/0x0000748ae4149c00.myMethod`
	*   - PHP function: `GuzzleHttp\Client::transfer`
	*   - Go function: `github.com/my/repo/pkg.foo.func5`
	*   - Elixir: `OpenTelemetry.Ctx.new`
	*   - Erlang: `opentelemetry_ctx:new`
	*   - Rust: `playground::my_module::my_cool_func`
	*   - C function: `fopen`
	*/
	exports.ATTR_CODE_FUNCTION_NAME = "code.function.name";
	/**
	* The line number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Line'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example 42
	*/
	exports.ATTR_CODE_LINE_NUMBER = "code.line.number";
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is identical to [`exception.stacktrace`](/docs/exceptions/exceptions-spans.md#stacktrace-representation). This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Location'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example "at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
	*/
	exports.ATTR_CODE_STACKTRACE = "code.stacktrace";
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/containers/run/#container-identification). The UUID might be abbreviated.
	*
	* @example a3bf90e006b2
	*/
	exports.ATTR_CONTAINER_ID = "container.id";
	/**
	* Name of the image the container was built on.
	*
	* @example gcr.io/opentelemetry/operator
	*/
	exports.ATTR_CONTAINER_IMAGE_NAME = "container.image.name";
	/**
	* Repo digests of the container image as provided by the container runtime.
	*
	* @example ["example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb", "internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"]
	*
	* @note [Docker](https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Image/operation/ImageInspect) and [CRI](https://github.com/kubernetes/cri-api/blob/c75ef5b473bbe2d0a4fc92f82235efd665ea8e9f/pkg/apis/runtime/v1/api.proto#L1237-L1238) report those under the `RepoDigests` field.
	*/
	exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = "container.image.repo_digests";
	/**
	* Container image tags. An example can be found in [Docker Image Inspect](https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Image/operation/ImageInspect). Should be only the `<tag>` section of the full name for example from `registry.example.com/my-org/my-image:<tag>`.
	*
	* @example ["v1.27.1", "3.5.7-0"]
	*/
	exports.ATTR_CONTAINER_IMAGE_TAGS = "container.image.tags";
	/**
	* The name of a collection (table, container) within the database.
	*
	* @example public.users
	* @example customers
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* The collection name **SHOULD NOT** be extracted from `db.query.text`,
	* when the database system supports query text with multiple collections
	* in non-batch operations.
	*
	* For batch operations, if the individual operations are known to have the same
	* collection name then that collection name **SHOULD** be used.
	*/
	exports.ATTR_DB_COLLECTION_NAME = "db.collection.name";
	/**
	* The name of the database, fully qualified within the server address and port.
	*
	* @example customers
	* @example test.users
	*
	* @note If a database system has multiple namespace components, they **SHOULD** be concatenated from the most general to the most specific namespace component, using `|` as a separator between the components. Any missing components (and their associated separators) **SHOULD** be omitted.
	* Semantic conventions for individual database systems **SHOULD** document what `db.namespace` means in the context of that system.
	* It is **RECOMMENDED** to capture the value as provided by the application without attempting to do any case normalization.
	*/
	exports.ATTR_DB_NAMESPACE = "db.namespace";
	/**
	* The number of database operations included in a batch operation.
	*
	* @example 2
	* @example 3
	* @example 4
	*
	* @note Except for empty batch requests described below, a batch operation contains two
	* or more database operations explicitly submitted as separate operations in a single
	* client call, protocol message, or database command.
	*
	* Requests to batch APIs that contain only one operation **SHOULD** be modeled as single
	* operations, not as batch operations.
	*
	* A database call is not a batch operation solely because one operation accepts
	* multiple operands, such as keys, rows, documents, points, or other data elements,
	* including Redis [`MGET`](https://redis.io/docs/latest/commands/mget/) with
	* multiple keys.
	*
	* In batch APIs that execute the same parameterized operation with parameter sets,
	* each parameter set represents one database operation for determining whether the
	* request is a batch operation. Requests with only one parameter set **SHOULD** be modeled
	* as single operations, not as batch operations.
	*
	* `db.operation.batch.size` **SHOULD** be set to the number of operations in the batch.
	* It **SHOULD NOT** be set for non-batch operations.
	*
	* A request to execute a batch operation with no operations **SHOULD** also be treated
	* as a batch operation, and `db.operation.batch.size` **SHOULD** be set to `0`.
	*/
	exports.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
	/**
	* The name of the operation or command being executed.
	*
	* @example findAndModify
	* @example HMSET
	* @example SELECT
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* The operation name **SHOULD NOT** be extracted from `db.query.text`,
	* when the database system supports query text with multiple operations
	* in non-batch operations.
	*
	* If spaces can occur in the operation name, multiple consecutive spaces
	* **SHOULD** be normalized to a single space.
	*
	* For batch operations, if the individual operations are known to have the same operation name
	* then that operation name **SHOULD** be used prepended by `BATCH `,
	* otherwise `db.operation.name` **SHOULD** be `BATCH` or some other database
	* system specific term if more applicable.
	*/
	exports.ATTR_DB_OPERATION_NAME = "db.operation.name";
	/**
	* Low cardinality summary of a database query.
	*
	* @example SELECT wuser_table
	* @example INSERT shipping_details SELECT orders
	* @example get user by id
	*
	* @note The query summary describes a class of database queries and is useful
	* as a grouping key, especially when analyzing telemetry for database
	* calls involving complex queries.
	*
	* Summary may be available to the instrumentation through
	* instrumentation hooks or other means. If it is not available, instrumentations
	* that support query parsing **SHOULD** generate a summary following
	* [Generating query summary](/docs/db/database-spans.md#generating-a-summary-of-the-query)
	* section.
	*
	* For batch operations, if the individual operations are known to have the same query summary
	* then that query summary **SHOULD** be used prepended by `BATCH `,
	* otherwise `db.query.summary` **SHOULD** be `BATCH` or some other database
	* system specific term if more applicable.
	*/
	exports.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
	/**
	* The database query being executed.
	*
	* @example SELECT * FROM wuser_table where username = ?
	* @example SET mykey ?
	*
	* @note For sanitization see [Sanitization of `db.query.text`](/docs/db/database-spans.md#sanitization-of-dbquerytext).
	* For batch operations, if the individual operations are known to have the same query text then that query text **SHOULD** be used, otherwise all of the individual query texts **SHOULD** be concatenated with separator `; ` or some other database system specific separator if more applicable.
	* Parameterized query text **SHOULD NOT** be sanitized. Even though parameterized query text can potentially have sensitive data, by using a parameterized query the user is giving a strong signal that any sensitive data will be passed as parameter values, and the benefit to observability of capturing the static part of the query text by default outweighs the risk.
	*/
	exports.ATTR_DB_QUERY_TEXT = "db.query.text";
	/**
	* Database response status code.
	*
	* @example 102
	* @example ORA-17002
	* @example 08P01
	* @example 404
	*
	* @note The status code returned by the database. Usually it represents an error code, but may also represent partial success, warning, or differentiate between various types of successful outcomes.
	* Semantic conventions for individual database systems **SHOULD** document what `db.response.status_code` means in the context of that system.
	*/
	exports.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
	/**
	* The name of a stored procedure within the database.
	*
	* @example GetCustomer
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* For batch operations, if the individual operations are known to have the same
	* stored procedure name then that stored procedure name **SHOULD** be used.
	*/
	exports.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
	/**
	* The database management system (DBMS) product as identified by the client instrumentation.
	*
	* @note The actual DBMS may differ from the one identified by the client. For example, when using PostgreSQL client libraries to connect to a CockroachDB, the `db.system.name` is set to `postgresql` based on the instrumentation's best knowledge.
	*/
	exports.ATTR_DB_SYSTEM_NAME = "db.system.name";
	/**
	* Enum value "mariadb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [MariaDB](https://mariadb.org/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
	/**
	* Enum value "microsoft.sql_server" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [Microsoft SQL Server](https://www.microsoft.com/sql-server)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
	/**
	* Enum value "mysql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [MySQL](https://www.mysql.com/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
	/**
	* Enum value "postgresql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [PostgreSQL](https://www.postgresql.org/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
	/**
	* Name of the [deployment environment](https://wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*
	* @example staging
	* @example production
	*
	* @note `deployment.environment.name` does not affect the uniqueness constraints defined through
	* the `service.namespace`, `service.name` and `service.instance.id` resource attributes.
	* This implies that resources carrying the following attribute combinations **MUST** be
	* considered to be identifying the same service:
	*
	*   - `service.name=frontend`, `deployment.environment.name=production`
	*   - `service.name=frontend`, `deployment.environment.name=staging`.
	*/
	exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = "deployment.environment.name";
	/**
	* Enum value "development" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Development environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = "development";
	/**
	* Enum value "production" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Production environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = "production";
	/**
	* Enum value "staging" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Staging environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = "staging";
	/**
	* Enum value "test" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Testing environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = "test";
	/**
	* Name of the garbage collector managed heap generation.
	*
	* @example gen0
	* @example gen1
	* @example gen2
	*/
	exports.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
	/**
	* Enum value "gen0" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 0
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
	/**
	* Enum value "gen1" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 1
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
	/**
	* Enum value "gen2" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 2
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
	/**
	* Enum value "loh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Large Object Heap
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
	/**
	* Enum value "poh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Pinned Object Heap
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
	/**
	* Describes a class of error the operation ended with.
	*
	* @example timeout
	* @example java.net.UnknownHostException
	* @example server_certificate_invalid
	* @example 500
	*
	* @note The `error.type` **SHOULD** be predictable, and **SHOULD** have low cardinality.
	*
	* When `error.type` is set to a type (e.g., an exception type), its
	* canonical class name identifying the type within the artifact **SHOULD** be used.
	*
	* If the recorded error type is a wrapper that is not meaningful for
	* failure classification, instrumentation **MAY** use the type of the inner
	* error instead. For example, in Go, errors created with `fmt.Errorf`
	* using `%w` **MAY** be unwrapped when the wrapper type does not help
	* classify the failure.
	*
	* Instrumentations **SHOULD** document the list of errors they report.
	*
	* The cardinality of `error.type` within one instrumentation library **SHOULD** be low.
	* Telemetry consumers that aggregate data from multiple instrumentation libraries and applications
	* should be prepared for `error.type` to have high cardinality at query time when no
	* additional filters are applied.
	*
	* If the operation has completed successfully, instrumentations **SHOULD NOT** set `error.type`.
	*
	* If a specific domain defines its own set of error identifiers (such as HTTP or RPC status codes),
	* it's **RECOMMENDED** to:
	*
	*   - Use a domain-specific attribute
	*   - Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
	*/
	exports.ATTR_ERROR_TYPE = "error.type";
	/**
	* Enum value "_OTHER" for attribute {@link ATTR_ERROR_TYPE}.
	*
	* A fallback error value to be used when the instrumentation doesn't define a custom value.
	*/
	exports.ERROR_TYPE_VALUE_OTHER = "_OTHER";
	/**
	* Indicates that the exception is escaping the scope of the span.
	*
	* @deprecated It's no longer recommended to record exceptions that are handled and do not escape the scope of a span.
	*/
	exports.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
	/**
	* The exception message.
	*
	* @example Division by zero
	* @example Can't convert 'int' object to str implicitly
	*
	* @note > [!WARNING]
	*
	* > This attribute may contain sensitive information.
	*/
	exports.ATTR_EXCEPTION_MESSAGE = "exception.message";
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*
	* @example "Exception in thread "main" java.lang.RuntimeException: Test exception\\n at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
	*/
	exports.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*
	* @example java.net.ConnectException
	* @example OSError
	*
	* @note If the recorded exception type is a wrapper that is not meaningful for
	* failure classification, instrumentation **MAY** use the type of the inner
	* exception instead. For example, in Go, errors created with `fmt.Errorf`
	* using `%w` **MAY** be unwrapped when the wrapper type does not help
	* classify the failure.
	*/
	exports.ATTR_EXCEPTION_TYPE = "exception.type";
	/**
	* HTTP request headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
	*
	* @example ["application/json"]
	* @example ["1.2.3.4", "1.2.3.5"]
	*
	* @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured.
	* Including all request headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
	*
	* The `User-Agent` header is already captured in the `user_agent.original` attribute.
	* Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
	*
	* The attribute value **MUST** consist of either multiple header values as an array of strings
	* or a single-item array containing a possibly comma-concatenated string, depending on the way
	* the HTTP library provides access to headers.
	*
	* Examples:
	*
	*   - A header `Content-Type: application/json` **SHOULD** be recorded as the `http.request.header.content-type`
	*     attribute with value `["application/json"]`.
	*   - A header `X-Forwarded-For: 1.2.3.4, 1.2.3.5` **SHOULD** be recorded as the `http.request.header.x-forwarded-for`
	*     attribute with value `["1.2.3.4", "1.2.3.5"]` or `["1.2.3.4, 1.2.3.5"]` depending on the HTTP library.
	*/
	var ATTR_HTTP_REQUEST_HEADER = (key) => `http.request.header.${key}`;
	exports.ATTR_HTTP_REQUEST_HEADER = ATTR_HTTP_REQUEST_HEADER;
	/**
	* HTTP request method.
	*
	* @example GET
	* @example POST
	* @example HEAD
	*
	* @note HTTP request method value **SHOULD** be "known" to the instrumentation.
	* By default, this convention defines "known" methods as the ones listed in [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods),
	* the PATCH method defined in [RFC5789](https://www.rfc-editor.org/rfc/rfc5789.html)
	* and the QUERY method defined in [httpbis-safe-method-w-body](https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/?include_text=1).
	*
	* If the HTTP request method is not known to instrumentation, it **MUST** set the `http.request.method` attribute to `_OTHER`.
	*
	* If the HTTP instrumentation could end up converting valid HTTP request methods to `_OTHER`, then it **MUST** provide a way to override
	* the list of known HTTP methods. If this override is done via environment variable, then the environment variable **MUST** be named
	* OTEL_INSTRUMENTATION_HTTP_KNOWN_METHODS and support a comma-separated list of case-sensitive known HTTP methods.
	*
	*
	* If this override is done via declarative configuration, then the list **MUST** be configurable via the `known_methods` property
	* (an array of case-sensitive strings with minimum items 0) under `.instrumentation/development.general.http.client` and/or
	* `.instrumentation/development.general.http.server`.
	*
	* In either case, this list **MUST** be a full override of the default known methods,
	* it is not a list of known methods in addition to the defaults.
	*
	* HTTP method names are case-sensitive and `http.request.method` attribute value **MUST** match a known HTTP method name exactly.
	* Instrumentations for specific web frameworks that consider HTTP methods to be case insensitive, **SHOULD** populate a canonical equivalent.
	* Tracing instrumentations that do so, **MUST** also set `http.request.method_original` to the original value.
	*/
	exports.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
	/**
	* Enum value "_OTHER" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* Any HTTP method that the instrumentation has no prior knowledge of.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
	/**
	* Enum value "CONNECT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* CONNECT method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
	/**
	* Enum value "DELETE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* DELETE method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
	/**
	* Enum value "GET" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* GET method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
	/**
	* Enum value "HEAD" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* HEAD method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
	/**
	* Enum value "OPTIONS" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* OPTIONS method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
	/**
	* Enum value "PATCH" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* PATCH method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
	/**
	* Enum value "POST" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* POST method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
	/**
	* Enum value "PUT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* PUT method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
	/**
	* Enum value "TRACE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* TRACE method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
	/**
	* Original HTTP method sent by the client in the request line.
	*
	* @example GeT
	* @example ACL
	* @example foo
	*/
	exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
	/**
	* The ordinal number of request resending attempt (for any reason, including redirects).
	*
	* @example 3
	*
	* @note The resend count **SHOULD** be updated each time an HTTP request gets resent by the client, regardless of what was the cause of the resending (e.g. redirection, authorization failure, 503 Server Unavailable, network issues, or any other).
	*/
	exports.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
	/**
	* HTTP response headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
	*
	* @example ["application/json"]
	* @example ["abc", "def"]
	*
	* @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured.
	* Including all response headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
	*
	* Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
	*
	* The attribute value **MUST** consist of either multiple header values as an array of strings
	* or a single-item array containing a possibly comma-concatenated string, depending on the way
	* the HTTP library provides access to headers.
	*
	* Examples:
	*
	*   - A header `Content-Type: application/json` header **SHOULD** be recorded as the `http.request.response.content-type`
	*     attribute with value `["application/json"]`.
	*   - A header `My-custom-header: abc, def` header **SHOULD** be recorded as the `http.response.header.my-custom-header`
	*     attribute with value `["abc", "def"]` or `["abc, def"]` depending on the HTTP library.
	*/
	var ATTR_HTTP_RESPONSE_HEADER = (key) => `http.response.header.${key}`;
	exports.ATTR_HTTP_RESPONSE_HEADER = ATTR_HTTP_RESPONSE_HEADER;
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*
	* @example 200
	*/
	exports.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
	/**
	* The matched route template for the request. This **MUST** be low-cardinality and include all static path segments, with dynamic path segments represented with placeholders.
	*
	* @example /users/:userID?
	* @example my-controller/my-action/{id?}
	*
	* @note **MUST NOT** be populated when this is not supported by the HTTP server framework as the route attribute should have low-cardinality and the URI path can NOT substitute it.
	* **SHOULD** include the [application root](/docs/http/http-spans.md#http-server-definitions) if there is one.
	*
	* A static path segment is a part of the route template with a fixed, low-cardinality value. This includes literal strings like `/users/` and placeholders that
	* are constrained to a finite, predefined set of values, e.g. `{controller}` or `{action}`.
	*
	* A dynamic path segment is a placeholder for a value that can have high cardinality and is not constrained to a predefined list like static path segments.
	*
	* Instrumentations **SHOULD** use routing information provided by the corresponding web framework. They **SHOULD** pick the most precise source of routing information and **MAY**
	* support custom route formatting. Instrumentations **SHOULD** document the format and the API used to obtain the route string.
	*/
	exports.ATTR_HTTP_ROUTE = "http.route";
	/**
	* Name of the garbage collector action.
	*
	* @example end of minor GC
	* @example end of major GC
	*
	* @note Garbage collector action is generally obtained via [GarbageCollectionNotificationInfo#getGcAction()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcAction()).
	*/
	exports.ATTR_JVM_GC_ACTION = "jvm.gc.action";
	/**
	* Name of the garbage collector.
	*
	* @example G1 Young Generation
	* @example G1 Old Generation
	*
	* @note Garbage collector name is generally obtained via [GarbageCollectionNotificationInfo#getGcName()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcName()).
	*/
	exports.ATTR_JVM_GC_NAME = "jvm.gc.name";
	/**
	* Name of the memory pool.
	*
	* @example G1 Old Gen
	* @example G1 Eden space
	* @example G1 Survivor Space
	*
	* @note Pool names are generally obtained via [MemoryPoolMXBean#getName()](https://docs.oracle.com/en/java/javase/11/docs/api/java.management/java/lang/management/MemoryPoolMXBean.html#getName()).
	*/
	exports.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
	/**
	* The type of memory.
	*
	* @example heap
	* @example non_heap
	*/
	exports.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
	/**
	* Enum value "heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
	*
	* Heap memory.
	*/
	exports.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
	/**
	* Enum value "non_heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
	*
	* Non-heap memory
	*/
	exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
	/**
	* Whether the thread is daemon or not.
	*/
	exports.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
	/**
	* State of the thread.
	*
	* @example runnable
	* @example blocked
	*/
	exports.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
	/**
	* Enum value "blocked" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is blocked waiting for a monitor lock is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
	/**
	* Enum value "new" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that has not yet started is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_NEW = "new";
	/**
	* Enum value "runnable" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread executing in the Java virtual machine is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
	/**
	* Enum value "terminated" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that has exited is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
	/**
	* Enum value "timed_waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
	/**
	* Enum value "waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is waiting indefinitely for another thread to perform a particular action is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
	/**
	* The name of the cluster.
	*
	* @example opentelemetry-cluster
	*/
	exports.ATTR_K8S_CLUSTER_NAME = "k8s.cluster.name";
	/**
	* A pseudo-ID for the cluster, set to the UID of the `kube-system` namespace.
	*
	* @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
	*
	* @note K8s doesn't have support for obtaining a cluster ID. If this is ever
	* added, we will recommend collecting the `k8s.cluster.uid` through the
	* official APIs. In the meantime, we are able to use the `uid` of the
	* `kube-system` namespace as a proxy for cluster ID. Read on for the
	* rationale.
	*
	* Every object created in a K8s cluster is assigned a distinct UID. The
	* `kube-system` namespace is used by Kubernetes itself and will exist
	* for the lifetime of the cluster. Using the `uid` of the `kube-system`
	* namespace is a reasonable proxy for the K8s ClusterID as it will only
	* change if the cluster is rebuilt. Furthermore, Kubernetes UIDs are
	* UUIDs as standardized by
	* [ISO/IEC 9834-8 and ITU-T X.667](https://www.itu.int/ITU-T/studygroups/com17/oid.html).
	* Which states:
	*
	* > If generated according to one of the mechanisms defined in Rec.
	* > ITU-T X.667 | ISO/IEC 9834-8, a UUID is either guaranteed to be
	* > different from all other UUIDs generated before 3603 A.D., or is
	* > extremely likely to be different (depending on the mechanism chosen).
	*
	* Therefore, UIDs between clusters should be extremely unlikely to
	* conflict.
	*/
	exports.ATTR_K8S_CLUSTER_UID = "k8s.cluster.uid";
	/**
	* The name of the Container from Pod specification, must be unique within a Pod. Container runtime usually uses different globally unique name (`container.name`).
	*
	* @example redis
	*/
	exports.ATTR_K8S_CONTAINER_NAME = "k8s.container.name";
	/**
	* Number of times the container was restarted. This attribute can be used to identify a particular container (running or stopped) within a container spec.
	*/
	exports.ATTR_K8S_CONTAINER_RESTART_COUNT = "k8s.container.restart_count";
	/**
	* The cronjob annotation placed on the CronJob, the `<key>` being the annotation name, the value being the annotation value.
	*
	* @example 4
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `retries` with value `4` **SHOULD** be recorded as the
	*     `k8s.cronjob.annotation.retries` attribute with value `"4"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.cronjob.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_CRONJOB_ANNOTATION = (key) => `k8s.cronjob.annotation.${key}`;
	exports.ATTR_K8S_CRONJOB_ANNOTATION = ATTR_K8S_CRONJOB_ANNOTATION;
	/**
	* The label placed on the CronJob, the `<key>` being the label name, the value being the label value.
	*
	* @example weekly
	* @example
	*
	* @note Examples:
	*
	*   - A label `type` with value `weekly` **SHOULD** be recorded as the
	*     `k8s.cronjob.label.type` attribute with value `"weekly"`.
	*   - A label `automated` with empty string value **SHOULD** be recorded as
	*     the `k8s.cronjob.label.automated` attribute with value `""`.
	*/
	var ATTR_K8S_CRONJOB_LABEL = (key) => `k8s.cronjob.label.${key}`;
	exports.ATTR_K8S_CRONJOB_LABEL = ATTR_K8S_CRONJOB_LABEL;
	/**
	* The name of the CronJob.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	/**
	* The UID of the CronJob.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	/**
	* The annotation placed on the DaemonSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.daemonset.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.daemonset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_DAEMONSET_ANNOTATION = (key) => `k8s.daemonset.annotation.${key}`;
	exports.ATTR_K8S_DAEMONSET_ANNOTATION = ATTR_K8S_DAEMONSET_ANNOTATION;
	/**
	* The label placed on the DaemonSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.daemonset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.daemonset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_DAEMONSET_LABEL = (key) => `k8s.daemonset.label.${key}`;
	exports.ATTR_K8S_DAEMONSET_LABEL = ATTR_K8S_DAEMONSET_LABEL;
	/**
	* The name of the DaemonSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	/**
	* The UID of the DaemonSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	/**
	* The annotation placed on the Deployment, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.deployment.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.deployment.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_DEPLOYMENT_ANNOTATION = (key) => `k8s.deployment.annotation.${key}`;
	exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = ATTR_K8S_DEPLOYMENT_ANNOTATION;
	/**
	* The label placed on the Deployment, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.deployment.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.deployment.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_DEPLOYMENT_LABEL = (key) => `k8s.deployment.label.${key}`;
	exports.ATTR_K8S_DEPLOYMENT_LABEL = ATTR_K8S_DEPLOYMENT_LABEL;
	/**
	* The name of the Deployment.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	/**
	* The UID of the Deployment.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	/**
	* The annotation placed on the Job, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `number` with value `1` **SHOULD** be recorded
	*     as the `k8s.job.annotation.number` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.job.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_JOB_ANNOTATION = (key) => `k8s.job.annotation.${key}`;
	exports.ATTR_K8S_JOB_ANNOTATION = ATTR_K8S_JOB_ANNOTATION;
	/**
	* The label placed on the Job, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example ci
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `jobtype` with value `ci` **SHOULD** be recorded
	*     as the `k8s.job.label.jobtype` attribute with value `"ci"`.
	*   - A label `automated` with empty string value **SHOULD** be recorded as
	*     the `k8s.job.label.automated` attribute with value `""`.
	*/
	var ATTR_K8S_JOB_LABEL = (key) => `k8s.job.label.${key}`;
	exports.ATTR_K8S_JOB_LABEL = ATTR_K8S_JOB_LABEL;
	/**
	* The name of the Job.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_JOB_NAME = "k8s.job.name";
	/**
	* The UID of the Job.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_JOB_UID = "k8s.job.uid";
	/**
	* The annotation placed on the Namespace, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `ttl` with value `0` **SHOULD** be recorded
	*     as the `k8s.namespace.annotation.ttl` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.namespace.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_NAMESPACE_ANNOTATION = (key) => `k8s.namespace.annotation.${key}`;
	exports.ATTR_K8S_NAMESPACE_ANNOTATION = ATTR_K8S_NAMESPACE_ANNOTATION;
	/**
	* The label placed on the Namespace, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example default
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `kubernetes.io/metadata.name` with value `default` **SHOULD** be recorded
	*     as the `k8s.namespace.label.kubernetes.io/metadata.name` attribute with value `"default"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.namespace.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_NAMESPACE_LABEL = (key) => `k8s.namespace.label.${key}`;
	exports.ATTR_K8S_NAMESPACE_LABEL = ATTR_K8S_NAMESPACE_LABEL;
	/**
	* The name of the namespace that the pod is running in.
	*
	* @example default
	*/
	exports.ATTR_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	/**
	* The annotation placed on the Node, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `node.alpha.kubernetes.io/ttl` with value `0` **SHOULD** be recorded as
	*     the `k8s.node.annotation.node.alpha.kubernetes.io/ttl` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.node.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_NODE_ANNOTATION = (key) => `k8s.node.annotation.${key}`;
	exports.ATTR_K8S_NODE_ANNOTATION = ATTR_K8S_NODE_ANNOTATION;
	/**
	* The label placed on the Node, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example arm64
	* @example
	*
	* @note Examples:
	*
	*   - A label `kubernetes.io/arch` with value `arm64` **SHOULD** be recorded
	*     as the `k8s.node.label.kubernetes.io/arch` attribute with value `"arm64"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.node.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_NODE_LABEL = (key) => `k8s.node.label.${key}`;
	exports.ATTR_K8S_NODE_LABEL = ATTR_K8S_NODE_LABEL;
	/**
	* The name of the Node.
	*
	* @example node-1
	*/
	exports.ATTR_K8S_NODE_NAME = "k8s.node.name";
	/**
	* The UID of the Node.
	*
	* @example 1eb3a0c6-0477-4080-a9cb-0cb7db65c6a2
	*/
	exports.ATTR_K8S_NODE_UID = "k8s.node.uid";
	/**
	* The annotation placed on the Pod, the `<key>` being the annotation name, the value being the annotation value.
	*
	* @example true
	* @example x64
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `kubernetes.io/enforce-mountable-secrets` with value `true` **SHOULD** be recorded as
	*     the `k8s.pod.annotation.kubernetes.io/enforce-mountable-secrets` attribute with value `"true"`.
	*   - An annotation `mycompany.io/arch` with value `x64` **SHOULD** be recorded as
	*     the `k8s.pod.annotation.mycompany.io/arch` attribute with value `"x64"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.pod.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_POD_ANNOTATION = (key) => `k8s.pod.annotation.${key}`;
	exports.ATTR_K8S_POD_ANNOTATION = ATTR_K8S_POD_ANNOTATION;
	/**
	* Specifies the hostname of the Pod.
	*
	* @example collector-gateway
	*
	* @note The K8s Pod spec has an optional hostname field, which can be used to specify a hostname.
	* Refer to [K8s docs](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field)
	* for more information about this field.
	*
	* This attribute aligns with the `hostname` field of the
	* [K8s PodSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podspec-v1-core).
	*/
	exports.ATTR_K8S_POD_HOSTNAME = "k8s.pod.hostname";
	/**
	* IP address allocated to the Pod.
	*
	* @example 172.18.0.2
	*
	* @note This attribute aligns with the `podIP` field of the
	* [K8s PodStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podstatus-v1-core).
	*/
	exports.ATTR_K8S_POD_IP = "k8s.pod.ip";
	/**
	* The label placed on the Pod, the `<key>` being the label name, the value being the label value.
	*
	* @example my-app
	* @example x64
	* @example
	*
	* @note Examples:
	*
	*   - A label `app` with value `my-app` **SHOULD** be recorded as
	*     the `k8s.pod.label.app` attribute with value `"my-app"`.
	*   - A label `mycompany.io/arch` with value `x64` **SHOULD** be recorded as
	*     the `k8s.pod.label.mycompany.io/arch` attribute with value `"x64"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.pod.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_POD_LABEL = (key) => `k8s.pod.label.${key}`;
	exports.ATTR_K8S_POD_LABEL = ATTR_K8S_POD_LABEL;
	/**
	* The name of the Pod.
	*
	* @example opentelemetry-pod-autoconf
	*/
	exports.ATTR_K8S_POD_NAME = "k8s.pod.name";
	/**
	* The start timestamp of the Pod.
	*
	* @example 2025-12-04T08:41:03Z
	*
	* @note Date and time at which the object was acknowledged by the Kubelet.
	* This is before the Kubelet pulled the container image(s) for the pod.
	*
	* This attribute aligns with the `startTime` field of the
	* [K8s PodStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podstatus-v1-core),
	* in ISO 8601 (RFC 3339 compatible) format.
	*/
	exports.ATTR_K8S_POD_START_TIME = "k8s.pod.start_time";
	/**
	* The UID of the Pod.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_POD_UID = "k8s.pod.uid";
	/**
	* The annotation placed on the ReplicaSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `0` **SHOULD** be recorded
	*     as the `k8s.replicaset.annotation.replicas` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.replicaset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_REPLICASET_ANNOTATION = (key) => `k8s.replicaset.annotation.${key}`;
	exports.ATTR_K8S_REPLICASET_ANNOTATION = ATTR_K8S_REPLICASET_ANNOTATION;
	/**
	* The label placed on the ReplicaSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.replicaset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.replicaset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_REPLICASET_LABEL = (key) => `k8s.replicaset.label.${key}`;
	exports.ATTR_K8S_REPLICASET_LABEL = ATTR_K8S_REPLICASET_LABEL;
	/**
	* The name of the ReplicaSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	/**
	* The UID of the ReplicaSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	/**
	* The annotation placed on the StatefulSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.statefulset.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.statefulset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_STATEFULSET_ANNOTATION = (key) => `k8s.statefulset.annotation.${key}`;
	exports.ATTR_K8S_STATEFULSET_ANNOTATION = ATTR_K8S_STATEFULSET_ANNOTATION;
	/**
	* The label placed on the StatefulSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.statefulset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.statefulset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_STATEFULSET_LABEL = (key) => `k8s.statefulset.label.${key}`;
	exports.ATTR_K8S_STATEFULSET_LABEL = ATTR_K8S_STATEFULSET_LABEL;
	/**
	* The name of the StatefulSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	/**
	* The UID of the StatefulSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	/**
	* Local address of the network connection - IP address or Unix domain socket name.
	*
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*/
	exports.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
	/**
	* Local port number of the network connection.
	*
	* @example 65123
	*/
	exports.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
	/**
	* Peer address of the network connection - IP address or Unix domain socket name.
	*
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*/
	exports.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
	/**
	* Peer port number of the network connection.
	*
	* @example 65123
	*/
	exports.ATTR_NETWORK_PEER_PORT = "network.peer.port";
	/**
	* [OSI application layer](https://wikipedia.org/wiki/Application_layer) or non-OSI equivalent.
	*
	* @example amqp
	* @example http
	* @example mqtt
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*/
	exports.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
	/**
	* The actual version of the protocol used for network communication.
	*
	* @example 1.1
	* @example 2
	*
	* @note If protocol version is subject to negotiation (for example using [ALPN](https://www.rfc-editor.org/rfc/rfc7301.html)), this attribute **SHOULD** be set to the negotiated version. If the actual protocol version is not known, this attribute **SHOULD NOT** be set.
	*/
	exports.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
	/**
	* [OSI transport layer](https://wikipedia.org/wiki/Transport_layer) or [inter-process communication method](https://wikipedia.org/wiki/Inter-process_communication).
	*
	* @example tcp
	* @example udp
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*
	* Consider always setting the transport when setting a port number, since
	* a port number is ambiguous without knowing the transport. For example
	* different processes could be listening on TCP port 12345 and UDP port 12345.
	*/
	exports.ATTR_NETWORK_TRANSPORT = "network.transport";
	/**
	* Enum value "pipe" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* Named or anonymous pipe.
	*/
	exports.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
	/**
	* Enum value "quic" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* QUIC
	*/
	exports.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
	/**
	* Enum value "tcp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* TCP
	*/
	exports.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
	/**
	* Enum value "udp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* UDP
	*/
	exports.NETWORK_TRANSPORT_VALUE_UDP = "udp";
	/**
	* Enum value "unix" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* Unix domain socket
	*/
	exports.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
	/**
	* [OSI network layer](https://wikipedia.org/wiki/Network_layer) or non-OSI equivalent.
	*
	* @example ipv4
	* @example ipv6
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*/
	exports.ATTR_NETWORK_TYPE = "network.type";
	/**
	* Enum value "ipv4" for attribute {@link ATTR_NETWORK_TYPE}.
	*
	* IPv4
	*/
	exports.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
	/**
	* Enum value "ipv6" for attribute {@link ATTR_NETWORK_TYPE}.
	*
	* IPv6
	*/
	exports.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
	/**
	* Identifies the class / type of event.
	*
	* @example browser.mouse.click
	* @example device.app.lifecycle
	*
	* @note This attribute **SHOULD** be used by non-OTLP exporters when destination does not support `EventName` or equivalent field. This attribute **MAY** be used by applications using existing logging libraries so that it can be used to set the `EventName` field by Collector or SDK components.
	*/
	exports.ATTR_OTEL_EVENT_NAME = "otel.event.name";
	/**
	* The name of the instrumentation scope - (`InstrumentationScope.Name` in OTLP).
	*
	* @example io.opentelemetry.contrib.mongodb
	*/
	exports.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
	/**
	* The version of the instrumentation scope - (`InstrumentationScope.Version` in OTLP).
	*
	* @example 1.0.0
	*/
	exports.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
	/**
	* Name of the code, either "OK" or "ERROR". **MUST NOT** be set if the status code is UNSET.
	*/
	exports.ATTR_OTEL_STATUS_CODE = "otel.status_code";
	/**
	* Enum value "ERROR" for attribute {@link ATTR_OTEL_STATUS_CODE}.
	*
	* The operation contains an error.
	*/
	exports.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
	/**
	* Enum value "OK" for attribute {@link ATTR_OTEL_STATUS_CODE}.
	*
	* The operation has been validated by an Application developer or Operator to have completed successfully.
	*/
	exports.OTEL_STATUS_CODE_VALUE_OK = "OK";
	/**
	* Description of the Status if it has a value, otherwise not set.
	*
	* @example resource not found
	*/
	exports.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
	/**
	* Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
	*
	* @example example.com
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*
	* @note When observed from the client side, and when communicating through an intermediary, `server.address` **SHOULD** represent the server address behind any intermediaries, for example proxies, if it's available.
	*/
	exports.ATTR_SERVER_ADDRESS = "server.address";
	/**
	* Server port number.
	*
	* @example 80
	* @example 8080
	* @example 443
	*
	* @note When observed from the client side, and when communicating through an intermediary, `server.port` **SHOULD** represent the server port behind any intermediaries, for example proxies, if it's available.
	*/
	exports.ATTR_SERVER_PORT = "server.port";
	/**
	* The string ID of the service instance.
	*
	* @example 627cc493-f310-47de-96bd-71410b7dec09
	*
	* @note **MUST** be unique for each instance of the same `service.namespace,service.name` pair (in other words
	* `service.namespace,service.name,service.instance.id` triplet **MUST** be globally unique). The ID helps to
	* distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled
	* service).
	*
	* Implementations, such as SDKs, are recommended to generate a random Version 1 or Version 4 [RFC
	* 4122](https://www.ietf.org/rfc/rfc4122.txt) UUID, but are free to use an inherent unique ID as the source of
	* this value if stability is desirable. In that case, the ID **SHOULD** be used as source of a UUID Version 5 and
	* **SHOULD** use the following UUID as the namespace: `4d63009a-8d0f-11ee-aad7-4c796ed8e320`.
	*
	* UUIDs are typically recommended, as only an opaque value for the purposes of identifying a service instance is
	* needed. Similar to what can be seen in the man page for the
	* [`/etc/machine-id`](https://www.freedesktop.org/software/systemd/man/latest/machine-id.html) file, the underlying
	* data, such as pod name and namespace should be treated as confidential, being the user's choice to expose it
	* or not via another resource attribute.
	*
	* For applications running behind an application server (like unicorn), we do not recommend using one identifier
	* for all processes participating in the application. Instead, it's recommended each division (e.g. a worker
	* thread in unicorn) to have its own instance.id.
	*
	* It's not recommended for a Collector to set `service.instance.id` if it can't unambiguously determine the
	* service instance that is generating that telemetry. For instance, creating an UUID based on `pod.name` will
	* likely be wrong, as the Collector might not know from which container within that pod the telemetry originated.
	* However, Collectors can set the `service.instance.id` if they can unambiguously determine the service instance
	* for that telemetry. This is typically the case for scraping receivers, as they know the target address and
	* port.
	*/
	exports.ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
	/**
	* Logical name of the service.
	*
	* @example shoppingcart
	*
	* @note **MUST** be the same for all instances of horizontally scaled services. If the value was not specified, SDKs **MUST** fallback to `unknown_service:` concatenated with the process executable name, e.g. `unknown_service:bash`. If the process executable name is not available, the value **MUST** be set to `unknown_service`.
	* The process executable name is the name of the process executable, the same value as described by the [`process.executable.name`](process.md) resource attribute.
	*/
	exports.ATTR_SERVICE_NAME = "service.name";
	/**
	* A namespace for `service.name`.
	*
	* @example Shop
	*
	* @note A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*/
	exports.ATTR_SERVICE_NAMESPACE = "service.namespace";
	/**
	* The version string of the service component. The format is not defined by these conventions.
	*
	* @example 2.0.0
	* @example a01dbef8a
	*/
	exports.ATTR_SERVICE_VERSION = "service.version";
	/**
	* SignalR HTTP connection closure status.
	*
	* @example app_shutdown
	* @example timeout
	*/
	exports.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
	/**
	* Enum value "app_shutdown" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed because the app is shutting down.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
	/**
	* Enum value "normal_closure" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed normally.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
	/**
	* Enum value "timeout" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed due to a timeout.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
	/**
	* [SignalR transport type](https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/docs/specs/TransportProtocols.md)
	*
	* @example web_sockets
	* @example long_polling
	*/
	exports.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
	/**
	* Enum value "long_polling" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* LongPolling protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
	/**
	* Enum value "server_sent_events" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* ServerSentEvents protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
	/**
	* Enum value "web_sockets" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* WebSockets protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
	/**
	* The name of the auto instrumentation agent or distribution, if used.
	*
	* @example parts-unlimited-java
	*
	* @note Official auto instrumentation agents and distributions **SHOULD** set the `telemetry.distro.name` attribute to
	* a string starting with `opentelemetry-`, e.g. `opentelemetry-java-instrumentation`.
	*/
	exports.ATTR_TELEMETRY_DISTRO_NAME = "telemetry.distro.name";
	/**
	* The version string of the auto instrumentation agent or distribution, if used.
	*
	* @example 1.2.3
	*/
	exports.ATTR_TELEMETRY_DISTRO_VERSION = "telemetry.distro.version";
	/**
	* The language of the telemetry SDK.
	*/
	exports.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	/**
	* Enum value "cpp" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
	/**
	* Enum value "dotnet" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
	/**
	* Enum value "erlang" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
	/**
	* Enum value "go" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
	/**
	* Enum value "java" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
	/**
	* Enum value "kotlin" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN = "kotlin";
	/**
	* Enum value "nodejs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
	/**
	* Enum value "php" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
	/**
	* Enum value "python" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
	/**
	* Enum value "ruby" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
	/**
	* Enum value "rust" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
	/**
	* Enum value "swift" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
	/**
	* Enum value "webjs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
	/**
	* The name of the telemetry SDK as defined above.
	*
	* @example opentelemetry
	*
	* @note The OpenTelemetry SDK **MUST** set the `telemetry.sdk.name` attribute to `opentelemetry`.
	* If another SDK, like a fork or a vendor-provided implementation, is used, this SDK **MUST** set the
	* `telemetry.sdk.name` attribute to the fully-qualified class or module name of this SDK's main entry point
	* or another suitable identifier depending on the language.
	* The identifier `opentelemetry` is reserved and **MUST NOT** be used in this case.
	* All custom identifiers **SHOULD** be stable across different versions of an implementation.
	*/
	exports.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	/**
	* The version string of the telemetry SDK.
	*
	* @example 1.2.3
	*/
	exports.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	/**
	* The [URI fragment](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) component
	*
	* @example SemConv
	*/
	exports.ATTR_URL_FRAGMENT = "url.fragment";
	/**
	* Absolute URL describing a network resource according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
	*
	* @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
	* @example //localhost
	*
	* @note For network calls, URL usually has `scheme://host[:port][path][?query][#fragment]` format, where the fragment
	* is not transmitted over HTTP, but if it is known, it **SHOULD** be included nevertheless.
	*
	* `url.full` **MUST NOT** contain credentials passed via URL in form of `https://username:password@www.example.com/`.
	* In such case username and password **SHOULD** be redacted and attribute's value **SHOULD** be `https://REDACTED:REDACTED@www.example.com/`.
	*
	* `url.full` **SHOULD** capture the absolute URL when it is available (or can be reconstructed).
	*
	* Sensitive content provided in `url.full` **SHOULD** be scrubbed when instrumentations can identify it.
	*
	*
	* Query string values for the following keys **SHOULD** be redacted by default and replaced by the
	* value `REDACTED`:
	*
	*   - [`X-Amz-Signature`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Credential`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Security-Token`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
	*   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
	*
	* This list is subject to change over time.
	*
	* Matching of query parameter keys against the sensitive list **SHOULD** be case-sensitive.
	*
	*
	* Instrumentation **MAY** provide a way to override this list via declarative configuration.
	* If so, it **SHOULD** use the `sensitive_query_parameters` property
	* (an array of case-sensitive strings with minimum items 0) under
	* `.instrumentation/development.general.sanitization.url`.
	* This list is a full override of the default sensitive query parameter keys,
	* it is not a list of keys in addition to the defaults.
	*
	* When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
	* `https://www.example.com/path?color=blue&sig=REDACTED`.
	*/
	exports.ATTR_URL_FULL = "url.full";
	/**
	* The [URI path](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) component
	*
	* @example /search
	*
	* @note Sensitive content provided in `url.path` **SHOULD** be scrubbed when instrumentations can identify it.
	*/
	exports.ATTR_URL_PATH = "url.path";
	/**
	* The [URI query](https://www.rfc-editor.org/rfc/rfc3986#section-3.4) component
	*
	* @example q=OpenTelemetry
	*
	* @note Sensitive content provided in `url.query` **SHOULD** be scrubbed when instrumentations can identify it.
	*
	*
	* Query string values for the following keys **SHOULD** be redacted by default and replaced by the value `REDACTED`:
	*
	*   - [`X-Amz-Signature`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Credential`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Security-Token`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
	*   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
	*
	* This list is subject to change over time.
	*
	* Matching of query parameter keys against the sensitive list **SHOULD** be case-sensitive.
	*
	* Instrumentation **MAY** provide a way to override this list via declarative configuration.
	* If so, it **SHOULD** use the `sensitive_query_parameters` property
	* (an array of case-sensitive strings with minimum items 0) under
	* `.instrumentation/development.general.sanitization.url`.
	* This list is a full override of the default sensitive query parameter keys,
	* it is not a list of keys in addition to the defaults.
	*
	* When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
	* `q=OpenTelemetry&sig=REDACTED`.
	*/
	exports.ATTR_URL_QUERY = "url.query";
	/**
	* The [URI scheme](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) component identifying the used protocol.
	*
	* @example https
	* @example ftp
	* @example telnet
	*/
	exports.ATTR_URL_SCHEME = "url.scheme";
	/**
	* Value of the [HTTP User-Agent](https://www.rfc-editor.org/rfc/rfc9110.html#field.user-agent) header sent by the client.
	*
	* @example CERN-LineMode/2.15 libwww/2.17b3
	* @example Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
	* @example YourApp/1.0.0 grpc-java-okhttp/1.27.2
	*/
	exports.ATTR_USER_AGENT_ORIGINAL = "user_agent.original";
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/stable_metrics.js
var require_stable_metrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = exports.METRIC_KESTREL_REJECTED_CONNECTIONS = exports.METRIC_KESTREL_QUEUED_REQUESTS = exports.METRIC_KESTREL_QUEUED_CONNECTIONS = exports.METRIC_KESTREL_CONNECTION_DURATION = exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = exports.METRIC_JVM_THREAD_COUNT = exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = exports.METRIC_JVM_MEMORY_USED = exports.METRIC_JVM_MEMORY_LIMIT = exports.METRIC_JVM_MEMORY_COMMITTED = exports.METRIC_JVM_GC_DURATION = exports.METRIC_JVM_CPU_TIME = exports.METRIC_JVM_CPU_RECENT_UTILIZATION = exports.METRIC_JVM_CPU_COUNT = exports.METRIC_JVM_CLASS_UNLOADED = exports.METRIC_JVM_CLASS_LOADED = exports.METRIC_JVM_CLASS_COUNT = exports.METRIC_HTTP_SERVER_REQUEST_DURATION = exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = exports.METRIC_DOTNET_TIMER_COUNT = exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = exports.METRIC_DOTNET_PROCESS_CPU_TIME = exports.METRIC_DOTNET_PROCESS_CPU_COUNT = exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = exports.METRIC_DOTNET_JIT_COMPILED_METHODS = exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = exports.METRIC_DOTNET_JIT_COMPILATION_TIME = exports.METRIC_DOTNET_GC_PAUSE_TIME = exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = exports.METRIC_DOTNET_GC_COLLECTIONS = exports.METRIC_DOTNET_EXCEPTIONS = exports.METRIC_DOTNET_ASSEMBLY_COUNT = exports.METRIC_DB_CLIENT_OPERATION_DURATION = exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
	exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
	/**
	* Number of exceptions caught by exception handling middleware.
	*
	* @note Meter name: `Microsoft.AspNetCore.Diagnostics`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
	/**
	* Number of requests that are currently active on the server that hold a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
	/**
	* Number of requests that are currently queued, waiting to acquire a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
	/**
	* The time the request spent in a queue waiting to acquire a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
	/**
	* The duration of rate limiting lease held by requests on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
	/**
	* Number of requests that tried to acquire a rate limiting lease.
	*
	* @note Requests could be:
	*
	*   - Rejected by global or endpoint rate limiting policies
	*   - Canceled while waiting for the lease.
	*
	* Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
	/**
	* Number of requests that were attempted to be matched to an endpoint.
	*
	* @note Meter name: `Microsoft.AspNetCore.Routing`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
	/**
	* Duration of database client operations.
	*
	* @note Batch operations **SHOULD** be recorded as a single operation.
	*/
	exports.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
	/**
	* The number of .NET assemblies that are currently loaded.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`AppDomain.CurrentDomain.GetAssemblies().Length`](https://learn.microsoft.com/dotnet/api/system.appdomain.getassemblies).
	*/
	exports.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
	/**
	* The number of exceptions that have been thrown in managed code.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as counting calls to [`AppDomain.CurrentDomain.FirstChanceException`](https://learn.microsoft.com/dotnet/api/system.appdomain.firstchanceexception).
	*/
	exports.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
	/**
	* The number of garbage collections that have occurred since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric uses the [`GC.CollectionCount(int generation)`](https://learn.microsoft.com/dotnet/api/system.gc.collectioncount) API to calculate exclusive collections per generation.
	*/
	exports.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
	/**
	* The *approximate* number of bytes allocated on the managed GC heap since the process has started. The returned value does not include any native allocations.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetTotalAllocatedBytes()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalallocatedbytes).
	*/
	exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
	/**
	* The heap fragmentation, as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.FragmentationAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.fragmentationafterbytes).
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
	/**
	* The managed GC heap size (including fragmentation), as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.SizeAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.sizeafterbytes).
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
	/**
	* The amount of committed virtual memory in use by the .NET GC, as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().TotalCommittedBytes`](https://learn.microsoft.com/dotnet/api/system.gcmemoryinfo.totalcommittedbytes). Committed virtual memory may be larger than the heap size because it includes both memory for storing existing objects (the heap size) and some extra memory that is ready to handle newly allocated objects in the future.
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
	/**
	* The total amount of time paused in GC since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetTotalPauseDuration()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalpauseduration).
	*/
	exports.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
	/**
	* The amount of time the JIT compiler has spent compiling methods since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompilationTime()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompilationtime).
	*/
	exports.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
	/**
	* Count of bytes of intermediate language that have been compiled since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompiledILBytes()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledilbytes).
	*/
	exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
	/**
	* The number of times the JIT compiler (re)compiled methods since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompiledMethodCount()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledmethodcount).
	*/
	exports.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
	/**
	* The number of times there was contention when trying to acquire a monitor lock since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Monitor.LockContentionCount`](https://learn.microsoft.com/dotnet/api/system.threading.monitor.lockcontentioncount).
	*/
	exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
	/**
	* The number of processors available to the process.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as accessing [`Environment.ProcessorCount`](https://learn.microsoft.com/dotnet/api/system.environment.processorcount).
	*/
	exports.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
	/**
	* CPU time used by the process.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as accessing the corresponding processor time properties on [`System.Diagnostics.Process`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process).
	*/
	exports.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
	/**
	* The number of bytes of physical memory mapped to the process context.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Environment.WorkingSet`](https://learn.microsoft.com/dotnet/api/system.environment.workingset).
	*/
	exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
	/**
	* The number of work items that are currently queued to be processed by the thread pool.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.PendingWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.pendingworkitemcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
	/**
	* The number of thread pool threads that currently exist.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.ThreadCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.threadcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
	/**
	* The number of work items that the thread pool has completed since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.CompletedWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.completedworkitemcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
	/**
	* The number of timer instances that are currently active.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Timer.ActiveCount`](https://learn.microsoft.com/dotnet/api/system.threading.timer.activecount).
	*/
	exports.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
	/**
	* Duration of HTTP client requests.
	*/
	exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
	/**
	* Duration of HTTP server requests.
	*/
	exports.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
	/**
	* Number of classes currently loaded.
	*/
	exports.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
	/**
	* Number of classes loaded since JVM start.
	*/
	exports.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
	/**
	* Number of classes unloaded since JVM start.
	*/
	exports.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
	/**
	* Number of processors available to the Java virtual machine.
	*/
	exports.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
	/**
	* Recent CPU utilization for the process as reported by the JVM.
	*
	* @note The value range is [0.0,1.0]. This utilization is not defined as being for the specific interval since last measurement (unlike `system.cpu.utilization`). [Reference](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.management/com/sun/management/OperatingSystemMXBean.html#getProcessCpuLoad()).
	*/
	exports.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
	/**
	* CPU time used by the process as reported by the JVM.
	*/
	exports.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
	/**
	* Duration of JVM garbage collection actions.
	*/
	exports.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
	/**
	* Measure of memory committed.
	*/
	exports.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
	/**
	* Measure of max obtainable memory.
	*/
	exports.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
	/**
	* Measure of memory used.
	*/
	exports.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
	/**
	* Measure of memory used, as measured after the most recent garbage collection event on this pool.
	*/
	exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
	/**
	* Number of executing platform threads.
	*/
	exports.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
	/**
	* Number of connections that are currently active on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
	/**
	* Number of TLS handshakes that are currently in progress on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
	/**
	* The duration of connections on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
	/**
	* Number of connections that are currently queued and are waiting to start.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
	/**
	* Number of HTTP requests on multiplexed connections (HTTP/2 and HTTP/3) that are currently queued and are waiting to start.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
	/**
	* Number of connections rejected by the server.
	*
	* @note Connections are rejected when the currently active count exceeds the value configured with `MaxConcurrentConnections`.
	* Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
	/**
	* The duration of TLS handshakes on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
	/**
	* Number of connections that are currently upgraded (WebSockets). .
	*
	* @note The counter only tracks HTTP/1.1 connections.
	*
	* Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
	/**
	* Number of connections that are currently active on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
	/**
	* The duration of connections on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration";
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+semantic-conventions@1.43.0/node_modules/@opentelemetry/semantic-conventions/build/src/stable_events.js
var require_stable_events = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EVENT_EXCEPTION = void 0;
	/**
	* This event describes a single exception.
	*/
	exports.EVENT_EXCEPTION = "exception";
}));
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs
var import_src = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_trace(), exports);
	__exportStar(require_resource(), exports);
	__exportStar(require_stable_attributes(), exports);
	__exportStar(require_stable_metrics(), exports);
	__exportStar(require_stable_events(), exports);
})))();
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/instrumentation/noop.mjs
function createNoopSpan() {
	const span = {
		end() {},
		setAttribute(_key, _value) {},
		setStatus(_status) {},
		recordException(_exception) {},
		updateName(_name) {
			return span;
		}
	};
	return span;
}
function createNoopTracer(noopSpan) {
	function startActiveSpan(_name, ...rest) {
		const fn = rest[rest.length - 1];
		return fn(noopSpan);
	}
	return { startActiveSpan };
}
function createNoopTraceAPI() {
	const noopTracer = createNoopTracer(createNoopSpan());
	return {
		getTracer(_name, _version) {
			return noopTracer;
		},
		getActiveSpan() {}
	};
}
function createNoopOpenTelemetryAPI() {
	return {
		SpanStatusCode: {
			UNSET: 0,
			OK: 1,
			ERROR: 2
		},
		trace: createNoopTraceAPI()
	};
}
var noopOpenTelemetryAPI = createNoopOpenTelemetryAPI();
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/instrumentation/api.mjs
var openTelemetryAPIPromise;
var openTelemetryAPI;
function getOpenTelemetryAPI() {
	if (!openTelemetryAPIPromise) openTelemetryAPIPromise = import("../../_chunks/core.mjs").then((mod) => {
		openTelemetryAPI = mod;
	}).catch(() => void 0);
	return openTelemetryAPI ?? noopOpenTelemetryAPI;
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs
var INSTRUMENTATION_SCOPE = "better-auth";
var INSTRUMENTATION_VERSION = "1.6.23";
/**
* Better-auth uses `throw ctx.redirect(url)` for flow control (e.g. OAuth
* callbacks). These are APIErrors with 3xx status codes and should not be
* recorded as span errors.
*/
function isRedirectError(err) {
	if (err != null && typeof err === "object" && "name" in err && err.name === "APIError" && "statusCode" in err) {
		const status = err.statusCode;
		return status >= 300 && status < 400;
	}
	return false;
}
function endSpanWithError(span, err) {
	const { SpanStatusCode } = getOpenTelemetryAPI();
	if (isRedirectError(err)) {
		span.setAttribute(import_src.ATTR_HTTP_RESPONSE_STATUS_CODE, err.statusCode);
		span.setStatus({ code: SpanStatusCode.OK });
	} else {
		span.recordException(err);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: String(err?.message ?? err)
		});
	}
	span.end();
}
function withSpan(name, attributes, fn) {
	const { trace } = getOpenTelemetryAPI();
	return trace.getTracer(INSTRUMENTATION_SCOPE, INSTRUMENTATION_VERSION).startActiveSpan(name, { attributes }, (span) => {
		try {
			const result = fn();
			if (result instanceof Promise) return result.then((value) => {
				span.end();
				return value;
			}).catch((err) => {
				endSpanWithError(span, err);
				throw err;
			});
			span.end();
			return result;
		} catch (err) {
			endSpanWithError(span, err);
			throw err;
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call_8c218d6953412190d49ada9a96293d77/node_modules/@better-auth/core/dist/db/adapter/factory.mjs
var debugLogs = [];
var transactionId = -1;
var createAsIsTransaction = (adapter) => (fn) => fn(adapter);
var createAdapterFactory = ({ adapter: customAdapter, config: cfg }) => (options) => {
	const uniqueAdapterFactoryInstanceId = Math.random().toString(36).substring(2, 15);
	const config = {
		...cfg,
		supportsBooleans: cfg.supportsBooleans ?? true,
		supportsDates: cfg.supportsDates ?? true,
		supportsJSON: cfg.supportsJSON ?? false,
		adapterName: cfg.adapterName ?? cfg.adapterId,
		supportsNumericIds: cfg.supportsNumericIds ?? true,
		supportsUUIDs: cfg.supportsUUIDs ?? false,
		supportsArrays: cfg.supportsArrays ?? false,
		transaction: cfg.transaction ?? false,
		disableTransformInput: cfg.disableTransformInput ?? false,
		disableTransformOutput: cfg.disableTransformOutput ?? false,
		disableTransformJoin: cfg.disableTransformJoin ?? false
	};
	if (options.advanced?.database?.generateId === "serial" && config.supportsNumericIds === false) throw new BetterAuthError(`[${config.adapterName}] Your database or database adapter does not support numeric ids. Please disable "useNumberId" in your config.`);
	const schema = getAuthTables(options);
	const debugLog = (...args) => {
		if (config.debugLogs === true || typeof config.debugLogs === "object") {
			const logger = createLogger({ level: "info" });
			if (typeof config.debugLogs === "object" && "isRunningAdapterTests" in config.debugLogs) {
				if (config.debugLogs.isRunningAdapterTests) {
					args.shift();
					debugLogs.push({
						instance: uniqueAdapterFactoryInstanceId,
						args
					});
				}
				return;
			}
			if (typeof config.debugLogs === "object" && config.debugLogs.logCondition && !config.debugLogs.logCondition?.()) return;
			if (typeof args[0] === "object" && "method" in args[0]) {
				const method = args.shift().method;
				if (typeof config.debugLogs === "object") {
					if (method === "create" && !config.debugLogs.create) return;
					else if (method === "update" && !config.debugLogs.update) return;
					else if (method === "updateMany" && !config.debugLogs.updateMany) return;
					else if (method === "findOne" && !config.debugLogs.findOne) return;
					else if (method === "findMany" && !config.debugLogs.findMany) return;
					else if (method === "delete" && !config.debugLogs.delete) return;
					else if (method === "deleteMany" && !config.debugLogs.deleteMany) return;
					else if (method === "consumeOne" && !config.debugLogs.consumeOne) return;
					else if (method === "incrementOne" && !config.debugLogs.incrementOne) return;
					else if (method === "count" && !config.debugLogs.count) return;
				}
				logger.info(`[${config.adapterName}]`, ...args);
			} else logger.info(`[${config.adapterName}]`, ...args);
		}
	};
	const logger = createLogger(options.logger);
	const getDefaultModelName = initGetDefaultModelName({
		usePlural: config.usePlural,
		schema
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		usePlural: config.usePlural,
		schema
	});
	const getModelName = initGetModelName({
		usePlural: config.usePlural,
		schema
	});
	const getFieldName = initGetFieldName({
		schema,
		usePlural: config.usePlural
	});
	const idField = initGetIdField({
		schema,
		options,
		usePlural: config.usePlural,
		disableIdGeneration: config.disableIdGeneration,
		customIdGenerator: config.customIdGenerator,
		supportsUUIDs: config.supportsUUIDs
	});
	const getFieldAttributes = initGetFieldAttributes({
		schema,
		options,
		usePlural: config.usePlural,
		disableIdGeneration: config.disableIdGeneration,
		customIdGenerator: config.customIdGenerator
	});
	const transformInput = async (data, defaultModelName, action, forceAllowId) => {
		const transformedData = {};
		const fields = schema[defaultModelName].fields;
		const newMappedKeys = config.mapKeysTransformInput ?? {};
		const useNumberId = options.advanced?.database?.generateId === "serial";
		fields.id = idField({
			customModelName: defaultModelName,
			forceAllowId: forceAllowId && "id" in data
		});
		for (const field in fields) {
			let value = data[field];
			const fieldAttributes = fields[field];
			const newFieldName = newMappedKeys[field] || fields[field].fieldName || field;
			if (value === void 0 && (fieldAttributes.defaultValue === void 0 && !fieldAttributes.transform?.input && !(action === "update" && fieldAttributes.onUpdate) || action === "update" && !fieldAttributes.onUpdate)) continue;
			if (fieldAttributes && fieldAttributes.type === "date" && !(value instanceof Date) && typeof value === "string") try {
				value = new Date(value);
			} catch {
				logger.error("[Adapter Factory] Failed to convert string to date", {
					value,
					field
				});
			}
			let newValue = withApplyDefault(value, fieldAttributes, action);
			if (fieldAttributes.transform?.input) newValue = await fieldAttributes.transform.input(newValue);
			if (fieldAttributes.references?.field === "id" && useNumberId) if (Array.isArray(newValue)) newValue = newValue.map((x) => x !== null ? Number(x) : null);
			else newValue = newValue !== null ? Number(newValue) : null;
			else if (config.supportsJSON === false && typeof newValue === "object" && fieldAttributes.type === "json") newValue = JSON.stringify(newValue);
			else if (config.supportsArrays === false && Array.isArray(newValue) && (fieldAttributes.type === "string[]" || fieldAttributes.type === "number[]")) newValue = JSON.stringify(newValue);
			else if (config.supportsDates === false && newValue instanceof Date && fieldAttributes.type === "date") newValue = newValue.toISOString();
			else if (config.supportsBooleans === false && typeof newValue === "boolean") newValue = newValue ? 1 : 0;
			if (config.customTransformInput) newValue = config.customTransformInput({
				data: newValue,
				action,
				field: newFieldName,
				fieldAttributes,
				model: getModelName(defaultModelName),
				schema,
				options
			});
			if (newValue !== void 0) transformedData[newFieldName] = newValue;
		}
		return transformedData;
	};
	const transformOutput = async (data, unsafe_model, select = [], join) => {
		const transformSingleOutput = async (data, unsafe_model, select = []) => {
			if (!data) return null;
			const newMappedKeys = config.mapKeysTransformOutput ?? {};
			const transformedData = {};
			const tableSchema = schema[getDefaultModelName(unsafe_model)].fields;
			const idKey = Object.entries(newMappedKeys).find(([_, v]) => v === "id")?.[0];
			tableSchema[idKey ?? "id"] = { type: options.advanced?.database?.generateId === "serial" ? "number" : "string" };
			for (const key in tableSchema) {
				if (select.length && !select.includes(key)) continue;
				const field = tableSchema[key];
				if (field) {
					const originalKey = field.fieldName || key;
					let newValue = data[Object.entries(newMappedKeys).find(([_, v]) => v === originalKey)?.[0] || originalKey];
					if (field.transform?.output) newValue = await field.transform.output(newValue);
					const newFieldName = newMappedKeys[key] || key;
					if (originalKey === "id" || field.references?.field === "id") {
						if (typeof newValue !== "undefined" && newValue !== null) newValue = String(newValue);
					} else if (config.supportsJSON === false && typeof newValue === "string" && field.type === "json") newValue = safeJSONParse(newValue);
					else if (config.supportsArrays === false && typeof newValue === "string" && (field.type === "string[]" || field.type === "number[]")) newValue = safeJSONParse(newValue);
					else if (config.supportsDates === false && typeof newValue === "string" && field.type === "date") newValue = new Date(newValue);
					else if (config.supportsBooleans === false && typeof newValue === "number" && field.type === "boolean") newValue = newValue === 1;
					if (config.customTransformOutput) newValue = config.customTransformOutput({
						data: newValue,
						field: newFieldName,
						fieldAttributes: field,
						select,
						model: getModelName(unsafe_model),
						schema,
						options
					});
					transformedData[newFieldName] = newValue;
				}
			}
			return transformedData;
		};
		if (!join || Object.keys(join).length === 0) return await transformSingleOutput(data, unsafe_model, select);
		unsafe_model = getDefaultModelName(unsafe_model);
		const transformedData = await transformSingleOutput(data, unsafe_model, select);
		const requiredModels = Object.entries(join).map(([model, joinConfig]) => ({
			modelName: getModelName(model),
			defaultModelName: getDefaultModelName(model),
			joinConfig
		}));
		if (!data) return null;
		for (const { modelName, defaultModelName, joinConfig } of requiredModels) {
			let joinedData = await (async () => {
				if (options.experimental?.joins) return data[modelName];
				else return await handleFallbackJoin({
					baseModel: unsafe_model,
					baseData: transformedData,
					joinModel: modelName,
					specificJoinConfig: joinConfig
				});
			})();
			if (joinedData === void 0 || joinedData === null) joinedData = joinConfig.relation === "one-to-one" ? null : [];
			if (joinConfig.relation === "one-to-many" && !Array.isArray(joinedData)) joinedData = [joinedData];
			const transformed = [];
			if (Array.isArray(joinedData)) for (const item of joinedData) {
				const transformedItem = await transformSingleOutput(item, modelName, []);
				transformed.push(transformedItem);
			}
			else {
				const transformedItem = await transformSingleOutput(joinedData, modelName, []);
				transformed.push(transformedItem);
			}
			transformedData[defaultModelName] = (joinConfig.relation === "one-to-one" ? transformed[0] : transformed) ?? null;
		}
		return transformedData;
	};
	const transformWhereClause = ({ model, where, action }) => {
		if (!where) return void 0;
		const newMappedKeys = config.mapKeysTransformInput ?? {};
		return where.map((w) => {
			const { field: unsafe_field, value, operator = "eq", connector = "AND", mode = "sensitive" } = w;
			if (operator === "in") {
				if (!Array.isArray(value)) throw new BetterAuthError("Value must be an array");
			}
			let newValue = value;
			const defaultModelName = getDefaultModelName(model);
			const defaultFieldName = getDefaultFieldName({
				field: unsafe_field,
				model
			});
			const fieldName = newMappedKeys[defaultFieldName] || getFieldName({
				field: defaultFieldName,
				model: defaultModelName
			});
			const fieldAttr = getFieldAttributes({
				field: defaultFieldName,
				model: defaultModelName
			});
			const useNumberId = options.advanced?.database?.generateId === "serial";
			if (defaultFieldName === "id" || fieldAttr.references?.field === "id") {
				if (useNumberId) if (Array.isArray(value)) newValue = value.map(Number);
				else newValue = Number(value);
			}
			if (fieldAttr.type === "date" && value instanceof Date && !config.supportsDates) newValue = value.toISOString();
			if (fieldAttr.type === "boolean" && typeof newValue === "string") newValue = newValue === "true";
			if (fieldAttr.type === "number") {
				if (typeof newValue === "string" && newValue.trim() !== "") {
					const parsed = Number(newValue);
					if (!Number.isNaN(parsed)) newValue = parsed;
				} else if (Array.isArray(newValue)) {
					const parsed = newValue.map((v) => typeof v === "string" && v.trim() !== "" ? Number(v) : NaN);
					if (parsed.every((n) => !Number.isNaN(n))) newValue = parsed;
				}
			}
			if (fieldAttr.type === "boolean" && typeof newValue === "boolean" && !config.supportsBooleans) newValue = newValue ? 1 : 0;
			if (fieldAttr.type === "json" && typeof value === "object" && !config.supportsJSON) try {
				newValue = JSON.stringify(value);
			} catch (error) {
				throw new Error(`Failed to stringify JSON value for field ${fieldName}`, { cause: error });
			}
			if (config.customTransformInput) newValue = config.customTransformInput({
				data: newValue,
				fieldAttributes: fieldAttr,
				field: fieldName,
				model: getModelName(model),
				schema,
				options,
				action
			});
			return {
				operator,
				connector,
				field: fieldName,
				value: newValue,
				mode
			};
		});
	};
	const transformJoinClause = (baseModel, unsanitizedJoin, select) => {
		if (!unsanitizedJoin) return void 0;
		if (Object.keys(unsanitizedJoin).length === 0) return void 0;
		const transformedJoin = {};
		for (const [model, join] of Object.entries(unsanitizedJoin)) {
			if (!join) continue;
			const defaultModelName = getDefaultModelName(model);
			const defaultBaseModelName = getDefaultModelName(baseModel);
			let foreignKeys = Object.entries(schema[defaultModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultBaseModelName);
			let isForwardJoin = true;
			if (!foreignKeys.length) {
				foreignKeys = Object.entries(schema[defaultBaseModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultModelName);
				isForwardJoin = false;
			}
			if (!foreignKeys.length) throw new BetterAuthError(`No foreign key found for model ${model} and base model ${baseModel} while performing join operation.`);
			else if (foreignKeys.length > 1) throw new BetterAuthError(`Multiple foreign keys found for model ${model} and base model ${baseModel} while performing join operation. Only one foreign key is supported.`);
			const [foreignKey, foreignKeyAttributes] = foreignKeys[0];
			if (!foreignKeyAttributes.references) throw new BetterAuthError(`No references found for foreign key ${foreignKey} on model ${model} while performing join operation.`);
			let from;
			let to;
			let requiredSelectField;
			if (isForwardJoin) {
				requiredSelectField = foreignKeyAttributes.references.field;
				from = getFieldName({
					model: baseModel,
					field: requiredSelectField
				});
				to = getFieldName({
					model,
					field: foreignKey
				});
			} else {
				requiredSelectField = foreignKey;
				from = getFieldName({
					model: baseModel,
					field: requiredSelectField
				});
				to = getFieldName({
					model,
					field: foreignKeyAttributes.references.field
				});
			}
			if (select && !select.includes(requiredSelectField)) select.push(requiredSelectField);
			const isUnique = to === "id" ? true : foreignKeyAttributes.unique ?? false;
			let limit = options.advanced?.database?.defaultFindManyLimit ?? 100;
			if (isUnique) limit = 1;
			else if (typeof join === "object" && typeof join.limit === "number") limit = join.limit;
			transformedJoin[getModelName(model)] = {
				on: {
					from,
					to
				},
				limit,
				relation: isUnique ? "one-to-one" : "one-to-many"
			};
		}
		return {
			join: transformedJoin,
			select
		};
	};
	/**
	* Handle joins by making separate queries and combining results (fallback for adapters that don't support native joins).
	*/
	const handleFallbackJoin = async ({ baseModel, baseData, joinModel, specificJoinConfig: joinConfig }) => {
		if (!baseData) return baseData;
		const modelName = getModelName(joinModel);
		const field = joinConfig.on.to;
		const value = baseData[getDefaultFieldName({
			field: joinConfig.on.from,
			model: baseModel
		})];
		if (value === null || value === void 0) return joinConfig.relation === "one-to-one" ? null : [];
		let result;
		const where = transformWhereClause({
			model: modelName,
			where: [{
				field,
				value,
				operator: "eq",
				connector: "AND"
			}],
			action: "findOne"
		});
		try {
			if (joinConfig.relation === "one-to-one") result = await withSpan(`db findOne ${modelName}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: modelName
			}, () => adapterInstance.findOne({
				model: modelName,
				where
			}));
			else {
				const limit = joinConfig.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
				result = await withSpan(`db findMany ${modelName}`, {
					[import_src.ATTR_DB_OPERATION_NAME]: "findMany",
					[import_src.ATTR_DB_COLLECTION_NAME]: modelName
				}, () => adapterInstance.findMany({
					model: modelName,
					where,
					limit
				}));
			}
		} catch (error) {
			logger.error(`Failed to query fallback join for model ${modelName}:`, {
				where,
				limit: joinConfig.limit
			});
			console.error(error);
			throw error;
		}
		return result;
	};
	const adapterInstance = customAdapter({
		options,
		schema,
		debugLog,
		getFieldName,
		getModelName,
		getDefaultModelName,
		getDefaultFieldName,
		getFieldAttributes,
		transformInput,
		transformOutput,
		transformWhereClause
	});
	let lazyLoadTransaction = null;
	const adapter = {
		transaction: async (cb) => {
			if (!lazyLoadTransaction) if (!config.transaction) lazyLoadTransaction = createAsIsTransaction(adapter);
			else {
				logger.debug(`[${config.adapterName}] - Using provided transaction implementation.`);
				lazyLoadTransaction = config.transaction;
			}
			return lazyLoadTransaction(cb);
		},
		create: async ({ data: unsafeData, model: unsafeModel, select, forceAllowId = false }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			unsafeModel = getDefaultModelName(unsafeModel);
			if ("id" in unsafeData && typeof unsafeData.id !== "undefined" && !forceAllowId) {
				logger.warn(`[${config.adapterName}] - You are trying to create a record with an id. This is not allowed as we handle id generation for you, unless you pass in the \`forceAllowId\` parameter. The id will be ignored.`);
				const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i) => i !== 1).join("\n").replace("Error:", "Create method with `id` being called at:");
				console.log(stack);
				unsafeData.id = void 0;
			}
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("create")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "create", forceAllowId);
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const res = await withSpan(`db create ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "create",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.create({
				data,
				model
			}));
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("create")} ${formatAction("DB Result")}:`, {
				model,
				res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, void 0);
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		update: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			unsafeModel = getDefaultModelName(unsafeModel);
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "update"
			});
			if (where.length === 0) return null;
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("update")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const res = await withSpan(`db update ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "update",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.update({
				model,
				where,
				update: data
			}));
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("update")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		updateMany: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "updateMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("updateMany")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const updatedCount = await withSpan(`db updateMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "updateMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.updateMany({
				model,
				where,
				update: data
			}));
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("updateMany")} ${formatAction("DB Result")}:`, {
				model,
				data: updatedCount
			});
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Result")}:`, {
				model,
				data: updatedCount
			});
			return updatedCount;
		},
		findOne: async ({ model: unsafeModel, where: unsafeWhere, select, join: unsafeJoin }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "findOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			let join;
			let passJoinToAdapter = true;
			if (!config.disableTransformJoin) {
				const result = transformJoinClause(unsafeModel, unsafeJoin, select);
				if (result) {
					join = result.join;
					select = result.select;
				}
				if (!options.experimental?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
			} else join = unsafeJoin;
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findOne")}:`, {
				model,
				where,
				select,
				join
			});
			const res = await withSpan(`db findOne ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.findOne({
				model,
				where,
				select,
				join: passJoinToAdapter ? join : void 0
			}));
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, join);
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		findMany: async ({ model: unsafeModel, where: unsafeWhere, limit: unsafeLimit, select, sortBy, offset, join: unsafeJoin }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const limit = unsafeLimit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "findMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			let join;
			let passJoinToAdapter = true;
			if (!config.disableTransformJoin) {
				const result = transformJoinClause(unsafeModel, unsafeJoin, select);
				if (result) {
					join = result.join;
					select = result.select;
				}
				if (!options.experimental?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
			} else join = unsafeJoin;
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findMany")}:`, {
				model,
				where,
				limit,
				sortBy,
				offset,
				join
			});
			const res = await withSpan(`db findMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.findMany({
				model,
				where,
				limit,
				select,
				sortBy,
				offset,
				join: passJoinToAdapter ? join : void 0
			}));
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findMany")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await Promise.all(res.map(async (r) => {
				return await transformOutput(r, unsafeModel, void 0, join);
			}));
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findMany")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		delete: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "delete"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("delete")}:`, {
				model,
				where
			});
			await withSpan(`db delete ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "delete",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.delete({
				model,
				where
			}));
			debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("delete")} ${formatAction("DB Result")}:`, { model });
		},
		deleteMany: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "deleteMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DeleteMany")}:`, {
				model,
				where
			});
			const res = await withSpan(`db deleteMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "deleteMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.deleteMany({
				model,
				where
			}));
			debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			return res;
		},
		consumeOne: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "consumeOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("consumeOne")} ${formatAction("ConsumeOne")}:`, {
				model,
				where
			});
			let res;
			let resultNeedsOutputTransform = true;
			if (adapterInstance.consumeOne) res = await withSpan(`db consumeOne ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "consumeOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.consumeOne({
				model,
				where
			}));
			else {
				res = await withSpan(`db consumeOne ${model}`, {
					[import_src.ATTR_DB_OPERATION_NAME]: "consumeOne",
					[import_src.ATTR_DB_COLLECTION_NAME]: model
				}, () => runWithTransaction(adapter, async () => {
					const trx = await getCurrentAdapter(adapter);
					const target = (await trx.findMany({
						model: unsafeModel,
						where: unsafeWhere,
						limit: 1
					}))[0];
					if (!target) return null;
					const deleted = await trx.deleteMany({
						model: unsafeModel,
						where: [...unsafeWhere, {
							field: "id",
							value: target.id,
							operator: "eq",
							connector: "AND",
							mode: "sensitive"
						}]
					});
					if (typeof deleted !== "number") throw new BetterAuthError(`Adapter "${config.adapterId}" returned a non-numeric value from deleteMany during the consumeOne fallback. Return the number of deleted rows, or implement a native consumeOne for atomic single-use consumption.`);
					return deleted > 0 ? target : null;
				}));
				resultNeedsOutputTransform = false;
			}
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("consumeOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput && resultNeedsOutputTransform && res) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("consumeOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		incrementOne: async ({ model: unsafeModel, where: unsafeWhere, increment: unsafeIncrement, set: unsafeSet }) => {
			const hasIncrement = Object.keys(unsafeIncrement).length > 0;
			const hasSet = !!unsafeSet && Object.keys(unsafeSet).length > 0;
			if (!hasIncrement && !hasSet) throw new BetterAuthError("incrementOne requires a non-empty `increment` or `set`; both were empty.");
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "incrementOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("incrementOne")} ${formatAction("IncrementOne")}:`, {
				model,
				where,
				increment: unsafeIncrement,
				set: unsafeSet
			});
			let res;
			let resultNeedsOutputTransform = true;
			if (adapterInstance.incrementOne) {
				const mappedKeys = config.mapKeysTransformInput ?? {};
				const increment = {};
				for (const [field, delta] of Object.entries(unsafeIncrement)) increment[mappedKeys[field] || getFieldName({
					model: unsafeModel,
					field
				})] = delta;
				let set;
				if (unsafeSet && !config.disableTransformInput) set = await transformInput(unsafeSet, unsafeModel, "update");
				else set = unsafeSet;
				if (Object.keys(increment).length === 0 && (!set || Object.keys(set).length === 0)) throw new BetterAuthError("incrementOne resolved to an empty update: every increment/set field was unknown to the schema or transformed away.");
				res = await withSpan(`db incrementOne ${model}`, {
					[import_src.ATTR_DB_OPERATION_NAME]: "incrementOne",
					[import_src.ATTR_DB_COLLECTION_NAME]: model
				}, () => adapterInstance.incrementOne({
					model,
					where,
					increment,
					set
				}));
			} else {
				res = await withSpan(`db incrementOne ${model}`, {
					[import_src.ATTR_DB_OPERATION_NAME]: "incrementOne",
					[import_src.ATTR_DB_COLLECTION_NAME]: model
				}, () => runWithTransaction(adapter, async () => {
					const trx = await getCurrentAdapter(adapter);
					const target = (await trx.findMany({
						model: unsafeModel,
						where: unsafeWhere,
						limit: 1
					}))[0];
					if (!target) return null;
					const nextValues = { ...unsafeSet ?? {} };
					for (const [field, delta] of Object.entries(unsafeIncrement)) nextValues[field] = (typeof target[field] === "number" ? target[field] : 0) + delta;
					const updated = await trx.updateMany({
						model: unsafeModel,
						where: [...unsafeWhere, {
							field: "id",
							value: target.id,
							operator: "eq",
							connector: "AND",
							mode: "sensitive"
						}],
						update: nextValues
					});
					if (typeof updated !== "number") throw new BetterAuthError(`Adapter "${config.adapterId}" returned a non-numeric value from updateMany during the incrementOne fallback. Return the number of updated rows, or implement a native incrementOne for atomic guarded counter updates.`);
					return updated > 0 ? {
						...target,
						...nextValues
					} : null;
				}));
				resultNeedsOutputTransform = false;
			}
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("incrementOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput && resultNeedsOutputTransform && res) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("incrementOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		count: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "count"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("count")}:`, {
				model,
				where
			});
			const res = await withSpan(`db count ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "count",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.count({
				model,
				where
			}));
			debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("count")}:`, {
				model,
				data: res
			});
			return res;
		},
		createSchema: adapterInstance.createSchema ? async (_, file) => {
			const tables = getAuthTables(options);
			if (options.secondaryStorage && !options.session?.storeSessionInDatabase) delete tables.session;
			return adapterInstance.createSchema({
				file,
				tables
			});
		} : void 0,
		options: {
			adapterConfig: config,
			...adapterInstance.options ?? {}
		},
		id: config.adapterId,
		...config.debugLogs?.isRunningAdapterTests ? { adapterTestDebugLogs: {
			resetDebugLogs() {
				debugLogs = debugLogs.filter((log) => log.instance !== uniqueAdapterFactoryInstanceId);
			},
			printDebugLogs() {
				const separator = `─`.repeat(80);
				const logs = debugLogs.filter((log) => log.instance === uniqueAdapterFactoryInstanceId);
				if (logs.length === 0) return;
				const log = logs.reverse().map((log) => {
					log.args[0] = `\n${log.args[0]}`;
					return [...log.args, "\n"];
				}).reduce((prev, curr) => {
					return [...curr, ...prev];
				}, [`\n${separator}`]);
				console.log(...log);
			}
		} } : {}
	};
	return adapter;
};
function formatTransactionId(transactionId) {
	if (getColorDepth() < 8) return `#${transactionId}`;
	return `${TTY_COLORS.fg.magenta}#${transactionId}${TTY_COLORS.reset}`;
}
function formatStep(step, total) {
	return `${TTY_COLORS.bg.black}${TTY_COLORS.fg.yellow}[${step}/${total}]${TTY_COLORS.reset}`;
}
function formatMethod(method) {
	return `${TTY_COLORS.bright}${method}${TTY_COLORS.reset}`;
}
function formatAction(action) {
	return `${TTY_COLORS.dim}(${action})${TTY_COLORS.reset}`;
}
//#endregion
export { logger as n, BetterAuthError as r, createAdapterFactory as t };
