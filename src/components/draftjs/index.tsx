// tslint:disable
// tslint:disable jsx-no-string-ref
import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import * as Draft from 'draft-js';
import { CompositDecorator } from './draftcore/CompositeDecorator';
import * as styles from './draftcore/styles.less';
import EmojiPicker from './emojis/EmojiPicker';
// import RecentEmojiList from './emojis/RecentEmojiList';
import * as emojiStyles from './emojis/styles.less';
// import { IEmojiData } from '../interfaces';
import {  
  AppendEntity,
} from './draftcore/draftUtils';

// tslint:disable
// tslint:disable-next-line:class-name
interface iMyDraftProps {
  content?: string;
  placeholder?: string;
  onChange?: (rawContent: string, textContent?: string) => void;
}

@observer
export class MyDraft extends React.Component<iMyDraftProps, {}> {
  @observable private editorState: Draft.EditorState;
  private compositDecorators: CompositDecorator;  

  constructor(props: any) {
    super(props);
    this.compositDecorators = new CompositDecorator(this.UpdateEditorStare);
    this.editorState = Draft.EditorState.createEmpty(this.compositDecorators.getCompositDecorators());
    this.compositDecorators.onUpDateEditorState(this.editorState);
    this.setContent(this.props.content);
    this.onSelectedEmoji = this.onSelectedEmoji.bind(this);
    // this.toggleRecentEmojiList = this.toggleRecentEmojiList.bind(this);    
  }
   
  setContent = (content?: string) => {
    if (!content) {
      const emptyEditorState = Draft.EditorState.createEmpty(this.compositDecorators.getCompositDecorators());
      this.onChange(emptyEditorState);
      return;
    }
    let contentState: Draft.ContentState;
    try {
      let contentJSON = JSON.parse(content);
      contentState = Draft.convertFromRaw(contentJSON);
    } catch (e) {
      contentState = Draft.ContentState.createFromText(content);
    }
    const editorState = Draft.EditorState.push(this.editorState, contentState, 'apply-entity');
    this.onChange(editorState);
  }

  @action('draftr JS On Change')
  private onChange = (editorState: Draft.EditorState) => {
    this.editorState = editorState;
    setTimeout(this.onEditorStateChange, 0, editorState);
  }

  @action('draftr JS On Change from timer')
  onEditorStateChange = (editorState: Draft.EditorState) => {
    this.compositDecorators.onUpDateEditorState(editorState);
    this.triggerOnChangeCallBack();
  }

  @action('draftr JS On Change call back')
  private triggerOnChangeCallBack = () => {
    if (this.props.onChange) {
      const ContentState = this.editorState.getCurrentContent();
      const rawContent = Draft.convertToRaw(ContentState);
      const rawContentString = JSON.stringify(rawContent);
      const contentText = ContentState.getPlainText();
      this.props.onChange(rawContentString, contentText);
    }
  }
    
  private onCustomKeyBinding: any = (e) => {
    const command = this.compositDecorators.onKeyPressed(e);
    if (command) { return command; }
    const binding = Draft.getDefaultKeyBinding(e);
    return binding;
  }

  private UpdateEditorStare = editorState => {
    this.editorState = editorState;   
      this.triggerOnChangeCallBack();
  }
  
  @action('focus')
  private focus = () => {
    const editor = this.refs['editor'] as any;
    editor.focus();
  }

  toggleRecentEmojiList = (isOpen) => {   
    // if(isOpen === null) {
    //   this.isRecentEmojiListOpen= !this.isRecentEmojiListOpen;
    // } else {
    //   this.isRecentEmojiListOpen= isOpen;
    // } 
  }

  @action('on Selected Emoji')
  onSelectedEmoji = (emoji)=> {    
    // Adding emoji and applying entity to it    
    const newEditorState =AppendEntity({ID: emoji.id, Name:emoji.colons, Skin:(emoji.skin?emoji.skin:1)},`${emoji.colons}`,'emoji', this.editorState);
    this.UpdateEditorStare(newEditorState);    
  } 

  // tslint:disable-next-line:member-ordering
  render() {
      
    return( 
      <div>
        <div
          className={styles.editor + ' ' + styles.edit}
          onClick={this.focus}
        >   
                   
          <Draft.Editor
            ref="editor"
            editorState={this.editorState}
            onChange={this.onChange}
            keyBindingFn={this.onCustomKeyBinding}
            handleKeyCommand={this.compositDecorators.onKeyCommand as any}            
            onUpArrow={this.compositDecorators.onKeyUp}
            onDownArrow={this.compositDecorators.onKeyDown}
            spellCheck={true}
            onEscape={this.compositDecorators.onEscape}
            placeholder={this.props.placeholder ? this.props.placeholder : ''}            
          />
         
    
      </div>         
      <div className={emojiStyles.emojiContainer}>
            {/* {this.isRecentEmojiListOpen && <RecentEmojiList
                    emojis={recentEmojiList}
                    onClick={this.onSelectedEmoji}
                    onHide={() => this.toggleRecentEmojiList}
                  /> 
            } */}
              <EmojiPicker             
                onSelectEmoji={this.onSelectedEmoji}
                showRecentEmojiList={this.toggleRecentEmojiList}
      />
      </div>
    </div>
    )
  }
}
