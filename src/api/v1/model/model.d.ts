import Mongoose = require('mongoose');

import { ServiceDeclare } from '../service/service';

export namespace ModelDeclare {
  export interface LangConfigModel extends Mongoose.Document {
    langs: Array<string>;
    nativeLang: string;
  }
  export interface LangModel extends Mongoose.Document {
    name: ServiceDeclare.wordName;
    content: ServiceDeclare.wordContent;
    // name: string;
  }
  export interface User {
    id: string;
    account: string;
    password: string;
    nickname: string;
    timeCreate: Date;
    timeUpdate: Date;
    validPassword: (password: string) => boolean;
  }
}
