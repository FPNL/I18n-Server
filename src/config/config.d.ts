export namespace Config {
  export interface StringEnv {
    DATABASE_TYPE: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';
    [propName: string]: string;
  }
}
