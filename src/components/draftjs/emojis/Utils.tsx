import { IEmojiData } from '../../interfaces';
// tslint:disable
export const  objectToArray = (obj) => {
    let _arr = [];
  
    for (let key in obj) {
        _arr.push([key, obj[key]]);
    }
    return _arr;
  }

export const  objectToEmojiArray = (obj) => {
    let _arr: IEmojiData[];
    _arr= Object.keys(obj).map( p => Object.assign({Name:p, Code:obj[p]} ) )
    return _arr;
}