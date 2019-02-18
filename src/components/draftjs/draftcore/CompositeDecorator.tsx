import * as Draft from 'draft-js';
import { EmojiDecorator } from './../emojis/EmojiDecorator';

export class CompositDecorator {

  constructor(public UpdateEditorStoreCallBack: (editorState: Draft.EditorState) => void) { }

  private emoji = new EmojiDecorator(this.UpdateEditorStoreCallBack);

  onUpDateEditorState(editorState: Draft.EditorState) {
    this.emoji.onEditorStateUpdated(editorState);
  }

  onKeyPressed = (e) => {
    let keyHandeled = this.emoji.onKeyPressed(e);
    if (keyHandeled) { return keyHandeled; }
    return null;
  }

  onKeyCommand = (command: string) => {
    let keyHandled = this.emoji.onKeyCommand(command);
    if (keyHandled !== 'not-handled') { return keyHandled; }
    return 'not-handled';
  }    

  onKeyUp = (e) => {
    let keyHandled = this.emoji.onKeyUp(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  onKeyDown = (e) => {
    let keyHandled = this.emoji.onKeyDown(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  onEscape = (e) => {
    let keyHandled = this.emoji.onEscape(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  getCompositDecorators() {
    const compositDecorators = new Draft.CompositeDecorator([
      {
        strategy: this.emoji.strategy,
        component: this.emoji.component
      }
    ]);
    return compositDecorators;
  }
}
