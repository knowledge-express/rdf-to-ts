import { nativeTypeMap } from '../model';

const semtools = require('semantic-toolkit');

export function typeForIris(iris: string[]): string {
  if (iris.length === 0) throw new Error('No type for empty iris.');
  if (iris.length === 1) {
    const [ iri ] = iris;
    return semtools.getLocalName(iri);
  }

  const [ first, ...rest ] = iris;
  return `(${typeForIris([ first ])} & ${typeForIris(rest)})`;
}

export function objectToTSModule(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
    // else if (value instanceof Array) str = `export enum ${key} { }`;
    else str = `\nexport module ${key} { ${objectToTSModule(value)} };`;

    return memo + str;
  }, ``);
}

export function prefixesToTS({ prefixes }: { prefixes: string[] }): string {
  return objectToTSModule({ prefixes });
}

export function IRIsToTS({ iris }: { iris: string[] }): string {
  return objectToTSModule({ iris });
}

export function literalsToTS({ literals }: { literals: string[] }): string {
  return objectToTSModule({ literals });
}

export function defaultExportsToTS(defaultExports: string[]): string {
  return `export default {\n${defaultExports.join(',\n')}};`;
}

export * from './command';
export * from './config';
export * from './format';
export * from './type-guards';
export * from './types';
