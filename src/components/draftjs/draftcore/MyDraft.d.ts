import * as Draft from 'draft-js'

export interface MyDraftDecorator {
    strategy: (block: Draft.ContentBlock, callback: (start: number, end: number) => void) => void;
    component: Function;
    props?: Object;
}
