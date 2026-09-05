import { randomUUID } from 'crypto';
import { getTableName, type SQL } from 'drizzle-orm';

type Row = Record<string, unknown>;

interface ColumnNode {
  name: string; // DB column name (e.g. "expires_at")
  table: object; // the pgTable object; its keys map to columns
  columnType?: string;
  dataType?: string;
  hasDefault?: boolean;
  default?: unknown;
}

interface Chunk {
  value?: string[] | unknown;
  queryChunks?: Chunk[];
  columnType?: string;
}

const isSQL = (v: unknown): v is SQL => !!v && typeof v === 'object' && Array.isArray((v as SQL).queryChunks);
const isColumn = (v: unknown): v is ColumnNode => !!v && typeof v === 'object' && !!(v as ColumnNode).columnType && !!(v as ColumnNode).table;
const isParam = (v: unknown): v is { value: unknown } => !!v && typeof v === 'object' && (v as { constructor?: { name?: string } }).constructor?.name === 'Param';
const isStringChunk = (v: unknown): v is { value: string[] } =>
  !!v && typeof v === 'object' && (v as { constructor?: { name?: string } }).constructor?.name === 'StringChunk';

const colJsKeyCache = new WeakMap<ColumnNode, string>();
const jsKeyOf = (col: ColumnNode): string => {
  const cached = colJsKeyCache.get(col);
  if (cached) return cached;
  const table = col.table;
  const key = Object.keys(table).find((k) => (table as Record<string, unknown>)[k] === col);
  colJsKeyCache.set(col, key || col.name);
  return key || col.name;
};

