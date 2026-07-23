import { n as logger, r as BetterAuthError, t as createAdapterFactory } from "./core+[...].mjs";
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
	if (!value || typeof value !== "object") return false;
	if (value instanceof type) return true;
	if (!Object.prototype.hasOwnProperty.call(type, entityKind)) throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
	let cls = Object.getPrototypeOf(value).constructor;
	if (cls) while (cls) {
		if (entityKind in cls && cls[entityKind] === type[entityKind]) return true;
		cls = Object.getPrototypeOf(cls);
	}
	return false;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/column.js
var Column = class {
	constructor(table, config) {
		this.table = table;
		this.config = config;
		this.name = config.name;
		this.keyAsName = config.keyAsName;
		this.notNull = config.notNull;
		this.default = config.default;
		this.defaultFn = config.defaultFn;
		this.onUpdateFn = config.onUpdateFn;
		this.hasDefault = config.hasDefault;
		this.primary = config.primaryKey;
		this.isUnique = config.isUnique;
		this.uniqueName = config.uniqueName;
		this.uniqueType = config.uniqueType;
		this.dataType = config.dataType;
		this.columnType = config.columnType;
		this.generated = config.generated;
		this.generatedIdentity = config.generatedIdentity;
	}
	static [entityKind] = "Column";
	name;
	keyAsName;
	primary;
	notNull;
	default;
	defaultFn;
	onUpdateFn;
	hasDefault;
	isUnique;
	uniqueName;
	uniqueType;
	dataType;
	columnType;
	enumValues = void 0;
	generated = void 0;
	generatedIdentity = void 0;
	config;
	mapFromDriverValue(value) {
		return value;
	}
	mapToDriverValue(value) {
		return value;
	}
	shouldDisableInsert() {
		return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
	}
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
	static [entityKind] = "ColumnBuilder";
	config;
	constructor(name, dataType, columnType) {
		this.config = {
			name,
			keyAsName: name === "",
			notNull: false,
			default: void 0,
			hasDefault: false,
			primaryKey: false,
			isUnique: false,
			uniqueName: void 0,
			uniqueType: void 0,
			dataType,
			columnType,
			generated: void 0
		};
	}
	/**
	* Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
	*
	* @example
	* ```ts
	* const users = pgTable('users', {
	* 	id: integer('id').$type<UserId>().primaryKey(),
	* 	details: json('details').$type<UserDetails>().notNull(),
	* });
	* ```
	*/
	$type() {
		return this;
	}
	/**
	* Adds a `not null` clause to the column definition.
	*
	* Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
	*/
	notNull() {
		this.config.notNull = true;
		return this;
	}
	/**
	* Adds a `default <value>` clause to the column definition.
	*
	* Affects the `insert` model of the table - columns *with* `default` are optional on insert.
	*
	* If you need to set a dynamic default value, use {@link $defaultFn} instead.
	*/
	default(value) {
		this.config.default = value;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Adds a dynamic default value to the column.
	* The function will be called when the row is inserted, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$defaultFn(fn) {
		this.config.defaultFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $defaultFn}.
	*/
	$default = this.$defaultFn;
	/**
	* Adds a dynamic update value to the column.
	* The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
	* If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$onUpdateFn(fn) {
		this.config.onUpdateFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $onUpdateFn}.
	*/
	$onUpdate = this.$onUpdateFn;
	/**
	* Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
	*
	* In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
	*/
	primaryKey() {
		this.config.primaryKey = true;
		this.config.notNull = true;
		return this;
	}
	/** @internal Sets the name of the column to the key within the table definition if a name was not given. */
	setName(name) {
		if (this.config.name !== "") return;
		this.config.name = name;
	}
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
	static [entityKind] = "PgForeignKeyBuilder";
	/** @internal */
	reference;
	/** @internal */
	_onUpdate = "no action";
	/** @internal */
	_onDelete = "no action";
	constructor(config, actions) {
		this.reference = () => {
			const { name, columns, foreignColumns } = config();
			return {
				name,
				columns,
				foreignTable: foreignColumns[0].table,
				foreignColumns
			};
		};
		if (actions) {
			this._onUpdate = actions.onUpdate;
			this._onDelete = actions.onDelete;
		}
	}
	onUpdate(action) {
		this._onUpdate = action === void 0 ? "no action" : action;
		return this;
	}
	onDelete(action) {
		this._onDelete = action === void 0 ? "no action" : action;
		return this;
	}
	/** @internal */
	build(table) {
		return new ForeignKey(table, this);
	}
};
var ForeignKey = class {
	constructor(table, builder) {
		this.table = table;
		this.reference = builder.reference;
		this.onUpdate = builder._onUpdate;
		this.onDelete = builder._onDelete;
	}
	static [entityKind] = "PgForeignKey";
	reference;
	onUpdate;
	onDelete;
	getName() {
		const { name, columns, foreignColumns } = this.reference();
		const columnNames = columns.map((column) => column.name);
		const foreignColumnNames = foreignColumns.map((column) => column.name);
		const chunks = [
			this.table[TableName],
			...columnNames,
			foreignColumns[0].table[TableName],
			...foreignColumnNames
		];
		return name ?? `${chunks.join("_")}_fk`;
	}
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
	return fn(...args);
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/pg-core/unique-constraint.js
function unique(name) {
	return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
	return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder = class {
	constructor(columns, name) {
		this.name = name;
		this.columns = columns;
	}
	static [entityKind] = "PgUniqueConstraintBuilder";
	/** @internal */
	columns;
	/** @internal */
	nullsNotDistinctConfig = false;
	nullsNotDistinct() {
		this.nullsNotDistinctConfig = true;
		return this;
	}
	/** @internal */
	build(table) {
		return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
	}
};
var UniqueOnConstraintBuilder = class {
	static [entityKind] = "PgUniqueOnConstraintBuilder";
	/** @internal */
	name;
	constructor(name) {
		this.name = name;
	}
	on(...columns) {
		return new UniqueConstraintBuilder(columns, this.name);
	}
};
var UniqueConstraint = class {
	constructor(table, columns, nullsNotDistinct, name) {
		this.table = table;
		this.columns = columns;
		this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
		this.nullsNotDistinct = nullsNotDistinct;
	}
	static [entityKind] = "PgUniqueConstraint";
	columns;
	name;
	nullsNotDistinct = false;
	getName() {
		return this.name;
	}
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
	for (let i = startFrom; i < arrayString.length; i++) {
		const char = arrayString[i];
		if (char === "\\") {
			i++;
			continue;
		}
		if (char === "\"") return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
		if (inQuotes) continue;
		if (char === "," || char === "}") return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
	}
	return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
	const result = [];
	let i = startFrom;
	let lastCharIsComma = false;
	while (i < arrayString.length) {
		const char = arrayString[i];
		if (char === ",") {
			if (lastCharIsComma || i === startFrom) result.push("");
			lastCharIsComma = true;
			i++;
			continue;
		}
		lastCharIsComma = false;
		if (char === "\\") {
			i += 2;
			continue;
		}
		if (char === "\"") {
			const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
			result.push(value2);
			i = startFrom2;
			continue;
		}
		if (char === "}") return [result, i + 1];
		if (char === "{") {
			const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
			result.push(value2);
			i = startFrom2;
			continue;
		}
		const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
		result.push(value);
		i = newStartFrom;
	}
	return [result, i];
}
function parsePgArray(arrayString) {
	const [result] = parsePgNestedArray(arrayString, 1);
	return result;
}
function makePgArray(array) {
	return `{${array.map((item) => {
		if (Array.isArray(item)) return makePgArray(item);
		if (typeof item === "string") return `"${item.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
		return `${item}`;
	}).join(",")}}`;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
	foreignKeyConfigs = [];
	static [entityKind] = "PgColumnBuilder";
	array(size) {
		return new PgArrayBuilder(this.config.name, this, size);
	}
	references(ref, actions = {}) {
		this.foreignKeyConfigs.push({
			ref,
			actions
		});
		return this;
	}
	unique(name, config) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		this.config.uniqueType = config?.nulls;
		return this;
	}
	generatedAlwaysAs(as) {
		this.config.generated = {
			as,
			type: "always",
			mode: "stored"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return iife((ref2, actions2) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref2();
					return {
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (actions2.onUpdate) builder.onUpdate(actions2.onUpdate);
				if (actions2.onDelete) builder.onDelete(actions2.onDelete);
				return builder.build(table);
			}, ref, actions);
		});
	}
	/** @internal */
	buildExtraConfigColumn(table) {
		return new ExtraConfigColumn(table, this.config);
	}
};
var PgColumn = class extends Column {
	constructor(table, config) {
		if (!config.uniqueName) config.uniqueName = uniqueKeyName(table, [config.name]);
		super(table, config);
		this.table = table;
	}
	static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
	static [entityKind] = "ExtraConfigColumn";
	getSQLType() {
		return this.getSQLType();
	}
	indexConfig = {
		order: this.config.order ?? "asc",
		nulls: this.config.nulls ?? "last",
		opClass: this.config.opClass
	};
	defaultConfig = {
		order: "asc",
		nulls: "last",
		opClass: void 0
	};
	asc() {
		this.indexConfig.order = "asc";
		return this;
	}
	desc() {
		this.indexConfig.order = "desc";
		return this;
	}
	nullsFirst() {
		this.indexConfig.nulls = "first";
		return this;
	}
	nullsLast() {
		this.indexConfig.nulls = "last";
		return this;
	}
	/**
	* ### PostgreSQL documentation quote
	*
	* > An operator class with optional parameters can be specified for each column of an index.
	* The operator class identifies the operators to be used by the index for that column.
	* For example, a B-tree index on four-byte integers would use the int4_ops class;
	* this operator class includes comparison functions for four-byte integers.
	* In practice the default operator class for the column's data type is usually sufficient.
	* The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
	* For example, we might want to sort a complex-number data type either by absolute value or by real part.
	* We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
	* More information about operator classes check:
	*
	* ### Useful links
	* https://www.postgresql.org/docs/current/sql-createindex.html
	*
	* https://www.postgresql.org/docs/current/indexes-opclass.html
	*
	* https://www.postgresql.org/docs/current/xindex.html
	*
	* ### Additional types
	* If you have the `pg_vector` extension installed in your database, you can use the
	* `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
	*
	* **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
	*
	* @param opClass
	* @returns
	*/
	op(opClass) {
		this.indexConfig.opClass = opClass;
		return this;
	}
};
var IndexedColumn = class {
	static [entityKind] = "IndexedColumn";
	constructor(name, keyAsName, type, indexConfig) {
		this.name = name;
		this.keyAsName = keyAsName;
		this.type = type;
		this.indexConfig = indexConfig;
	}
	name;
	keyAsName;
	type;
	indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgArrayBuilder";
	constructor(name, baseBuilder, size) {
		super(name, "array", "PgArray");
		this.config.baseBuilder = baseBuilder;
		this.config.size = size;
	}
	/** @internal */
	build(table) {
		const baseColumn = this.config.baseBuilder.build(table);
		return new PgArray(table, this.config, baseColumn);
	}
};
var PgArray = class PgArray extends PgColumn {
	constructor(table, config, baseColumn, range) {
		super(table, config);
		this.baseColumn = baseColumn;
		this.range = range;
		this.size = config.size;
	}
	size;
	static [entityKind] = "PgArray";
	getSQLType() {
		return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") value = parsePgArray(value);
		return value.map((v) => this.baseColumn.mapFromDriverValue(v));
	}
	mapToDriverValue(value, isNestedArray = false) {
		const a = value.map((v) => v === null ? null : is(this.baseColumn, PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v));
		if (isNestedArray) return a;
		return makePgArray(a);
	}
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/pg-core/columns/enum.js
var PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgEnumObjectColumnBuilder";
	constructor(name, enumInstance) {
		super(name, "string", "PgEnumObjectColumn");
		this.config.enum = enumInstance;
	}
	/** @internal */
	build(table) {
		return new PgEnumObjectColumn(table, this.config);
	}
};
var PgEnumObjectColumn = class extends PgColumn {
	static [entityKind] = "PgEnumObjectColumn";
	enum;
	enumValues = this.config.enum.enumValues;
	constructor(table, config) {
		super(table, config);
		this.enum = config.enum;
	}
	getSQLType() {
		return this.enum.enumName;
	}
};
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
	return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgEnumColumnBuilder";
	constructor(name, enumInstance) {
		super(name, "string", "PgEnumColumn");
		this.config.enum = enumInstance;
	}
	/** @internal */
	build(table) {
		return new PgEnumColumn(table, this.config);
	}
};
var PgEnumColumn = class extends PgColumn {
	static [entityKind] = "PgEnumColumn";
	enum = this.config.enum;
	enumValues = this.config.enum.enumValues;
	constructor(table, config) {
		super(table, config);
		this.enum = config.enum;
	}
	getSQLType() {
		return this.enum.enumName;
	}
};
function pgEnum(enumName, input) {
	return Array.isArray(input) ? pgEnumWithSchema(enumName, [...input], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
}
function pgEnumWithSchema(enumName, values, schema) {
	const enumInstance = Object.assign((name) => new PgEnumColumnBuilder(name ?? "", enumInstance), {
		enumName,
		enumValues: values,
		schema,
		[isPgEnumSym]: true
	});
	return enumInstance;
}
function pgEnumObjectWithSchema(enumName, values, schema) {
	const enumInstance = Object.assign((name) => new PgEnumObjectColumnBuilder(name ?? "", enumInstance), {
		enumName,
		enumValues: Object.values(values),
		schema,
		[isPgEnumSym]: true
	});
	return enumInstance;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/subquery.js
var Subquery = class {
	static [entityKind] = "Subquery";
	constructor(sql, fields, alias, isWith = false, usedTables = []) {
		this._ = {
			brand: "Subquery",
			sql,
			selectedFields: fields,
			alias,
			isWith,
			usedTables
		};
	}
};
var WithSubquery = class extends Subquery {
	static [entityKind] = "WithSubquery";
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/tracing.js
var tracer = { startActiveSpan(name, fn) {
	return fn();
} };
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
	static [entityKind] = "Table";
	/** @internal */
	static Symbol = {
		Name: TableName,
		Schema,
		OriginalName,
		Columns,
		ExtraConfigColumns,
		BaseName,
		IsAlias,
		ExtraConfigBuilder
	};
	/**
	* @internal
	* Can be changed if the table is aliased.
	*/
	[TableName];
	/**
	* @internal
	* Used to store the original name of the table, before any aliasing.
	*/
	[OriginalName];
	/** @internal */
	[Schema];
	/** @internal */
	[Columns];
	/** @internal */
	[ExtraConfigColumns];
	/**
	*  @internal
	* Used to store the table name before the transformation via the `tableCreator` functions.
	*/
	[BaseName];
	/** @internal */
	[IsAlias] = false;
	/** @internal */
	[IsDrizzleTable] = true;
	/** @internal */
	[ExtraConfigBuilder] = void 0;
	constructor(name, schema, baseName) {
		this[TableName] = this[OriginalName] = name;
		this[Schema] = schema;
		this[BaseName] = baseName;
	}
};
function getTableName(table) {
	return table[TableName];
}
function getTableUniqueName(table) {
	return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
	return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
	const result = {
		sql: "",
		params: []
	};
	for (const query of queries) {
		result.sql += query.sql;
		result.params.push(...query.params);
		if (query.typings?.length) {
			if (!result.typings) result.typings = [];
			result.typings.push(...query.typings);
		}
	}
	return result;
}
var StringChunk = class {
	static [entityKind] = "StringChunk";
	value;
	constructor(value) {
		this.value = Array.isArray(value) ? value : [value];
	}
	getSQL() {
		return new SQL([this]);
	}
};
var SQL = class SQL {
	constructor(queryChunks) {
		this.queryChunks = queryChunks;
		for (const chunk of queryChunks) if (is(chunk, Table)) {
			const schemaName = chunk[Table.Symbol.Schema];
			this.usedTables.push(schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
		}
	}
	static [entityKind] = "SQL";
	/** @internal */
	decoder = noopDecoder;
	shouldInlineParams = false;
	/** @internal */
	usedTables = [];
	append(query) {
		this.queryChunks.push(...query.queryChunks);
		return this;
	}
	toQuery(config) {
		return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
			const query = this.buildQueryFromSourceParams(this.queryChunks, config);
			span?.setAttributes({
				"drizzle.query.text": query.sql,
				"drizzle.query.params": JSON.stringify(query.params)
			});
			return query;
		});
	}
	buildQueryFromSourceParams(chunks, _config) {
		const config = Object.assign({}, _config, {
			inlineParams: _config.inlineParams || this.shouldInlineParams,
			paramStartIndex: _config.paramStartIndex || { value: 0 }
		});
		const { casing, escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config;
		return mergeQueries(chunks.map((chunk) => {
			if (is(chunk, StringChunk)) return {
				sql: chunk.value.join(""),
				params: []
			};
			if (is(chunk, Name)) return {
				sql: escapeName(chunk.value),
				params: []
			};
			if (chunk === void 0) return {
				sql: "",
				params: []
			};
			if (Array.isArray(chunk)) {
				const result = [new StringChunk("(")];
				for (const [i, p] of chunk.entries()) {
					result.push(p);
					if (i < chunk.length - 1) result.push(new StringChunk(", "));
				}
				result.push(new StringChunk(")"));
				return this.buildQueryFromSourceParams(result, config);
			}
			if (is(chunk, SQL)) return this.buildQueryFromSourceParams(chunk.queryChunks, {
				...config,
				inlineParams: inlineParams || chunk.shouldInlineParams
			});
			if (is(chunk, Table)) {
				const schemaName = chunk[Table.Symbol.Schema];
				const tableName = chunk[Table.Symbol.Name];
				return {
					sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
					params: []
				};
			}
			if (is(chunk, Column)) {
				const columnName = casing.getColumnCasing(chunk);
				if (_config.invokeSource === "indexes") return {
					sql: escapeName(columnName),
					params: []
				};
				const schemaName = chunk.table[Table.Symbol.Schema];
				return {
					sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
					params: []
				};
			}
			if (is(chunk, View)) {
				const schemaName = chunk[ViewBaseConfig].schema;
				const viewName = chunk[ViewBaseConfig].name;
				return {
					sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
					params: []
				};
			}
			if (is(chunk, Param)) {
				if (is(chunk.value, Placeholder)) return {
					sql: escapeParam(paramStartIndex.value++, chunk),
					params: [chunk],
					typings: ["none"]
				};
				const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
				if (is(mappedValue, SQL)) return this.buildQueryFromSourceParams([mappedValue], config);
				if (inlineParams) return {
					sql: this.mapInlineParam(mappedValue, config),
					params: []
				};
				let typings = ["none"];
				if (prepareTyping) typings = [prepareTyping(chunk.encoder)];
				return {
					sql: escapeParam(paramStartIndex.value++, mappedValue),
					params: [mappedValue],
					typings
				};
			}
			if (is(chunk, Placeholder)) return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk],
				typings: ["none"]
			};
			if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) return {
				sql: escapeName(chunk.fieldAlias),
				params: []
			};
			if (is(chunk, Subquery)) {
				if (chunk._.isWith) return {
					sql: escapeName(chunk._.alias),
					params: []
				};
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk._.sql,
					new StringChunk(") "),
					new Name(chunk._.alias)
				], config);
			}
			if (isPgEnum(chunk)) {
				if (chunk.schema) return {
					sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
					params: []
				};
				return {
					sql: escapeName(chunk.enumName),
					params: []
				};
			}
			if (isSQLWrapper(chunk)) {
				if (chunk.shouldOmitSQLParens?.()) return this.buildQueryFromSourceParams([chunk.getSQL()], config);
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk.getSQL(),
					new StringChunk(")")
				], config);
			}
			if (inlineParams) return {
				sql: this.mapInlineParam(chunk, config),
				params: []
			};
			return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk],
				typings: ["none"]
			};
		}));
	}
	mapInlineParam(chunk, { escapeString }) {
		if (chunk === null) return "null";
		if (typeof chunk === "number" || typeof chunk === "boolean") return chunk.toString();
		if (typeof chunk === "string") return escapeString(chunk);
		if (typeof chunk === "object") {
			const mappedValueAsString = chunk.toString();
			if (mappedValueAsString === "[object Object]") return escapeString(JSON.stringify(chunk));
			return escapeString(mappedValueAsString);
		}
		throw new Error("Unexpected param value: " + chunk);
	}
	getSQL() {
		return this;
	}
	as(alias) {
		if (alias === void 0) return this;
		return new SQL.Aliased(this, alias);
	}
	mapWith(decoder) {
		this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
		return this;
	}
	inlineParams() {
		this.shouldInlineParams = true;
		return this;
	}
	/**
	* This method is used to conditionally include a part of the query.
	*
	* @param condition - Condition to check
	* @returns itself if the condition is `true`, otherwise `undefined`
	*/
	if(condition) {
		return condition ? this : void 0;
	}
};
var Name = class {
	constructor(value) {
		this.value = value;
	}
	static [entityKind] = "Name";
	brand;
	getSQL() {
		return new SQL([this]);
	}
};
function isDriverValueEncoder(value) {
	return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = { mapFromDriverValue: (value) => value };
var noopEncoder = { mapToDriverValue: (value) => value };
({
	...noopDecoder,
	...noopEncoder
});
var Param = class {
	/**
	* @param value - Parameter value
	* @param encoder - Encoder to convert the value to a driver parameter
	*/
	constructor(value, encoder = noopEncoder) {
		this.value = value;
		this.encoder = encoder;
	}
	static [entityKind] = "Param";
	brand;
	getSQL() {
		return new SQL([this]);
	}
};
function sql(strings, ...params) {
	const queryChunks = [];
	if (params.length > 0 || strings.length > 0 && strings[0] !== "") queryChunks.push(new StringChunk(strings[0]));
	for (const [paramIndex, param2] of params.entries()) queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
	return new SQL(queryChunks);
}
((sql2) => {
	function empty() {
		return new SQL([]);
	}
	sql2.empty = empty;
	function fromList(list) {
		return new SQL(list);
	}
	sql2.fromList = fromList;
	function raw(str) {
		return new SQL([new StringChunk(str)]);
	}
	sql2.raw = raw;
	function join(chunks, separator) {
		const result = [];
		for (const [i, chunk] of chunks.entries()) {
			if (i > 0 && separator !== void 0) result.push(separator);
			result.push(chunk);
		}
		return new SQL(result);
	}
	sql2.join = join;
	function identifier(value) {
		return new Name(value);
	}
	sql2.identifier = identifier;
	function placeholder2(name2) {
		return new Placeholder(name2);
	}
	sql2.placeholder = placeholder2;
	function param2(value, encoder) {
		return new Param(value, encoder);
	}
	sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
	class Aliased {
		constructor(sql2, fieldAlias) {
			this.sql = sql2;
			this.fieldAlias = fieldAlias;
		}
		static [entityKind] = "SQL.Aliased";
		/** @internal */
		isSelectionField = false;
		getSQL() {
			return this.sql;
		}
		/** @internal */
		clone() {
			return new Aliased(this.sql, this.fieldAlias);
		}
	}
	SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
	constructor(name2) {
		this.name = name2;
	}
	static [entityKind] = "Placeholder";
	getSQL() {
		return new SQL([this]);
	}
};
function fillPlaceholders(params, values) {
	return params.map((p) => {
		if (is(p, Placeholder)) {
			if (!(p.name in values)) throw new Error(`No value for placeholder "${p.name}" was provided`);
			return values[p.name];
		}
		if (is(p, Param) && is(p.value, Placeholder)) {
			if (!(p.value.name in values)) throw new Error(`No value for placeholder "${p.value.name}" was provided`);
			return p.encoder.mapToDriverValue(values[p.value.name]);
		}
		return p;
	});
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
	static [entityKind] = "View";
	/** @internal */
	[ViewBaseConfig];
	/** @internal */
	[IsDrizzleView] = true;
	constructor({ name: name2, schema, selectedFields, query }) {
		this[ViewBaseConfig] = {
			name: name2,
			originalName: name2,
			schema,
			selectedFields,
			query,
			isExisting: !query,
			isAlias: false
		};
	}
	getSQL() {
		return new SQL([this]);
	}
};
Column.prototype.getSQL = function() {
	return new SQL([this]);
};
Table.prototype.getSQL = function() {
	return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
	return new SQL([this]);
};
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
	if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) return new Param(value, column);
	return value;
}
var eq = (left, right) => {
	return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
	return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions, new StringChunk(" and ")),
		new StringChunk(")")
	]);
}
function or(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions, new StringChunk(" or ")),
		new StringChunk(")")
	]);
}
function not(condition) {
	return sql`not ${condition}`;
}
var gt = (left, right) => {
	return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
	return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
	return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
	return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`false`;
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`true`;
		return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
	return sql`${value} is null`;
}
function isNotNull(value) {
	return sql`${value} is not null`;
}
function exists(subquery) {
	return sql`exists ${subquery}`;
}
function notExists(subquery) {
	return sql`not exists ${subquery}`;
}
function between(column, min, max) {
	return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
	return sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
	return sql`${column} like ${value}`;
}
function notLike(column, value) {
	return sql`${column} not like ${value}`;
}
function ilike(column, value) {
	return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
	return sql`${column} not ilike ${value}`;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
	return sql`${column} asc`;
}
function desc(column) {
	return sql`${column} desc`;
}
//#endregion
//#region node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_kysely@0.29.4_pg@8.22.0/node_modules/drizzle-orm/sql/functions/aggregate.js
function count(expression) {
	return sql`count(${expression || sql.raw("*")})`.mapWith(Number);
}
//#endregion
//#region node_modules/.pnpm/@better-auth+drizzle-adapter@1.6.23_@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@_d8a71d9115bba2055ebbf4e08c4d443d/node_modules/@better-auth/drizzle-adapter/dist/index.mjs
/**
* Case-insensitive LIKE/ILIKE for pattern matching.
* Uses ILIKE on PostgreSQL, LOWER()+LIKE on MySQL/SQLite.
*/
function insensitiveIlike(column, pattern, provider) {
	return provider === "pg" ? ilike(column, pattern) : sql`LOWER(${column}) LIKE LOWER(${pattern})`;
}
/**
* Case-insensitive IN for string arrays.
*/
function insensitiveInArray(column, values) {
	if (values.length === 0) return sql`false`;
	return sql`LOWER(${column}) IN (${sql.join(values.map((v) => sql`LOWER(${v})`), sql`, `)})`;
}
/**
* Case-insensitive NOT IN for string arrays.
*/
function insensitiveNotInArray(column, values) {
	if (values.length === 0) return sql`true`;
	return sql`LOWER(${column}) NOT IN (${sql.join(values.map((v) => sql`LOWER(${v})`), sql`, `)})`;
}
/**
* Case-insensitive equality for strings.
*/
function insensitiveEq(column, value) {
	return sql`LOWER(${column}) = LOWER(${value})`;
}
/**
* Case-insensitive inequality for strings.
*/
function insensitiveNe(column, value) {
	return sql`LOWER(${column}) <> LOWER(${value})`;
}
/**
* Derive the number of affected rows from a Drizzle write result.
*
* Drizzle returns the raw per-driver result for a non-returning write, so the
* count lives under a different field per driver: node-postgres / neon expose
* `rowCount`, postgres-js / bun-sql carry `count` on an Array subclass, mysql2
* reports `affectedRows` (in a result-header array), planetscale and other
* serverless drivers use `rowsAffected`, better-sqlite3 uses `changes`, and
* Cloudflare D1 nests the count under `meta.changes`. This normalizes them so
* write methods that depend on affected rows honor the adapter contract instead
* of leaking the raw driver result.
*/
function getAffectedRowCount(result, operation, context) {
	let count = 0;
	if (result && typeof result === "object" && "rowCount" in result) count = result.rowCount;
	else if (result && typeof result === "object" && typeof result.count === "number") count = result.count;
	else if (Array.isArray(result)) count = result.length > 0 && hasDriverRowCount(result[0]) ? readDriverRowCount(result[0]) : result.length;
	else if (hasDriverRowCount(result)) count = readDriverRowCount(result);
	if (typeof count !== "number") {
		logger.error(`[Drizzle Adapter] The result of the ${operation} operation is not a number. This is likely a bug in the adapter. Please report this issue to the Better Auth team.`, {
			result,
			...context
		});
		return 0;
	}
	return count;
}
function readDriverRowCount(result) {
	if (!result || typeof result !== "object") return void 0;
	if ("affectedRows" in result) return result.affectedRows;
	if ("rowsAffected" in result) return result.rowsAffected;
	if ("changes" in result) return result.changes;
	if ("meta" in result) {
		const meta = result.meta;
		if (meta && typeof meta === "object" && "changes" in meta) return meta.changes;
	}
}
function hasDriverRowCount(result) {
	return readDriverRowCount(result) !== void 0;
}
var drizzleAdapter = (db, config) => {
	let lazyOptions = null;
	let mysqlNoIdWarned = false;
	const createCustomAdapter = (db, inTransaction = false) => ({ getFieldName, getDefaultFieldName, getDefaultModelName, options, schema: baSchema }) => {
		if (config.provider === "mysql" && options.advanced?.database?.generateId === false && !mysqlNoIdWarned) {
			mysqlNoIdWarned = true;
			logger.warn("[Drizzle Adapter] MySQL does not support INSERT...RETURNING. With generateId set to false, the adapter uses best-effort fallback strategies (unique columns, full-field match) to retrieve inserted rows. For reliable behavior, use Better Auth's default ID generation, a custom generateId function, or generateId: \"serial\" for auto-increment.");
		}
		function getSchema(model) {
			const schema = config.schema || db._.fullSchema;
			if (!schema) throw new BetterAuthError("Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object.");
			const schemaModel = schema[model];
			if (!schemaModel) throw new BetterAuthError(`[# Drizzle Adapter]: The model "${model}" was not found in the schema object. Please pass the schema directly to the adapter options.`);
			return schemaModel;
		}
		const withReturning = async (model, builder, data, where) => {
			if (config.provider !== "mysql") return (await builder.returning())[0];
			await builder.execute();
			const schemaModel = getSchema(model);
			const builderVal = builder.config?.values;
			if (where?.length) {
				const clause = convertWhereClause(where.map((w) => {
					if (data[w.field] !== void 0) return {
						...w,
						value: data[w.field]
					};
					return w;
				}), model);
				return (await db.select().from(schemaModel).where(...clause))[0];
			}
			const fetchInserted = async (tx) => {
				const builderId = builderVal?.[0]?.id?.value;
				if (builderId) return (await tx.select().from(schemaModel).where(eq(schemaModel.id, builderId)).limit(1).execute())[0] ?? null;
				if (data.id) return (await tx.select().from(schemaModel).where(eq(schemaModel.id, data.id)).limit(1).execute())[0] ?? null;
				if (options.advanced?.database?.generateId === "serial" && schemaModel.id) {
					const lastId = (await tx.select({ id: sql`LAST_INSERT_ID()` }).from(schemaModel).limit(1).execute())[0]?.id;
					if (lastId) return (await tx.select().from(schemaModel).where(eq(schemaModel.id, lastId)).limit(1).execute())[0] ?? null;
				}
				const modelSchema = baSchema[getDefaultModelName(model)]?.fields;
				if (modelSchema) for (const [fieldKey, fieldAttr] of Object.entries(modelSchema)) {
					if (!fieldAttr.unique) continue;
					const dbFieldName = getFieldName({
						model,
						field: fieldKey
					});
					const val = data[dbFieldName];
					if (val === void 0 || val === null) continue;
					if (!schemaModel[dbFieldName]) continue;
					const res = await tx.select().from(schemaModel).where(eq(schemaModel[dbFieldName], val)).limit(1).execute();
					if (res[0]) return res[0];
				}
				const conditions = [];
				for (const [key, val] of Object.entries(data)) {
					if (val === void 0 || !schemaModel[key]) continue;
					conditions.push(val === null ? isNull(schemaModel[key]) : eq(schemaModel[key], val));
				}
				if (conditions.length > 0) {
					const combined = and(...conditions);
					if (combined) {
						const res = await tx.select().from(schemaModel).where(combined).limit(2).execute();
						if (res.length === 1) return res[0];
					}
				}
				logger.warn(`[Drizzle Adapter] Unable to safely identify the inserted "${model}" row on MySQL. Enable Better Auth ID generation or use generateId: "serial" for reliable behavior.`);
				return null;
			};
			return inTransaction ? fetchInserted(db) : db.transaction(fetchInserted);
		};
		function convertWhereClause(where, model) {
			const schemaModel = getSchema(model);
			if (!where) return [];
			if (where.length === 1) {
				const w = where[0];
				if (!w) return [];
				const field = getFieldName({
					model,
					field: w.field
				});
				if (!schemaModel[field]) throw new BetterAuthError(`The field "${w.field}" does not exist in the schema for the model "${model}". Please update your schema.`);
				const isInsensitive = (w.mode ?? "sensitive") === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
				if (w.operator === "in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "in" operator.`);
					if (isInsensitive) return [insensitiveInArray(schemaModel[field], w.value)];
					return [inArray(schemaModel[field], w.value)];
				}
				if (w.operator === "not_in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "not_in" operator.`);
					if (isInsensitive) return [insensitiveNotInArray(schemaModel[field], w.value)];
					return [notInArray(schemaModel[field], w.value)];
				}
				if (w.operator === "contains") {
					if (isInsensitive && typeof w.value === "string") return [insensitiveIlike(schemaModel[field], `%${w.value}%`, config.provider)];
					return [like(schemaModel[field], `%${w.value}%`)];
				}
				if (w.operator === "starts_with") {
					if (isInsensitive && typeof w.value === "string") return [insensitiveIlike(schemaModel[field], `${w.value}%`, config.provider)];
					return [like(schemaModel[field], `${w.value}%`)];
				}
				if (w.operator === "ends_with") {
					if (isInsensitive && typeof w.value === "string") return [insensitiveIlike(schemaModel[field], `%${w.value}`, config.provider)];
					return [like(schemaModel[field], `%${w.value}`)];
				}
				if (w.operator === "lt") return [lt(schemaModel[field], w.value)];
				if (w.operator === "lte") return [lte(schemaModel[field], w.value)];
				if (w.operator === "ne") {
					if (w.value === null) return [isNotNull(schemaModel[field])];
					if (isInsensitive && typeof w.value === "string") return [insensitiveNe(schemaModel[field], w.value)];
					return [ne(schemaModel[field], w.value)];
				}
				if (w.operator === "gt") return [gt(schemaModel[field], w.value)];
				if (w.operator === "gte") return [gte(schemaModel[field], w.value)];
				if (w.value === null) return [isNull(schemaModel[field])];
				if (isInsensitive && typeof w.value === "string") return [insensitiveEq(schemaModel[field], w.value)];
				return [eq(schemaModel[field], w.value)];
			}
			const andGroup = where.filter((w) => w.connector === "AND" || !w.connector);
			const orGroup = where.filter((w) => w.connector === "OR");
			const andClause = and(...andGroup.map((w) => {
				const field = getFieldName({
					model,
					field: w.field
				});
				const isInsensitive = (w.mode ?? "sensitive") === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
				if (w.operator === "in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "in" operator.`);
					if (isInsensitive) return insensitiveInArray(schemaModel[field], w.value);
					return inArray(schemaModel[field], w.value);
				}
				if (w.operator === "not_in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "not_in" operator.`);
					if (isInsensitive) return insensitiveNotInArray(schemaModel[field], w.value);
					return notInArray(schemaModel[field], w.value);
				}
				if (w.operator === "contains") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `%${w.value}%`, config.provider);
					return like(schemaModel[field], `%${w.value}%`);
				}
				if (w.operator === "starts_with") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `${w.value}%`, config.provider);
					return like(schemaModel[field], `${w.value}%`);
				}
				if (w.operator === "ends_with") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `%${w.value}`, config.provider);
					return like(schemaModel[field], `%${w.value}`);
				}
				if (w.operator === "lt") return lt(schemaModel[field], w.value);
				if (w.operator === "lte") return lte(schemaModel[field], w.value);
				if (w.operator === "gt") return gt(schemaModel[field], w.value);
				if (w.operator === "gte") return gte(schemaModel[field], w.value);
				if (w.operator === "ne") {
					if (w.value === null) return isNotNull(schemaModel[field]);
					if (isInsensitive && typeof w.value === "string") return insensitiveNe(schemaModel[field], w.value);
					return ne(schemaModel[field], w.value);
				}
				if (w.value === null) return isNull(schemaModel[field]);
				if (isInsensitive && typeof w.value === "string") return insensitiveEq(schemaModel[field], w.value);
				return eq(schemaModel[field], w.value);
			}));
			const orClause = or(...orGroup.map((w) => {
				const field = getFieldName({
					model,
					field: w.field
				});
				if (!schemaModel[field]) throw new BetterAuthError(`The field "${w.field}" does not exist in the schema for the model "${model}". Please update your schema.`);
				const isInsensitive = (w.mode ?? "sensitive") === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
				if (w.operator === "in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "in" operator.`);
					if (isInsensitive) return insensitiveInArray(schemaModel[field], w.value);
					return inArray(schemaModel[field], w.value);
				}
				if (w.operator === "not_in") {
					if (!Array.isArray(w.value)) throw new BetterAuthError(`The value for the field "${w.field}" must be an array when using the "not_in" operator.`);
					if (isInsensitive) return insensitiveNotInArray(schemaModel[field], w.value);
					return notInArray(schemaModel[field], w.value);
				}
				if (w.operator === "contains") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `%${w.value}%`, config.provider);
					return like(schemaModel[field], `%${w.value}%`);
				}
				if (w.operator === "starts_with") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `${w.value}%`, config.provider);
					return like(schemaModel[field], `${w.value}%`);
				}
				if (w.operator === "ends_with") {
					if (isInsensitive && typeof w.value === "string") return insensitiveIlike(schemaModel[field], `%${w.value}`, config.provider);
					return like(schemaModel[field], `%${w.value}`);
				}
				if (w.operator === "lt") return lt(schemaModel[field], w.value);
				if (w.operator === "lte") return lte(schemaModel[field], w.value);
				if (w.operator === "gt") return gt(schemaModel[field], w.value);
				if (w.operator === "gte") return gte(schemaModel[field], w.value);
				if (w.operator === "ne") {
					if (w.value === null) return isNotNull(schemaModel[field]);
					if (isInsensitive && typeof w.value === "string") return insensitiveNe(schemaModel[field], w.value);
					return ne(schemaModel[field], w.value);
				}
				if (w.value === null) return isNull(schemaModel[field]);
				if (isInsensitive && typeof w.value === "string") return insensitiveEq(schemaModel[field], w.value);
				return eq(schemaModel[field], w.value);
			}));
			if (andGroup.length && orGroup.length) return [and(andClause, orClause)];
			if (andGroup.length) return [andClause];
			if (orGroup.length) return [orClause];
			return [];
		}
		function checkMissingFields(schema, model, values) {
			if (!schema) throw new BetterAuthError("Drizzle adapter failed to initialize. Drizzle Schema not found. Please provide a schema object in the adapter options object.");
			for (const key in values) {
				let fieldName;
				try {
					fieldName = getFieldName({
						model,
						field: key
					});
				} catch {
					fieldName = key;
				}
				if (!schema[fieldName]) throw new BetterAuthError(`The field "${key}" does not exist in the "${model}" Drizzle schema. Please update your drizzle schema or re-generate using "npx auth@latest generate".`);
			}
		}
		/**
		* Resolve the db.query key for a model.
		*
		* When `usePlural` is false (default), Better Auth uses singular model
		* names like "user", but Drizzle's db.query is keyed by the schema
		* export names (often plural like "users"). This function:
		*
		* 1. Tries the model name directly (works when schema keys match)
		* 2. If usePlural is set, tries appending "s"
		* 3. Falls back to scanning config.schema to find which db.query key
		*    corresponds to the same table object
		*/
		function getQueryModel(model) {
			if (db.query[model]) return model;
			if (config.usePlural) {
				const plural = `${model}s`;
				if (db.query[plural]) return plural;
			}
			if (config.schema) {
				const targetTable = config.schema[model];
				if (targetTable) {
					const fullSchema = db._.fullSchema;
					if (fullSchema) {
						for (const key of Object.keys(db.query)) if (fullSchema[key] === targetTable) return key;
					}
				}
			}
			return null;
		}
		return {
			async create({ model, data: values }) {
				const schemaModel = getSchema(model);
				checkMissingFields(schemaModel, model, values);
				return await withReturning(model, db.insert(schemaModel).values(values), values);
			},
			async findOne({ model, where, select, join }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				if (options.experimental?.joins) {
					const queryModel = getQueryModel(model);
					if (!db.query || !queryModel) {
						logger.error(`[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx auth@latest generate".`);
						logger.info("Falling back to regular query");
					} else {
						let includes;
						const pluralJoinResults = [];
						if (join) {
							includes = {};
							const joinEntries = Object.entries(join);
							for (const [model, joinAttr] of joinEntries) {
								const limit = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
								const isUnique = joinAttr.relation === "one-to-one";
								const pluralSuffix = isUnique || config.usePlural ? "" : "s";
								includes[`${model}${pluralSuffix}`] = isUnique ? true : { limit };
								if (!isUnique) pluralJoinResults.push(`${model}${pluralSuffix}`);
							}
						}
						const res = await db.query[queryModel].findFirst({
							where: clause[0],
							columns: select?.length && select.length > 0 ? select.reduce((acc, field) => {
								acc[getFieldName({
									model,
									field
								})] = true;
								return acc;
							}, {}) : void 0,
							with: includes
						});
						if (res) for (const pluralJoinResult of pluralJoinResults) {
							const singularKey = !config.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
							res[singularKey] = res[pluralJoinResult];
							if (pluralJoinResult !== singularKey) delete res[pluralJoinResult];
						}
						return res;
					}
				}
				const res = await db.select(select?.length && select.length > 0 ? select.reduce((acc, field) => {
					const fieldName = getFieldName({
						model,
						field
					});
					return {
						...acc,
						[fieldName]: schemaModel[fieldName]
					};
				}, {}) : void 0).from(schemaModel).where(...clause);
				if (!res.length) return null;
				return res[0];
			},
			async findMany({ model, where, sortBy, limit, select, offset, join }) {
				const schemaModel = getSchema(model);
				const clause = where ? convertWhereClause(where, model) : [];
				const sortFn = sortBy?.direction === "desc" ? desc : asc;
				if (options.experimental?.joins) {
					const queryModel = getQueryModel(model);
					if (!queryModel) {
						logger.error(`[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx auth@latest generate".`);
						logger.info("Falling back to regular query");
					} else {
						let includes;
						const pluralJoinResults = [];
						if (join) {
							includes = {};
							const joinEntries = Object.entries(join);
							for (const [model, joinAttr] of joinEntries) {
								const isUnique = joinAttr.relation === "one-to-one";
								const limit = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
								const pluralSuffix = isUnique || config.usePlural ? "" : "s";
								includes[`${model}${pluralSuffix}`] = isUnique ? true : { limit };
								if (!isUnique) pluralJoinResults.push(`${model}${pluralSuffix}`);
							}
						}
						let orderBy = void 0;
						if (sortBy?.field) orderBy = [sortFn(schemaModel[getFieldName({
							model,
							field: sortBy?.field
						})])];
						const res = await db.query[queryModel].findMany({
							where: clause[0],
							with: includes,
							columns: select?.length && select.length > 0 ? select.reduce((acc, field) => {
								acc[getFieldName({
									model,
									field
								})] = true;
								return acc;
							}, {}) : void 0,
							limit: limit ?? 100,
							offset: offset ?? 0,
							orderBy
						});
						if (res) for (const item of res) for (const pluralJoinResult of pluralJoinResults) {
							const singularKey = !config.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
							if (singularKey === pluralJoinResult) continue;
							item[singularKey] = item[pluralJoinResult];
							delete item[pluralJoinResult];
						}
						return res;
					}
				}
				let builder = db.select(select?.length && select.length > 0 ? select.reduce((acc, field) => {
					const fieldName = getFieldName({
						model,
						field
					});
					return {
						...acc,
						[fieldName]: schemaModel[fieldName]
					};
				}, {}) : void 0).from(schemaModel);
				const effectiveLimit = limit;
				const effectiveOffset = offset;
				if (typeof effectiveLimit !== "undefined") builder = builder.limit(effectiveLimit);
				if (typeof effectiveOffset !== "undefined") builder = builder.offset(effectiveOffset);
				if (sortBy?.field) builder = builder.orderBy(sortFn(schemaModel[getFieldName({
					model,
					field: sortBy?.field
				})]));
				return await builder.where(...clause);
			},
			async count({ model, where }) {
				const schemaModel = getSchema(model);
				const clause = where ? convertWhereClause(where, model) : [];
				return (await db.select({ count: count() }).from(schemaModel).where(...clause))[0].count;
			},
			async update({ model, where, update: values }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				return await withReturning(model, db.update(schemaModel).set(values).where(...clause), values, where);
			},
			async updateMany({ model, where, update: values }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				return getAffectedRowCount(await db.update(schemaModel).set(values).where(...clause), "updateMany", {
					model,
					where
				});
			},
			async delete({ model, where }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				return await db.delete(schemaModel).where(...clause);
			},
			async deleteMany({ model, where }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				return getAffectedRowCount(await db.delete(schemaModel).where(...clause), "deleteMany", {
					model,
					where
				});
			},
			async consumeOne({ model, where }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				const idField = getFieldName({
					model,
					field: "id"
				});
				const idColumn = schemaModel[idField];
				if (config.provider === "mysql") {
					const claimFromTransaction = async (tx) => {
						const target = (await tx.select().from(schemaModel).where(...clause).for("update").limit(1))[0];
						if (!target) return null;
						const targetId = target[idField] ?? target.id;
						if (targetId === void 0 || targetId === null || !idColumn) return null;
						return getAffectedRowCount(await tx.delete(schemaModel).where(eq(idColumn, targetId)).execute(), "consumeOne", {
							model,
							where
						}) > 0 ? target : null;
					};
					return inTransaction ? claimFromTransaction(db) : db.transaction(claimFromTransaction);
				}
				if (!idColumn) return null;
				const targetIds = db.select({ id: idColumn }).from(schemaModel).where(...clause).limit(1);
				return (await db.delete(schemaModel).where(inArray(idColumn, targetIds)).returning())[0] ?? null;
			},
			async incrementOne({ model, where, increment, set }) {
				const schemaModel = getSchema(model);
				const clause = convertWhereClause(where, model);
				const idField = getFieldName({
					model,
					field: "id"
				});
				const idColumn = schemaModel[idField];
				const assignments = {};
				for (const [field, delta] of Object.entries(increment)) {
					const columnName = getFieldName({
						model,
						field
					});
					const column = schemaModel[columnName];
					if (!column) throw new BetterAuthError(`The field "${field}" does not exist in the schema for the model "${model}". Please update your schema.`);
					assignments[columnName] = sql`${column} + ${delta}`;
				}
				if (set) for (const [field, value] of Object.entries(set)) {
					const columnName = getFieldName({
						model,
						field
					});
					if (!schemaModel[columnName]) throw new BetterAuthError(`The field "${field}" does not exist in the schema for the model "${model}". Please update your schema.`);
					assignments[columnName] = value;
				}
				if (config.provider === "mysql") {
					const mutateInTransaction = async (tx) => {
						const target = (await tx.select().from(schemaModel).where(...clause).for("update").limit(1))[0];
						if (!target) return null;
						const targetId = target[idField] ?? target.id;
						if (targetId === void 0 || targetId === null || !idColumn) return null;
						await tx.update(schemaModel).set(assignments).where(eq(idColumn, targetId)).execute();
						return (await tx.select().from(schemaModel).where(eq(idColumn, targetId)).limit(1).execute())[0] ?? null;
					};
					return inTransaction ? mutateInTransaction(db) : db.transaction(mutateInTransaction);
				}
				if (!idColumn) return null;
				const targetIds = db.select({ id: idColumn }).from(schemaModel).where(...clause).limit(1);
				return (await db.update(schemaModel).set(assignments).where(inArray(idColumn, targetIds)).returning())[0] ?? null;
			},
			options: config
		};
	};
	let adapterOptions = null;
	adapterOptions = {
		config: {
			adapterId: "drizzle",
			adapterName: "Drizzle Adapter",
			usePlural: config.usePlural ?? false,
			debugLogs: config.debugLogs ?? false,
			supportsUUIDs: config.provider === "pg" ? true : false,
			supportsJSON: config.provider === "pg" ? true : false,
			supportsArrays: config.provider === "pg" ? true : false,
			customTransformOutput: ({ data, fieldAttributes }) => {
				if (fieldAttributes.type === "date") {
					if (data === null || data === void 0) return data;
					return new Date(data);
				}
				return data;
			},
			transaction: config.transaction ?? false ? (cb) => db.transaction((tx) => {
				return cb(createAdapterFactory({
					config: {
						...adapterOptions.config,
						transaction: false
					},
					adapter: createCustomAdapter(tx, true)
				})(lazyOptions));
			}) : false
		},
		adapter: createCustomAdapter(db)
	};
	const adapter = createAdapterFactory(adapterOptions);
	return (options) => {
		lazyOptions = options;
		return adapter(options);
	};
};
//#endregion
export { Columns as A, IndexedColumn as B, notLike as C, View as D, SQL as E, ViewBaseConfig as F, entityKind as G, PgColumnBuilder as H, tracer as I, is as K, Subquery as L, Table as M, getTableName as N, fillPlaceholders as O, getTableUniqueName as P, WithSubquery as R, notInArray as S, Param as T, unique as U, PgColumn as V, Column as W, ne as _, between as a, notExists as b, gt as c, inArray as d, isNotNull as f, lte as g, lt as h, and as i, Schema as j, sql as k, gte as l, like as m, asc as n, eq as o, isNull as p, desc as r, exists as s, drizzleAdapter as t, ilike as u, not as v, or as w, notIlike as x, notBetween as y, pgEnum as z };
