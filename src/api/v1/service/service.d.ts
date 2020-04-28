export namespace ServiceDeclare {
  export type wordName = string
  export interface wordContent {
    [langName: string]: string | number;
  }
  export interface wordFormat {
    name: wordName;
    content: wordContent;
  }
  export interface wordsFormat {
    data: Array<wordFormat>;
  }
}
