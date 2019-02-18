// tslint:disable
import * as React from 'react';
import * as Draft from 'draft-js';
import { MyDraftDecorator } from '../draftcore/MyDraft';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import MyEmoji from './MyEmoji';
import { IEmojiData } from '../../interfaces';
import { EmojiSuggestions } from './EmojiSuggestions';
import {
  getTextBetweenTriggerAndCurser,
  isCursorAtEndOFBlock,
  ReplaceCurrentWithEntity,
  getEntityData
} from '../draftcore/draftUtils';


export class EmojiDecorator implements MyDraftDecorator {
  entityType = 'emoji';
  // EMOJI_REGEX = /:\w*:/igm;  
  EMOJI_REGEX = /(^|\s):\w+/g; 
  // EMOJI_EMOTICONS_REGEX = /:\w+\:|\<[\/\\]?3|[\(\)\\\D|\*\$][\-\^]?[\:\;\=]|[\:\;\=B8][\-\^]?[3DOPp\@\$\*\\\)\(\/\|](?=\s|[\!\.\?]|$)/igm; 
  // EMOJI_EMOTICONS_REGEX = /([\:\<]-?[)(|\\/pP3D])(\s|$)/g;
  // EMOJI_EMOTICONS_REGEX = /([\:\<]-?[)(|\\/pP3D]?[3DOPp\@\$\*\\\)\(\/\|\-\^\;\=])(?=\s|[\!\.\?]|$)/g;
  EMOJI_EMOTICONS_REGEX = /([\:\<]-?[3DOPp\@\$\*\\\)\(\/\|\-\^\;\=])(?=\s|[\!\.\?]|$)/g;
  emojiTrigger: string = ':';
  editorState: Draft.EditorState;
  emojiRef: EmojiSuggestions;  

  constructor(public UpdateEditorStareCallBack: (editorState: Draft.EditorState) => void) { }

  onEditorStateUpdated = (editorState: Draft.EditorState) => {
    this.editorState = editorState;
  }

  strategy = (block: Draft.ContentBlock, callback: (start: number, end: number) => void) => {
    block.findEntityRanges(val => {
      const entityKey = val.getEntity();
      if (!entityKey) { return false; }
      const contentState = this.editorState.getCurrentContent() as any;
      return contentState.getEntity(entityKey)
        .getType() === this.entityType;
    }, (start, end) => callback(start, end));
    const text = block.getText();    
    let matches: RegExpExecArray | null;    
    while ((matches = this.EMOJI_EMOTICONS_REGEX.exec(text)) !== null) {
      let start = matches.index;
      let end = matches[0].length + start;    
      callback(start, end);
    }    
    while ((matches = this.EMOJI_REGEX.exec(text)) !== null) {
      let start = matches.index;
      let end = matches[0].length + start;
      callback(start, end);
    }
    
  }

  component = observer<any>((props: { decoratedText: string, entityKey: string, children: any }) => {    
    if (props.entityKey) {
      var emoji: IEmojiData;      
        emoji = this.getUserfromEntity(props.entityKey);
      
      return <MyEmoji emoji={emoji} >{props.children}</MyEmoji>;
    }

    let cleanCurrentEmoji = '';
    let currentEmojiText = '';
    if (isCursorAtEndOFBlock(this.editorState, this.emojiTrigger)) {
      currentEmojiText = props.decoratedText as string;
    } else {
      const emojiAtCursor = this.textBetweenAtAndCursor();
      if (emojiAtCursor) { currentEmojiText = emojiAtCursor.suggestionText; }
    }
    cleanCurrentEmoji = currentEmojiText;    
    let regex = new RegExp(this.EMOJI_EMOTICONS_REGEX);
    if(!regex.test(currentEmojiText)) {
    cleanCurrentEmoji = currentEmojiText.replace(this.emojiTrigger, '').trim();
    }
   
    return (
      <EmojiSuggestions
        ref={(emojiRef) => this.emojiRef = emojiRef}
        searchString={cleanCurrentEmoji}
        onEmojiSelected={this.onEmojiSelected}
      >
        {props.children}
      </EmojiSuggestions>
    );
  });

  textBetweenAtAndCursor = () => {
    return getTextBetweenTriggerAndCurser(this.emojiTrigger, this.editorState);
  }
  
  onEmojiSelected = (emoji: IEmojiData) => {
    const newEditorState = ReplaceCurrentWithEntity(
      toJS(emoji), `${emoji.Name}`, this.emojiTrigger, this.entityType, this.editorState);
    this.UpdateEditorStareCallBack(newEditorState);
  }
  getUserfromEntity(entityKey: string) {
    return getEntityData<IEmojiData>(entityKey, this.editorState);
  }

  onKeyPressed = (e) => {
    if (this.emojiRef) { return this.emojiRef.keyPressed(e); };
    return null;
  }

  onKeyCommand = (command: string) => {
    if (this.emojiRef) { return this.emojiRef.keyCommand(command); }
    return 'not-handled';
  }

  onKeyUp = (e) => {
    if (this.emojiRef) { this.emojiRef.keyUp(e); }
  }

  onKeyDown = (e) => {
    if (this.emojiRef) { this.emojiRef.keyDown(e); }
  }

  onEscape = (e) => {
    if (this.emojiRef) { this.emojiRef.onEscape(e); }
  }
  
}

