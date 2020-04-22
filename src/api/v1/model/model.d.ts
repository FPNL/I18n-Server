import Mongoose = require('mongoose');

import { Service } from '../service/service';

export namespace LangModelType {
  export interface LangConfigModel extends Mongoose.Document {
    langs: Array<string>;
  }

  export interface LangModel extends Mongoose.Document {
    name: Service.wordName;
    content: Service.wordContent;
    // name: string;
  }
}
