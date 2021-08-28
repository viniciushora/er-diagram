import { DataType } from '@/core/indexedDB';

export const dataTypes: Array<Pick<DataType, 'name' | 'primitiveType'>> = [
  { name: 'bfile', primitiveType: 'lob' },
  { name: 'bigint', primitiveType: 'long' },
  { name: 'bigserial', primitiveType: 'long' },
  { name: 'binary', primitiveType: 'string' },
  { name: 'binary_double', primitiveType: 'double' },
  { name: 'binary_float', primitiveType: 'float' },
  { name: 'bit', primitiveType: 'int' },
  { name: 'bit varying', primitiveType: 'int' },
  { name: 'blob', primitiveType: 'lob' },
  { name: 'bool', primitiveType: 'boolean' },
  { name: 'boolean', primitiveType: 'boolean' },
  { name: 'box', primitiveType: 'string' },
  { name: 'bytea', primitiveType: 'string' },
  { name: 'char', primitiveType: 'string' },
  { name: 'character', primitiveType: 'string' },
  { name: 'character varying', primitiveType: 'string' },
  { name: 'cidr', primitiveType: 'string' },
  { name: 'circle', primitiveType: 'string' },
  { name: 'clob', primitiveType: 'lob' },
  { name: 'date', primitiveType: 'date' },
  { name: 'datetime', primitiveType: 'datetime' },
  { name: 'datetime2', primitiveType: 'datetime' },
  { name: 'datetimeoffset', primitiveType: 'datetime' },
  { name: 'dec', primitiveType: 'decimal' },
  { name: 'decimal', primitiveType: 'decimal' },
  { name: 'double', primitiveType: 'double' },
  { name: 'double precision', primitiveType: 'double' },
  { name: 'enum', primitiveType: 'string' },
  { name: 'fixed', primitiveType: 'decimal' },
  { name: 'float', primitiveType: 'float' },
  { name: 'float4', primitiveType: 'float' },
  { name: 'float8', primitiveType: 'double' },
  { name: 'geography', primitiveType: 'string' },
  { name: 'geometry', primitiveType: 'string' },
  { name: 'geometrycollection', primitiveType: 'string' },
  { name: 'image', primitiveType: 'lob' },
  { name: 'inet', primitiveType: 'string' },
  { name: 'int', primitiveType: 'int' },
  { name: 'int2', primitiveType: 'int' },
  { name: 'int4', primitiveType: 'int' },
  { name: 'int8', primitiveType: 'long' },
  { name: 'integer', primitiveType: 'int' },
  { name: 'interval', primitiveType: 'time' },
  { name: 'json', primitiveType: 'lob' },
  { name: 'jsonb', primitiveType: 'lob' },
  { name: 'line', primitiveType: 'string' },
  { name: 'linestring', primitiveType: 'string' },
  { name: 'long', primitiveType: 'lob' },
  { name: 'long raw', primitiveType: 'lob' },
  { name: 'longblob', primitiveType: 'lob' },
  { name: 'longtext', primitiveType: 'lob' },
  { name: 'lseg', primitiveType: 'string' },
  { name: 'macaddr', primitiveType: 'string' },
  { name: 'macaddr8', primitiveType: 'string' },
  { name: 'mediumblob', primitiveType: 'lob' },
  { name: 'mediumint', primitiveType: 'int' },
  { name: 'mediumtext', primitiveType: 'lob' },
  { name: 'money', primitiveType: 'double' },
  { name: 'multilinestring', primitiveType: 'string' },
  { name: 'multipoint', primitiveType: 'string' },
  { name: 'multipolygon', primitiveType: 'string' },
  { name: 'nchar', primitiveType: 'string' },
  { name: 'nclob', primitiveType: 'lob' },
  { name: 'ntext', primitiveType: 'lob' },
  { name: 'number', primitiveType: 'long' },
  { name: 'numeric', primitiveType: 'decimal' },
  { name: 'nvarchar', primitiveType: 'string' },
  { name: 'nvarchar2', primitiveType: 'string' },
  { name: 'path', primitiveType: 'string' },
  { name: 'pg_lsn', primitiveType: 'int' },
  { name: 'point', primitiveType: 'string' },
  { name: 'polygon', primitiveType: 'string' },
  { name: 'raw', primitiveType: 'lob' },
  { name: 'real', primitiveType: 'double' },
  { name: 'serial', primitiveType: 'int' },
  { name: 'serial2', primitiveType: 'int' },
  { name: 'serial4', primitiveType: 'int' },
  { name: 'serial8', primitiveType: 'long' },
  { name: 'set', primitiveType: 'string' },
  { name: 'smalldatetime', primitiveType: 'datetime' },
  { name: 'smallint', primitiveType: 'int' },
  { name: 'smallmoney', primitiveType: 'float' },
  { name: 'smallserial', primitiveType: 'int' },
  { name: 'sql_variant', primitiveType: 'string' },
  { name: 'text', primitiveType: 'lob' },
  { name: 'time', primitiveType: 'time' },
  { name: 'time with time zone', primitiveType: 'time' },
  { name: 'timestamp', primitiveType: 'datetime' },
  { name: 'timestamp with local time zone', primitiveType: 'datetime' },
  { name: 'timestamp with time zone', primitiveType: 'datetime' },
  { name: 'timestamptz', primitiveType: 'datetime' },
  { name: 'timetz', primitiveType: 'time' },
  { name: 'tinyblob', primitiveType: 'lob' },
  { name: 'tinyint', primitiveType: 'int' },
  { name: 'tinytext', primitiveType: 'lob' },
  { name: 'tsquery', primitiveType: 'string' },
  { name: 'tsvector', primitiveType: 'string' },
  { name: 'txid_snapshot', primitiveType: 'string' },
  { name: 'uniqueidentifier', primitiveType: 'string' },
  { name: 'uritype', primitiveType: 'string' },
  { name: 'uuid', primitiveType: 'string' },
  { name: 'varbinary', primitiveType: 'string' },
  { name: 'varbit', primitiveType: 'int' },
  { name: 'varchar', primitiveType: 'string' },
  { name: 'varchar2', primitiveType: 'string' },
  { name: 'xml', primitiveType: 'lob' },
  { name: 'xmltype', primitiveType: 'string' },
  { name: 'year', primitiveType: 'int' },
];
