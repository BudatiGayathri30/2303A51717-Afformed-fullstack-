export type Stack = 'frontend' | 'backend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type FrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';
export type SharedPackage = 'auth' | 'config' | 'middleware' | 'utils';
export type PackageName = FrontendPackage | SharedPackage;

export interface LogPayload {
  stack: Stack;
  level: Level;
  package: PackageName;
  message: string;
}
