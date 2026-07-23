//#region node_modules/.nitro/vite/services/ssr/assets/string-BjC7GJE-.js
function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
var WORD_PATTERN = /[\p{Ll}\d]+|\p{Lu}+(?!\p{Ll})|\p{Lu}[\p{Ll}\d]+|\p{Lo}+/gu;
var APOSTROPHE_PATTERN = /['\u2019]/g;
function splitWords(input) {
	return input.replace(APOSTROPHE_PATTERN, "").match(WORD_PATTERN) ?? [];
}
function toKebabCase(input) {
	return splitWords(input).map((word) => word.toLowerCase()).join("-");
}
//#endregion
export { toKebabCase as n, capitalizeFirstLetter as t };