const deepClone = <T>(value: T): T => {
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepClone(v)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>)) {
      out[k] = deepClone((value as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  return value;
};

const flattenText = (sql: SQL): string => {
  const parts: string[] = [];
  const walk = (chunk: Chunk) => {
    if (isStringChunk(chunk)) parts.push((chunk.value as string[]).join(''));
    if (chunk.queryChunks) chunk.queryChunks.forEach(walk);
  };
  sql.queryChunks?.forEach(walk);
  return parts.join('').trim();
};

const applyDefault = (col: ColumnNode): unknown => {
  const def = col.default;
  if (isSQL(def)) {
    const text = flattenText(def);
    if (text.includes('gen_random_uuid')) return randomUUID();
    if (text.toLowerCase().includes('now()')) return new Date();
    return undefined;
  }
  if (def !== undefined && def !== null) return deepClone(def);
  return undefined;
};

// Convert a value for comparison (dates normalized to numbers)
const comparable = (v: unknown): unknown => {
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'string' && v.length > 0 && !Number.isNaN(Date.parse(v)) && v.includes('T')) {
    return Date.parse(v);
  }
  return v;
};

const compareRow = (row: Row, col: ColumnNode, op: string, expected: unknown): boolean => {
  const rowVal = row[jsKeyOf(col)];
  if (op.includes('is null')) return rowVal === null || rowVal === undefined;
  if (op.includes('is not null')) return rowVal !== null && rowVal !== undefined;
  if (op.includes('=')) return comparable(rowVal) === comparable(expected);
  if (op.includes('>=')) return (comparable(rowVal) as number) >= (comparable(expected) as number);
  if (op.includes('<=')) return (comparable(rowVal) as number) <= (comparable(expected) as number);
  if (op.includes('>')) return (comparable(rowVal) as number) > (comparable(expected) as number);
  if (op.includes('<')) return (comparable(rowVal) as number) < (comparable(expected) as number);
  return true;
};
const evaluateTokens = (tokens: unknown[], row: Row): boolean => {
  let ok = true;
  let curCol: ColumnNode | null = null;
  let curOp: string | null = null;
  let curVal: unknown = null;
  let hasPending = false;

  const finalize = () => {
    if (hasPending && curCol && curOp) {
      ok = ok && compareRow(row, curCol, curOp, curVal);
    }
    curCol = null;
    curOp = null;
    curVal = null;
    hasPending = false;
  };

  for (const token of tokens) {
    if (isColumn(token)) {
      finalize();
      curCol = token;
      hasPending = true;
    } else if (isParam(token)) {
      curVal = token.value;
    } else if (isStringChunk(token)) {
      const text = (token.value as string[]).join('').toLowerCase().trim();
      if (/ and | and$/.test(text)) {
        finalize();
      } else if (text && text !== '(' && text !== ')') {
        curOp = text;
      }
    } else if (isSQL(token)) {
      ok = ok && evaluateNode(token, row);
    }
  }
  finalize();
  return ok;
};

const evaluateNode = (node: SQL, row: Row): boolean => {
  let ok = true;
  const tokens: unknown[] = [];
  for (const chunk of node.queryChunks ?? []) {
    if (isSQL(chunk)) {
      ok = ok && evaluateNode(chunk, row);
    } else {
      tokens.push(chunk);
    }
  }
  return ok && evaluateTokens(tokens, row);
};

const matches = (cond: SQL | undefined | null, row: Row): boolean => {
  if (!cond) return true;
  return evaluateNode(cond, row);
};

const columnNodesOf = (table: object): ColumnNode[] =>
  Object.keys(table)
    .filter((k) => {
      const col = (table as Record<string, unknown>)[k] as ColumnNode;
      return !!col && typeof col === 'object' && !!col.columnType;
    })
    .map((k) => (table as Record<string, unknown>)[k] as ColumnNode);

type Selection = Record<string, ColumnNode> | undefined;

const project = (row: Row, selection: Selection): Row => {
  const out: Row = {};
  if (!selection) {
    for (const k of Object.keys(row)) out[k] = deepClone(row[k]);
    return out;
  }
  for (const key of Object.keys(selection)) {
    const col = selection[key];
    if (col && col.columnType) {
      out[key] = deepClone(row[jsKeyOf(col)]);
    } else {
      out[key] = undefined; // aggregate/expression - not modeled in memory db
    }
  }
  return out;
};

interface OrderByClause {
  col: ColumnNode;
  dir: 1 | -1;
}

const parseOrderBy = (cols: unknown[]): OrderByClause[] => {
  const out: OrderByClause[] = [];
  for (const col of cols) {
    if (isColumn(col)) {
      out.push({ col, dir: 1 });
    } else if (isSQL(col as unknown)) {
      const chunks = (col as unknown as SQL).queryChunks ?? [];
      const colNode = chunks.find(isColumn) as ColumnNode | undefined;
      const text = flattenText(col as unknown as SQL).toLowerCase();
      if (colNode) out.push({ col: colNode, dir: text.includes(' desc') ? -1 : 1 });
    }
  }
  return out;
};

const sortRows = (rows: Row[], clauses: OrderByClause[]): Row[] => {
  if (clauses.length === 0) return rows;
  return [...rows].sort((a, b) => {
    for (const clause of clauses) {
      const av = comparable(a[jsKeyOf(clause.col)]) as number | string;
      const bv = comparable(b[jsKeyOf(clause.col)]) as number | string;
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      if (cmp !== 0) return cmp * clause.dir;
    }
    return 0;
  });
};
// ========================================
// MEMORY DATABASE
// ========================================
export class MemoryDb {
  readonly stores = new Map<string, Row[]>();

  private keyOf(table: object): string {
    return getTableName(table as never);
  }

  private storeFor(table: object): Row[] {
    const key = this.keyOf(table);
    let store = this.stores.get(key);
    if (!store) {
      store = [];
      this.stores.set(key, store);
    }
    return store;
  }

  reset(): void {
    this.stores.clear();
  }

  rowsOf(table: object): Row[] {
    return this.stores.get(this.keyOf(table)) ?? [];
  }

  select(selection?: Selection) {
    const storeFor = this.storeFor.bind(this);
    return {
      from(table: object) {
        const query = {
          whereClause: undefined as SQL | undefined,
          orderByClauses: [] as OrderByClause[],
          where(cond?: SQL) {
            query.whereClause = cond;
            return query;
          },
          orderBy(...cols: unknown[]) {
            query.orderByClauses = parseOrderBy(cols);
            return query;
          },
          async then(resolve: (v: Row[]) => void) {
            let rows = storeFor(table)
              .filter((row) => matches(query.whereClause, row));
            rows = sortRows(rows, query.orderByClauses);
            resolve(rows.map((row) => project(row, selection)));
          },
        };
        return query;
      },
    };
  }

  insert(table: object) {
    let values: Record<string, unknown> | Record<string, unknown>[] = {};
    const storeFor = this.storeFor.bind(this);
    return {
      values(data: Record<string, unknown> | Record<string, unknown>[]) {
        values = data;
        return this;
      },
      async returning(sel?: Selection): Promise<Row[]> {
        const store = storeFor(table);
        const rows = Array.isArray(values) ? values : [values];
        const inserted: Row[] = [];
        for (const raw of rows) {
          const row: Row = {};
          for (const colNode of columnNodesOf(table)) {
            const jsKey = jsKeyOf(colNode);
            if (Object.prototype.hasOwnProperty.call(raw, jsKey)) {
              row[jsKey] = deepClone(raw[jsKey]);
            } else if (colNode.hasDefault) {
              row[jsKey] = applyDefault(colNode);
            }
          }
          store.push(row);
          inserted.push(project(row, sel));
        }
        return inserted;
      },
      async then(resolve: (v: Row[]) => void) {
        resolve(await this.returning());
      },
    };
  }

  update(table: object) {
    const storeFor = this.storeFor.bind(this);
    return {
      set(set: Record<string, unknown>) {
        return {
          where: (cond?: SQL) => {
            return {
              async returning(sel?: Selection): Promise<Row[]> {
                const store = storeFor(table);
                const updated: Row[] = [];
                for (const row of store) {
                  if (matches(cond, row)) {
                    Object.assign(row, deepClone(set));
                    updated.push(project(row, sel));
                  }
                }
                return updated;
              },
              async then(resolve: (v: Row[]) => void) {
                resolve(await this.returning());
              },
            };
          },
          async then(resolve: (v: Row[]) => void) {
            const store = storeFor(table);
            for (const row of store) {
              Object.assign(row, deepClone(set));
            }
            resolve([]);
          },
        };
      },
    };
  }

  delete(table: object) {
    const storeFor = this.storeFor.bind(this);
    return {
      where(cond?: SQL) {
        const store = storeFor(table);
        const toDelete = store.filter((row) => matches(cond, row));
        for (const row of toDelete) {
          const idx = store.indexOf(row);
          if (idx !== -1) store.splice(idx, 1);
        }
        return {
          async then(resolve: (v: Row[]) => void) {
            resolve([]);
          },
        };
      },
    };
  }
}

export const createMemoryDb = () => new MemoryDb();
export default MemoryDb;