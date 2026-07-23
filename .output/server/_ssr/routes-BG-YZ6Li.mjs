import { o as __toESM } from "../_runtime.mjs";
import { n as toKebabCase, t as capitalizeFirstLetter } from "./string-BjC7GJE-.mjs";
import { _ as saveDefault, a as drinks, h as periods, i as defu, o as getBaseURL, p as isSafeUrlScheme, r as createFetch, s as getDrinkDay, v as saveResponse } from "./drinks-DVdt249H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as Eye, c as Check, i as History, l as CalendarDays, n as Settings, o as Coffee, r as LogOut, s as ChevronRight, t as X, u as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BG-YZ6Li.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROTO_POLLUTION_PATTERNS = {
	proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
	constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
	protoShort: /"__proto__"\s*:/,
	constructorShort: /"constructor"\s*:/
};
var JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
var SPECIAL_VALUES = {
	true: true,
	false: false,
	null: null,
	undefined: void 0,
	nan: NaN,
	infinity: Number.POSITIVE_INFINITY,
	"-infinity": Number.NEGATIVE_INFINITY
};
var ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
	return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
	const match = ISO_DATE_REGEX.exec(value);
	if (!match) return null;
	const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
	const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
	if (offsetSign) {
		const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
		date.setUTCMinutes(date.getUTCMinutes() + offset);
	}
	return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
	const { strict = false, warnings = false, reviver, parseDates = true } = options;
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	const lowerValue = trimmed.toLowerCase();
	if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
	if (!JSON_SIGNATURE.test(trimmed)) {
		if (strict) throw new SyntaxError("[better-json] Invalid JSON");
		return value;
	}
	if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
		const matches = pattern.test(trimmed);
		if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
		return matches;
	}) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
	try {
		const secureReviver = (key, value) => {
			if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
				if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
				return;
			}
			if (parseDates && typeof value === "string") {
				const date = parseISODate(value);
				if (date) return date;
			}
			return reviver ? reviver(key, value) : value;
		};
		return JSON.parse(trimmed, secureReviver);
	} catch (error) {
		if (strict) throw error;
		return value;
	}
}
function parseJSON(value, options = { strict: true }) {
	return betterJSONParse(value, options);
}
var redirectPlugin = {
	id: "redirect",
	name: "Redirect",
	hooks: { onSuccess(context) {
		if (context.data?.url && context.data?.redirect && isSafeUrlScheme(context.data.url)) {
			if (typeof window !== "undefined" && window.location) {
				if (window.location) try {
					window.location.href = context.data.url;
				} catch {}
			}
		}
	} }
};
var listenerQueue = [];
var lqIndex = 0;
var batchSeen = null;
var QUEUE_ITEMS_PER_LISTENER = 4;
var nanostoresGlobal = globalThis.nanostoresGlobal ||= { epoch: 0 };
var drainQueue = () => {
	for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) listenerQueue[lqIndex](listenerQueue[lqIndex + 1].value, listenerQueue[lqIndex + 2], listenerQueue[lqIndex + 3]);
	listenerQueue.length = 0;
};
var atom = /* @__NO_SIDE_EFFECTS__ */ (initialValue) => {
	let listeners = [];
	let $atom = {
		get() {
			if (!$atom.lc) $atom.listen(() => {})();
			return $atom.value;
		},
		init: initialValue,
		lc: 0,
		listen(listener) {
			$atom.lc = listeners.push(listener);
			return () => {
				for (let i = lqIndex + QUEUE_ITEMS_PER_LISTENER; i < listenerQueue.length;) if (listenerQueue[i] === listener) listenerQueue.splice(i, QUEUE_ITEMS_PER_LISTENER);
				else i += QUEUE_ITEMS_PER_LISTENER;
				let index = listeners.indexOf(listener);
				if (~index) {
					listeners.splice(index, 1);
					if (!--$atom.lc) $atom.off();
				}
			};
		},
		notify(oldValue, changedKey) {
			nanostoresGlobal.epoch++;
			let runListenerQueue = !listenerQueue.length && !batchSeen;
			for (let listener of listeners) {
				if (batchSeen?.has(listener)) continue;
				batchSeen?.add(listener);
				listenerQueue.push(listener, $atom, oldValue, batchSeen ? void 0 : changedKey);
			}
			if (runListenerQueue) drainQueue();
		},
		off() {},
		set(newValue) {
			let oldValue = $atom.value;
			if (oldValue !== newValue) {
				$atom.value = newValue;
				$atom.notify(oldValue);
			}
		},
		subscribe(listener) {
			let unbind = $atom.listen(listener);
			listener($atom.value);
			return unbind;
		},
		value: initialValue
	};
	return $atom;
};
var SET = 2;
var MOUNT = 5;
var UNMOUNT = 6;
var REVERT_MUTATION = 10;
var on = (object, listener, eventKey, mutateStore) => {
	object.events = object.events || {};
	if (!object.events[eventKey + REVERT_MUTATION]) object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
		object.events[eventKey].reduceRight((event, l) => (l(event), event), {
			shared: {},
			...eventProps
		});
	});
	object.events[eventKey] = object.events[eventKey] || [];
	object.events[eventKey].push(listener);
	return () => {
		let currentListeners = object.events[eventKey];
		let index = currentListeners.indexOf(listener);
		currentListeners.splice(index, 1);
		if (!currentListeners.length) {
			delete object.events[eventKey];
			object.events[eventKey + REVERT_MUTATION]();
			delete object.events[eventKey + REVERT_MUTATION];
		}
	};
};
var onSet = ($store, listener) => on($store, listener, SET, (runListeners) => {
	let originSet = $store.set;
	let originSetKey = $store.setKey;
	if ($store.setKey) $store.setKey = (changed, changedValue) => {
		let isAborted;
		let abort = () => {
			isAborted = true;
		};
		runListeners({
			abort,
			changed,
			newValue: {
				...$store.value,
				[changed]: changedValue
			}
		});
		if (!isAborted) return originSetKey(changed, changedValue);
	};
	$store.set = (newValue) => {
		let isAborted;
		let abort = () => {
			isAborted = true;
		};
		runListeners({
			abort,
			newValue
		});
		if (!isAborted) return originSet(newValue);
	};
	return () => {
		$store.set = originSet;
		$store.setKey = originSetKey;
	};
});
var STORE_UNMOUNT_DELAY = 1e3;
var onMount = ($store, initialize) => {
	let listener = (payload) => {
		let destroy = initialize(payload);
		if (destroy) $store.events[UNMOUNT].push(destroy);
	};
	return on($store, listener, MOUNT, (runListeners) => {
		let originListen = $store.listen;
		$store.listen = (...args) => {
			if (!$store.lc && !$store.active) {
				$store.active = true;
				runListeners();
			}
			return originListen(...args);
		};
		let originOff = $store.off;
		$store.events[UNMOUNT] = [];
		$store.off = () => {
			originOff();
			setTimeout(() => {
				if ($store.active && !$store.lc) {
					$store.active = false;
					for (let destroy of $store.events[UNMOUNT]) destroy();
					$store.events[UNMOUNT] = [];
				}
			}, STORE_UNMOUNT_DELAY);
		};
		return () => {
			$store.listen = originListen;
			$store.off = originOff;
		};
	});
};
function listenKeys($store, keys, listener) {
	let keysSet = new Set(keys);
	return $store.listen((value, oldValue, changed) => {
		if (changed === void 0 ? keys.some((key) => value[key] !== oldValue[key]) : keysSet.has(changed) || keysSet.has(changed.split(/\.|\[/)[0])) listener(value, oldValue, changed);
	});
}
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
/**
* Deep structural equality for JSON-serializable values.
* Handles: primitives, null, arrays, and plain objects.
* Short-circuits on referential equality at every recursion level.
*/
function isJsonEqual(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (!isJsonEqual(a[i], b[i])) return false;
		return true;
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		for (const key of keysA) if (!(key in b) || !isJsonEqual(a[key], b[key])) return false;
		return true;
	}
	return false;
}
/**
* Attach an equality gate to a nanostores atom via `onSet`.
* When `isEqual(currentValue, newValue)` returns true, the `set()` call
* is aborted: no listeners fire, no framework re-renders occur.
*
* Returns the unsubscribe function from `onSet`.
*/
function withEquality(store, isEqual) {
	return onSet(store, ({ newValue, abort }) => {
		if (isEqual(store.value, newValue)) abort();
	});
}
var kBroadcastChannel = Symbol.for("better-auth:broadcast-channel");
var now$1 = () => Math.floor(Date.now() / 1e3);
var WindowBroadcastChannel = class {
	listeners = /* @__PURE__ */ new Set();
	name;
	constructor(name = "better-auth.message") {
		this.name = name;
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	post(message) {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(this.name, JSON.stringify({
				...message,
				timestamp: now$1()
			}));
		} catch {}
	}
	setup() {
		if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const handler = (event) => {
			if (event.key !== this.name) return;
			const message = JSON.parse(event.newValue ?? "{}");
			if (message?.event !== "session" || !message?.data) return;
			this.listeners.forEach((listener) => listener(message));
		};
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("storage", handler);
		};
	}
};
function getGlobalBroadcastChannel(name = "better-auth.message") {
	if (!globalThis[kBroadcastChannel]) globalThis[kBroadcastChannel] = new WindowBroadcastChannel(name);
	return globalThis[kBroadcastChannel];
}
var kFocusManager = Symbol.for("better-auth:focus-manager");
var WindowFocusManager = class {
	listeners = /* @__PURE__ */ new Set();
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	setFocused(focused) {
		this.listeners.forEach((listener) => listener(focused));
	}
	setup() {
		if (typeof window === "undefined" || typeof document === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const visibilityHandler = () => {
			if (document.visibilityState === "visible") this.setFocused(true);
		};
		document.addEventListener("visibilitychange", visibilityHandler, false);
		return () => {
			document.removeEventListener("visibilitychange", visibilityHandler, false);
		};
	}
};
function getGlobalFocusManager() {
	if (!globalThis[kFocusManager]) globalThis[kFocusManager] = new WindowFocusManager();
	return globalThis[kFocusManager];
}
var kOnlineManager = Symbol.for("better-auth:online-manager");
var WindowOnlineManager = class {
	listeners = /* @__PURE__ */ new Set();
	isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	setOnline(online) {
		this.isOnline = online;
		this.listeners.forEach((listener) => listener(online));
	}
	setup() {
		if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const onOnline = () => this.setOnline(true);
		const onOffline = () => this.setOnline(false);
		window.addEventListener("online", onOnline, false);
		window.addEventListener("offline", onOffline, false);
		return () => {
			window.removeEventListener("online", onOnline, false);
			window.removeEventListener("offline", onOffline, false);
		};
	}
};
function getGlobalOnlineManager() {
	if (!globalThis[kOnlineManager]) globalThis[kOnlineManager] = new WindowOnlineManager();
	return globalThis[kOnlineManager];
}
var now = () => Math.floor(Date.now() / 1e3);
/**
* Rate limit: don't refetch on focus if a session request was made within this many seconds
*/
var FOCUS_REFETCH_RATE_LIMIT_SECONDS = 5;
function createSessionRefreshManager(opts) {
	const { fetchSession, shouldPollSession = () => true, sessionSignal, options = {} } = opts;
	const refetchInterval = options.sessionOptions?.refetchInterval ?? 0;
	const refetchOnWindowFocus = options.sessionOptions?.refetchOnWindowFocus ?? true;
	const refetchWhenOffline = options.sessionOptions?.refetchWhenOffline ?? false;
	const state = {
		isInitialized: false,
		lastSessionRequest: 0
	};
	const shouldRefetch = () => {
		return refetchWhenOffline || getGlobalOnlineManager().isOnline;
	};
	const triggerRefetch = (event) => {
		if (!shouldRefetch()) return;
		if (event?.event === "storage") {
			fetchSession();
			return;
		}
		if (event?.event === "poll") {
			state.lastSessionRequest = now();
			fetchSession();
			return;
		}
		if (event?.event === "visibilitychange") {
			if (now() - state.lastSessionRequest < FOCUS_REFETCH_RATE_LIMIT_SECONDS) return;
			state.lastSessionRequest = now();
			fetchSession();
			return;
		}
		fetchSession();
	};
	const broadcastSessionUpdate = (trigger) => {
		getGlobalBroadcastChannel().post({
			event: "session",
			data: { trigger },
			clientId: Math.random().toString(36).substring(7)
		});
	};
	const setupPolling = () => {
		if (refetchInterval && refetchInterval > 0) state.pollInterval = setInterval(() => {
			if (shouldPollSession()) triggerRefetch({ event: "poll" });
		}, refetchInterval * 1e3);
	};
	const setupBroadcast = () => {
		state.unsubscribeBroadcast = getGlobalBroadcastChannel().subscribe(() => {
			triggerRefetch({ event: "storage" });
		});
	};
	const setupFocusRefetch = () => {
		if (!refetchOnWindowFocus) return;
		state.unsubscribeFocus = getGlobalFocusManager().subscribe(() => {
			triggerRefetch({ event: "visibilitychange" });
		});
	};
	const setupOnlineRefetch = () => {
		state.unsubscribeOnline = getGlobalOnlineManager().subscribe((online) => {
			if (online) triggerRefetch({ event: "visibilitychange" });
		});
	};
	const setupSignalSubscription = () => {
		state.unsubscribeSignal = sessionSignal.listen(() => {
			fetchSession();
		});
	};
	const init = () => {
		if (state.isInitialized) return;
		state.isInitialized = true;
		setupPolling();
		setupBroadcast();
		setupFocusRefetch();
		setupOnlineRefetch();
		setupSignalSubscription();
		state.cleanupBroadcastSetup = getGlobalBroadcastChannel().setup();
		state.cleanupFocusSetup = getGlobalFocusManager().setup();
		state.cleanupOnlineSetup = getGlobalOnlineManager().setup();
	};
	const cleanup = () => {
		if (!state.isInitialized) return;
		if (state.pollInterval) {
			clearInterval(state.pollInterval);
			state.pollInterval = void 0;
		}
		if (state.unsubscribeBroadcast) {
			state.unsubscribeBroadcast();
			state.unsubscribeBroadcast = void 0;
		}
		if (state.unsubscribeFocus) {
			state.unsubscribeFocus();
			state.unsubscribeFocus = void 0;
		}
		if (state.unsubscribeOnline) {
			state.unsubscribeOnline();
			state.unsubscribeOnline = void 0;
		}
		if (state.unsubscribeSignal) {
			state.unsubscribeSignal();
			state.unsubscribeSignal = void 0;
		}
		if (state.cleanupBroadcastSetup) {
			state.cleanupBroadcastSetup();
			state.cleanupBroadcastSetup = void 0;
		}
		if (state.cleanupFocusSetup) {
			state.cleanupFocusSetup();
			state.cleanupFocusSetup = void 0;
		}
		if (state.cleanupOnlineSetup) {
			state.cleanupOnlineSetup();
			state.cleanupOnlineSetup = void 0;
		}
		state.isInitialized = false;
		state.lastSessionRequest = 0;
	};
	return {
		init,
		cleanup,
		triggerRefetch,
		broadcastSessionUpdate
	};
}
var isServer = () => typeof window === "undefined";
/**
* Normalize $fetch response: `throw: true` returns data directly,
* otherwise `{ data, error }`.
*/
function normalizeSessionResponse(res) {
	if (typeof res === "object" && res !== null && "data" in res && "error" in res) return res;
	return {
		data: res,
		error: null
	};
}
function normalizeSessionData(data) {
	if (!data) return null;
	if (data.session === null && data.user === null) return null;
	return data;
}
function isSessionAtomEqual(a, b) {
	return isJsonEqual(a.data, b.data) && a.error === b.error && a.isPending === b.isPending && a.isRefetching === b.isRefetching && a.refetch === b.refetch;
}
function getSessionAtom($fetch, options) {
	const $signal = /* @__PURE__ */ atom(false);
	let abortController;
	const refetch = (queryParams) => fetchSession(queryParams);
	const session = /* @__PURE__ */ atom({
		data: null,
		error: null,
		isPending: true,
		isRefetching: false,
		refetch
	});
	withEquality(session, isSessionAtomEqual);
	const settleAbortedFetch = (controller) => {
		if (abortController !== controller) return;
		const current = session.get();
		abortController = void 0;
		if (!current.isPending && !current.isRefetching) return;
		session.set({
			...current,
			isPending: false,
			isRefetching: false,
			refetch
		});
	};
	const fetchSession = async (queryParams) => {
		abortController?.abort();
		const controller = new AbortController();
		abortController = controller;
		const current = session.get();
		session.set({
			...current,
			isPending: current.data === null,
			isRefetching: true,
			error: null,
			refetch
		});
		try {
			const res = await $fetch("/get-session", {
				method: "GET",
				query: queryParams?.query,
				signal: controller.signal
			});
			if (controller.signal.aborted) {
				settleAbortedFetch(controller);
				return;
			}
			let { data, error } = normalizeSessionResponse(res);
			if (data?.needsRefresh) try {
				const refreshRes = await $fetch("/get-session", {
					method: "POST",
					signal: controller.signal
				});
				if (controller.signal.aborted) {
					settleAbortedFetch(controller);
					return;
				}
				({data, error} = normalizeSessionResponse(refreshRes));
			} catch {
				if (controller.signal.aborted) {
					settleAbortedFetch(controller);
					return;
				}
			}
			if (error) {
				const latest = session.get();
				const isUnauthorized = error?.status === 401;
				session.set({
					data: isUnauthorized ? null : latest.data,
					error,
					isPending: false,
					isRefetching: false,
					refetch
				});
				return;
			}
			const sessionData = normalizeSessionData(data);
			const current = session.get();
			const stableData = current.data != null && sessionData != null && isJsonEqual(current.data, sessionData) ? current.data : sessionData;
			session.set({
				data: stableData,
				error: null,
				isPending: false,
				isRefetching: false,
				refetch
			});
		} catch (fetchError) {
			if (controller.signal.aborted) {
				settleAbortedFetch(controller);
				return;
			}
			const latest = session.get();
			session.set({
				data: latest.data,
				error: fetchError,
				isPending: false,
				isRefetching: false,
				refetch
			});
		}
	};
	let broadcastSessionUpdate = () => {};
	onMount(session, () => {
		let timeoutId;
		if (!isServer()) timeoutId = setTimeout(() => {
			fetchSession();
		}, 0);
		const refreshManager = createSessionRefreshManager({
			fetchSession,
			shouldPollSession: () => session.get().data != null,
			sessionSignal: $signal,
			options
		});
		refreshManager.init();
		broadcastSessionUpdate = refreshManager.broadcastSessionUpdate;
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			const controller = abortController;
			controller?.abort();
			if (controller) settleAbortedFetch(controller);
			refreshManager.cleanup();
		};
	});
	return {
		session,
		$sessionSignal: $signal,
		broadcastSessionUpdate: (trigger) => broadcastSessionUpdate(trigger)
	};
}
var resolvePublicAuthUrl = (basePath) => {
	if (typeof process === "undefined") return void 0;
	const path = basePath ?? "/api/auth";
	if (process.env.NEXT_PUBLIC_AUTH_URL) return process.env.NEXT_PUBLIC_AUTH_URL;
	if (typeof window === "undefined") {
		if (process.env.NEXTAUTH_URL) try {
			return process.env.NEXTAUTH_URL;
		} catch {}
		if (process.env.VERCEL_URL) try {
			const protocol = process.env.VERCEL_URL.startsWith("http") ? "" : "https://";
			return `${new URL(`${protocol}${process.env.VERCEL_URL}`).origin}${path}`;
		} catch {}
	}
};
var getClientConfig = (options, loadEnv) => {
	const isCredentialsSupported = "credentials" in Request.prototype;
	const baseURL = getBaseURL(options?.baseURL, options?.basePath, void 0, loadEnv) ?? resolvePublicAuthUrl(options?.basePath) ?? "/api/auth";
	const pluginsFetchPlugins = options?.plugins?.flatMap((plugin) => plugin.fetchPlugins).filter((pl) => pl !== void 0) || [];
	const lifeCyclePlugin = {
		id: "lifecycle-hooks",
		name: "lifecycle-hooks",
		hooks: {
			onSuccess: options?.fetchOptions?.onSuccess,
			onError: options?.fetchOptions?.onError,
			onRequest: options?.fetchOptions?.onRequest,
			onResponse: options?.fetchOptions?.onResponse
		}
	};
	const { onSuccess: _onSuccess, onError: _onError, onRequest: _onRequest, onResponse: _onResponse, ...restOfFetchOptions } = options?.fetchOptions || {};
	const $fetch = createFetch({
		baseURL,
		...isCredentialsSupported ? { credentials: "include" } : {},
		method: "GET",
		jsonParser(text) {
			if (!text) return null;
			return parseJSON(text, { strict: false });
		},
		customFetchImpl: fetch,
		...restOfFetchOptions,
		plugins: [
			lifeCyclePlugin,
			...restOfFetchOptions.plugins || [],
			...options?.disableDefaultFetchPlugins ? [] : [redirectPlugin],
			...pluginsFetchPlugins
		]
	});
	const { $sessionSignal, session, broadcastSessionUpdate } = getSessionAtom($fetch, options);
	const plugins = options?.plugins || [];
	let pluginsActions = {};
	const pluginsAtoms = {
		$sessionSignal,
		session
	};
	const pluginPathMethods = {
		"/sign-out": "POST",
		"/revoke-sessions": "POST",
		"/revoke-other-sessions": "POST",
		"/delete-user": "POST"
	};
	const atomListeners = [{
		signal: "$sessionSignal",
		matcher(path) {
			return path === "/sign-out" || path === "/update-user" || path === "/update-session" || path === "/sign-up/email" || path === "/sign-in/email" || path === "/delete-user" || path === "/verify-email" || path === "/revoke-sessions" || path === "/revoke-session" || path === "/revoke-other-sessions" || path === "/change-email" || path === "/change-password";
		},
		callback(path) {
			if (path === "/sign-out") broadcastSessionUpdate("signout");
			else if (path === "/update-user" || path === "/update-session") broadcastSessionUpdate("updateUser");
		}
	}];
	for (const plugin of plugins) {
		if (plugin.getAtoms) Object.assign(pluginsAtoms, plugin.getAtoms?.($fetch));
		if (plugin.pathMethods) Object.assign(pluginPathMethods, plugin.pathMethods);
		if (plugin.atomListeners) atomListeners.push(...plugin.atomListeners);
	}
	const $store = {
		notify: (signal) => {
			pluginsAtoms[signal].set(!pluginsAtoms[signal].get());
		},
		listen: (signal, listener) => {
			pluginsAtoms[signal].subscribe(listener);
		},
		atoms: pluginsAtoms
	};
	for (const plugin of plugins) if (plugin.getActions) pluginsActions = defu(plugin.getActions?.($fetch, $store, options) ?? {}, pluginsActions);
	return {
		get baseURL() {
			return baseURL;
		},
		pluginsActions,
		pluginsAtoms,
		pluginPathMethods,
		atomListeners,
		$fetch,
		$store
	};
};
function isAtom(value) {
	return typeof value === "object" && value !== null && "get" in value && typeof value.get === "function" && "lc" in value && typeof value.lc === "number";
}
function getMethod(path, knownPathMethods, args) {
	const method = knownPathMethods[path];
	const { fetchOptions, query: _query, ...body } = args || {};
	if (method) return method;
	if (fetchOptions?.method) return fetchOptions.method;
	if (body && Object.keys(body).length > 0) return "POST";
	return "GET";
}
function createDynamicPathProxy(routes, client, knownPathMethods, atoms, atomListeners) {
	function createProxy(path = []) {
		return new Proxy(function() {}, {
			get(_, prop) {
				if (typeof prop !== "string") return;
				if (prop === "then" || prop === "catch" || prop === "finally") return;
				const fullPath = [...path, prop];
				let current = routes;
				for (const segment of fullPath) if (current && typeof current === "object" && segment in current) current = current[segment];
				else {
					current = void 0;
					break;
				}
				if (typeof current === "function") return current;
				if (isAtom(current)) return current;
				return createProxy(fullPath);
			},
			apply: async (_, __, args) => {
				const routePath = "/" + path.map(toKebabCase).join("/");
				const arg = args[0] || {};
				const fetchOptions = args[1] || {};
				const { query, fetchOptions: argFetchOptions, ...body } = arg;
				const options = {
					...fetchOptions,
					...argFetchOptions
				};
				const method = getMethod(routePath, knownPathMethods, arg);
				return await client(routePath, {
					...options,
					body: method === "GET" ? void 0 : {
						...body,
						...options?.body || {}
					},
					query: query || options?.query,
					method,
					async onSuccess(context) {
						await options?.onSuccess?.(context);
						if (!atomListeners || options.disableSignal) return;
						/**
						* We trigger listeners
						*/
						const matches = atomListeners.filter((s) => s.matcher(routePath));
						if (!matches.length) return;
						const visited = /* @__PURE__ */ new Set();
						for (const match of matches) {
							const signal = atoms[match.signal];
							if (!signal) return;
							if (visited.has(match.signal)) continue;
							visited.add(match.signal);
							/**
							* To avoid race conditions we set the signal in a setTimeout
							*/
							const val = signal.get();
							setTimeout(() => {
								signal.set(!val);
							}, 10);
							match.callback?.(routePath);
						}
					}
				});
			}
		});
	}
	return createProxy();
}
/**
* Subscribe to store changes and get store's value.
*
* Can be used with store builder too.
*
* ```js
* import { useStore } from 'nanostores/react'
*
* import { router } from '../store/router'
*
* export const Layout = () => {
*   let page = useStore(router)
*   if (page.route === 'home') {
*     return <HomePage />
*   } else {
*     return <Error404 />
*   }
* }
* ```
*
* @param store Store instance.
* @returns Store value.
*/
function useStore(store, options = {}) {
	const snapshotRef = (0, import_react.useRef)(store.get());
	const { keys, deps = [store, keys] } = options;
	const subscribe = (0, import_react.useCallback)((onChange) => {
		const emitChange = (value) => {
			if (snapshotRef.current === value) return;
			snapshotRef.current = value;
			onChange();
		};
		emitChange(store.value);
		if (keys?.length) return listenKeys(store, keys, emitChange);
		return store.listen(emitChange);
	}, deps);
	const get = () => snapshotRef.current;
	return (0, import_react.useSyncExternalStore)(subscribe, get, get);
}
function getAtomKey(str) {
	return `use${capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
	const { pluginPathMethods, pluginsActions, pluginsAtoms, $fetch, $store, atomListeners } = getClientConfig(options);
	const resolvedHooks = {};
	for (const [key, value] of Object.entries(pluginsAtoms)) resolvedHooks[getAtomKey(key)] = () => useStore(value);
	return createDynamicPathProxy({
		...pluginsActions,
		...resolvedHooks,
		$fetch,
		$store
	}, $fetch, pluginPathMethods, pluginsAtoms, atomListeners);
}
var authClient = createAuthClient();
var periodDetails = [{
	id: "morning",
	label: "Morning",
	helper: "Before the first prep round"
}, {
	id: "evening",
	label: "Evening",
	helper: "For the afternoon round"
}];
var dateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
var displayDateFormatter = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "Asia/Kolkata"
});
var todayKey = dateFormatter.format(/* @__PURE__ */ new Date());
var initialState = {
	user: null,
	defaults: {
		morning: "No drink",
		evening: "No drink"
	},
	entries: {}
};
function dateKeyOffset(offset) {
	const date = /* @__PURE__ */ new Date();
	date.setDate(date.getDate() - offset);
	return dateFormatter.format(date);
}
function displayDate(dateKey) {
	return displayDateFormatter.format(/* @__PURE__ */ new Date(`${dateKey}T12:00:00`));
}
function initials(name) {
	return name.split(" ").map((part) => part[0]).join("");
}
function readState() {
	return initialState;
}
function cx(...classes) {
	return classes.filter(Boolean).join(" ");
}
function countChoices(entries) {
	return periods.reduce((result, period) => {
		result[period] = drinks.reduce((counts, drink) => {
			counts[drink] = entries.filter((entry) => entry[period] === drink).length;
			return counts;
		}, {});
		return result;
	}, {});
}
function App() {
	const [state, setState] = (0, import_react.useState)(readState);
	const [view, setView] = (0, import_react.useState)("today");
	const [historyDate, setHistoryDate] = (0, import_react.useState)(dateKeyOffset(1));
	const [openPoll, setOpenPoll] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const { data: session, isPending: authPending } = authClient.useSession();
	const sessionUserId = session?.user?.id;
	const sessionUserName = session?.user?.name;
	const sessionUserEmail = session?.user?.email;
	const sessionUserImage = session?.user?.image;
	const todaysEntry = (state.user ? state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email) : void 0)?.choices ?? state.defaults;
	const todayPolls = state.entries[todayKey] ?? [];
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (!sessionUserId || !sessionUserName || !sessionUserEmail) {
			setState(initialState);
			return () => {
				cancelled = true;
			};
		}
		const user = {
			id: sessionUserId,
			name: sessionUserName,
			email: sessionUserEmail,
			image: sessionUserImage
		};
		setState((current) => ({
			...current,
			user
		}));
		getDrinkDay(todayKey).then((day) => {
			if (cancelled) return;
			setState((current) => ({
				...current,
				user,
				defaults: day.defaults,
				entries: {
					...current.entries,
					[todayKey]: day.responses
				}
			}));
			setError(null);
		}).catch((reason) => {
			if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load today's drinks");
		});
		return () => {
			cancelled = true;
		};
	}, [
		sessionUserEmail,
		sessionUserId,
		sessionUserImage,
		sessionUserName
	]);
	(0, import_react.useEffect)(() => {
		if (!sessionUserId || view !== "history") return;
		let cancelled = false;
		getDrinkDay(historyDate).then((day) => {
			if (cancelled) return;
			setState((current) => ({
				...current,
				defaults: day.defaults,
				entries: {
					...current.entries,
					[historyDate]: day.responses
				}
			}));
			setError(null);
		}).catch((reason) => {
			if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load history");
		});
		return () => {
			cancelled = true;
		};
	}, [
		historyDate,
		sessionUserId,
		view
	]);
	(0, import_react.useEffect)(() => {
		if (!sessionUserId || !openPoll || state.entries[openPoll.date]) return;
		let cancelled = false;
		getDrinkDay(openPoll.date).then((day) => {
			if (cancelled) return;
			setState((current) => ({
				...current,
				entries: {
					...current.entries,
					[openPoll.date]: day.responses
				}
			}));
		}).catch((reason) => {
			if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load poll details");
		});
		return () => {
			cancelled = true;
		};
	}, [
		openPoll,
		sessionUserId,
		state.entries
	]);
	function signIn() {
		authClient.signIn.social({
			provider: "google",
			callbackURL: "/"
		});
	}
	function signOut() {
		authClient.signOut();
		setState((current) => ({
			...current,
			user: null
		}));
	}
	function updateEntry(period, drink) {
		if (!state.user) return;
		const choices = {
			...(state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email))?.choices ?? state.defaults,
			[period]: drink
		};
		setState((current) => {
			if (!current.user) return current;
			const nextEntries = (current.entries[todayKey] ?? []).map((entry) => entry.user.email === current.user?.email ? {
				...entry,
				choices,
				sources: {
					...entry.sources,
					[period]: "manual"
				}
			} : entry);
			return {
				...current,
				entries: {
					...current.entries,
					[todayKey]: nextEntries
				}
			};
		});
		saveResponse({
			date: todayKey,
			period,
			drink
		}).then((day) => {
			setState((current) => ({
				...current,
				defaults: day.defaults,
				entries: {
					...current.entries,
					[todayKey]: day.responses
				}
			}));
			setError(null);
		}).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to save your drink"));
	}
	function updateDefault(period, drink) {
		setState((current) => ({
			...current,
			defaults: {
				...current.defaults,
				[period]: drink
			}
		}));
		saveDefault({
			period,
			drink
		}).then((defaults) => {
			setState((current) => ({
				...current,
				defaults
			}));
			setError(null);
		}).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to save your default"));
	}
	if (authPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoading, {});
	if (!session?.user || !state.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInPage, { signIn });
	const visiblePolls = view === "history" ? state.entries[historyDate] ?? [] : todayPolls;
	const openPollData = openPoll ? state.entries[openPoll.date] ?? [] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-svh bg-[#f6f5f1] text-[#2d2925] pb-20 lg:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-[#e6e0d6] bg-[#fffdf9]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-xl font-semibold tracking-[-0.02em]",
							children: "BrewBook"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden text-right sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: state.user.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#887f74]",
									children: state.user.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 place-items-center rounded-full bg-[#dfc5a5] text-xs font-semibold text-[#5a3c26]",
								children: initials(state.user.name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-8 place-items-center rounded-full text-[#887f74] transition hover:bg-[#f1ede6] hover:text-[#5a3c26]",
								onClick: signOut,
								type: "button",
								"aria-label": "Sign out",
								title: "Sign out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 })
							})
						]
					})]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-4 max-w-[1180px] px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]",
					role: "alert",
					children: error
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-[1180px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[190px_1fr] lg:gap-10 lg:px-8 lg:py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden lg:block lg:sticky lg:top-8 lg:h-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
						view,
						setView
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0",
					children: [
						view === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {
							entry: todaysEntry,
							todayPolls,
							updateEntry,
							onOpen: (period) => setOpenPoll({
								date: todayKey,
								period
							})
						}),
						view === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryView, {
							date: historyDate,
							setDate: setHistoryDate,
							polls: visiblePolls,
							onOpen: (period) => setOpenPoll({
								date: historyDate,
								period
							})
						}),
						view === "defaults" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultsView, {
							defaults: state.defaults,
							updateDefault
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-[#e6e0d6] bg-[#fffdf9]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:px-4 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
					view,
					setView
				})
			}),
			openPoll && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PollDetailsSheet, {
				date: openPoll.date,
				period: openPoll.period,
				polls: openPollData,
				onClose: () => setOpenPoll(null)
			})
		]
	});
}
function Nav({ view, setView }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid grid-cols-3 gap-2 lg:grid-cols-1",
		children: [
			{
				id: "today",
				label: "Today",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 18 })
			},
			{
				id: "history",
				label: "History",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { size: 18 })
			},
			{
				id: "defaults",
				label: "Defaults",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { size: 18 })
			}
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setView(item.id),
			type: "button",
			className: cx("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold transition lg:flex-row lg:justify-start lg:gap-2 lg:px-3 lg:text-sm", view === item.id ? "bg-[#5a3c26] text-white" : "text-[#887f74] hover:bg-[#f1ede6] hover:text-[#5a3c26]"),
			children: [
				item.icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
				view === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "ml-auto hidden lg:block",
					size: 15
				})
			]
		}, item.id))
	});
}
function BrandMark({ className = "size-8", iconSize = 17 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx("grid place-items-center rounded-[10px] bg-[#5a3c26] text-[#fff9ef]", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, {
			size: iconSize,
			strokeWidth: 2.2
		})
	});
}
function AuthLoading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-svh place-items-center bg-[#f6f5f1]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-[#887f74]",
				children: "Checking your account..."
			})]
		})
	});
}
function SignInPage({ signIn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-svh place-items-center bg-[#5a3c26] px-5 py-10 text-[#fff9ef]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex w-full max-w-sm flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {
					className: "size-16 rounded-[18px]",
					iconSize: 30
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-7 font-serif text-5xl leading-tight",
					children: "BrewBook"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xs text-[15px] leading-6 text-[#e7d8c4]",
					children: "Your office drink register, ready when you are."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: signIn,
					type: "button",
					className: "mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#fff9ef] text-sm font-semibold text-[#5a3c26] shadow-[0_12px_30px_rgba(38,24,16,0.22)] transition hover:bg-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-6 place-items-center rounded-md bg-white text-[#4285f4] font-bold shadow-sm",
							children: "G"
						}),
						"Continue with Google",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 17 })
					]
				})
			]
		})
	});
}
function TodayView({ entry, todayPolls, updateEntry, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: displayDate(todayKey),
			title: "Today",
			action: `${todayPolls.length} people`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: periodDetails.map((period) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrinkPoll, {
				period,
				polls: todayPolls,
				selected: entry[period.id],
				editable: true,
				onSelect: (drink) => updateEntry(period.id, drink),
				onOpen: () => onOpen(period.id)
			}, period.id))
		})]
	});
}
function HistoryView({ date, setDate, polls, onOpen }) {
	const dates = Array.from({ length: 7 }, (_, index) => dateKeyOffset(index + 1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "History",
				title: displayDate(date),
				action: polls.length ? `${polls.length} people` : "No responses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-0 sm:-mx-6 sm:px-6",
				children: dates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setDate(item),
					type: "button",
					className: cx("shrink-0 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition", date === item ? "border-[#5a3c26] bg-[#5a3c26] text-white" : "border-[#e6e0d6] bg-[#fffdf9] text-[#887f74]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-normal opacity-75",
						children: displayDate(item).split(",")[0]
					}), displayDate(item).split(", ").slice(1).join(", ")]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid gap-3",
				children: periodDetails.map((period) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrinkPoll, {
					period,
					polls,
					editable: false,
					onOpen: () => onOpen(period.id)
				}, period.id))
			})
		]
	});
}
function DefaultsView({ defaults, updateDefault }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Defaults",
			title: "Default drinks",
			action: "Saved automatically"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: periodDetails.map((period) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultDrinkSetting, {
				period,
				selected: defaults[period.id],
				onSelect: (drink) => updateDefault(period.id, drink)
			}, period.id))
		})]
	});
}
function DefaultDrinkSetting({ period, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_30px_rgba(77,57,38,0.04)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 shrink-0 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { size: 17 })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-sm font-semibold text-[#33271f]",
				children: [period.label, " default"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-[#9a9084]",
				children: period.helper
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5",
			children: drinks.map((drink) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelect(drink),
				type: "button",
				className: cx("flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition", selected === drink ? "border-[#a36f43] bg-[#f6ece1] text-[#68452e]" : "border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]"),
				children: [drink, selected === drink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 })]
			}, drink))
		})]
	});
}
function PageHeader({ eyebrow, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-4 border-b border-[#e6e0d6] pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-serif text-3xl tracking-[-0.03em] text-[#33271f] sm:text-4xl",
			children: title
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-xs font-semibold text-[#9a9084]",
			children: action
		})]
	});
}
function DrinkPoll({ period, polls, selected, editable, onSelect, onOpen }) {
	const counts = countChoices(polls.map((entry) => entry.choices))[period.id];
	const total = polls.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] shadow-[0_8px_30px_rgba(77,57,38,0.04)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-4 border-b border-[#eee8df] px-4 py-3.5 sm:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { size: 16 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-sm font-semibold text-[#33271f]",
						children: [period.label, " drink poll"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-xs text-[#9a9084]",
						children: [
							total,
							" ",
							total === 1 ? "response" : "responses"
						]
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 p-3 sm:p-4",
				children: drinks.map((drink) => {
					const count = counts[drink];
					const percent = total ? Math.round(counts[drink] / total * 100) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: !editable,
						onClick: () => onSelect?.(drink),
						type: "button",
						className: cx("relative flex min-h-11 items-center justify-between overflow-hidden rounded-xl border px-3.5 text-left text-sm font-semibold", editable ? "transition hover:border-[#dbc9b6]" : "cursor-default", selected === drink ? "border-[#a36f43] bg-[#f6ece1] text-[#68452e]" : "border-[#eee8df] text-[#665b50]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-y-0 left-0 bg-[#f6ece1] transition-all",
								style: { width: editable ? selected === drink ? "100%" : "0%" : `${percent}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative",
								children: drink
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex items-center gap-2 text-xs text-[#887f74]",
								children: [count, selected === drink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-5 place-items-center rounded-full bg-[#a36f43] text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										size: 13,
										strokeWidth: 3
									})
								})]
							})
						]
					}, drink);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "mx-3 mb-3 flex min-h-11 w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-xl border border-[#e6e0d6] text-sm font-semibold text-[#68452e] transition hover:border-[#a36f43] hover:bg-[#fdf8f1] sm:mx-4 sm:mb-4 sm:w-[calc(100%-2rem)]",
				onClick: onOpen,
				type: "button",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 }), "View details"]
			})
		]
	});
}
function PollDetailsSheet({ date, period, polls, onClose }) {
	const periodInfo = periodDetails.find((item) => item.id === period);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-30 flex items-end p-0 sm:items-center sm:justify-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0 cursor-default bg-[#2d2925]/30",
			onClick: onClose,
			type: "button",
			"aria-label": "Close poll details"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative z-10 max-h-[88svh] w-full overflow-y-auto rounded-t-3xl bg-[#fffdf9] px-4 pb-6 pt-3 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-[#ddd3c7] sm:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between border-b border-[#eee8df] pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]",
							children: date === todayKey ? "Today" : displayDate(date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-1 font-serif text-2xl text-[#33271f]",
							children: [periodInfo?.label ?? period, " drink poll"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-[#9a9084]",
							children: [
								polls.length,
								" ",
								polls.length === 1 ? "response" : "responses"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "grid size-9 place-items-center rounded-full bg-[#f1ede6] text-[#887f74]",
						onClick: onClose,
						type: "button",
						"aria-label": "Close poll details",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-5",
					children: drinks.map((drink) => {
						const drinkPolls = polls.filter((item) => item.choices[period] === drink);
						if (!drinkPolls.length) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-base font-semibold text-[#5a3c26]",
							children: drink
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: drinkPolls.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl bg-[#f8f5f0] px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-8 shrink-0 place-items-center rounded-full bg-[#eee1d1] text-[11px] font-semibold text-[#68452e]",
										children: initials(item.user.name)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-semibold",
										children: item.user.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs text-[#887f74]",
									children: item.sources[period] === "default" ? "Default" : "Manual"
								})]
							}, item.user.email))
						})] }, drink);
					})
				})
			]
		})]
	});
}
var SplitComponent = App;
//#endregion
export { SplitComponent as component };
