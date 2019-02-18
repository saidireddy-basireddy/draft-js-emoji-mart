import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { IEmojiData } from '../../interfaces';
import { EmojisDropdown } from './EmojisDropdown';
import { emojiIndex } from 'emoji-mart';
import config from '../../../config';
import { store } from 'emoji-mart';

// tslint:disable
// tslint:disable-next-line:interface-name
export interface IEmojiSuggestions {
  searchString: string;
  onEmojiSelected: (emoji: IEmojiData) => void;
}

@observer
export class EmojiSuggestions extends React.Component<IEmojiSuggestions, {}> {
    @observable emojiSuggestions: IEmojiData[] = [];
    @observable dropDownActive = false;
    @observable currentSelectedUserIndex = 0;
    @observable mouseDownInComponent = false;   
    emojiTrigger: string = ':';
    selectHashKeyCommandHandeledHandeled = 'select_emoji_handeld';
    selectHashKeyCommandHandeledNotHandeled = 'select_emoji_not_handeld';

    constructor(props: any) {
      super(props);
      this.getEmojis = this.getEmojis.bind(this);
    }
  
    componentWillReceiveProps  (nextProps: IEmojiSuggestions)  {
      if (nextProps.searchString !== this.props.searchString) {
        if (nextProps.searchString.length >= config.emojiPluginDefaults.emojiTriggerCount) {
          this.getEmojis(nextProps.searchString);
        } else {
          this.clearEmojiSuggestions();
        }
      }
    }
  
    componentDidMount() {
      this.getEmojis(this.props.searchString);
      window.addEventListener('mousedown', this.pageClick, false);
    }
  
    componentWillUnmount() {
      window.removeEventListener('mousedown', this.pageClick, false);
    }
  
    @action('page Click')
    pageClick = () => {
      if (this.mouseDownInComponent) { return; }
      this.dropDownActive = false;
    }
      
    clearEmojiSuggestions = () => {
      this.emojiSuggestions = [];
    }
  
    async getEmojis(searchString: string) {
      try {
          // searchString = searchString.replace(this.emojiTrigger, '');
          let skin = store.get('skin');         
          if(searchString.trim() === ''||searchString.trim() === this.emojiTrigger)  return;        
        this.emojiSuggestions = emojiIndex.search(searchString, {maxResults:config.emojiPluginDefaults.suggestionFilterDefaultSize})
                                .map((emoji) =>Object.assign({ID:emoji.id, Name:emoji.colons, Skin:(skin?skin:1)}));       
        if (this.emojiSuggestions.length === 0) {
          this.dropDownActive = false;
        } else {
          this.dropDownActive = true;
        }
  
      } catch (e) {
        console.log('error in fetching emoji', e);
      }
    }
  
    keyCommand = (command: string) => {
      switch (command) {
        case this.selectHashKeyCommandHandeledHandeled:
          if (this.emojiSuggestions.length > 0) {
            this.onEmojiSelected(this.emojiSuggestions[this.currentSelectedUserIndex]);
          }
          return 'handled';
        case this.selectHashKeyCommandHandeledNotHandeled:
          if (this.emojiSuggestions.length > 0) {
            this.onEmojiSelected(this.emojiSuggestions[this.currentSelectedUserIndex]);
          }
          return 'not-handled';
        default: return 'not-handled';
      }     
    }
  
    keyPressed = (e) => {
      if (this.dropDownActive) {
        if (e.key.search(/\s/g) > -1) { return this.selectHashKeyCommandHandeledHandeled; }
        if (e.keyCode === 13) { return this.selectHashKeyCommandHandeledNotHandeled; } // new line
        }
      return null;
    }
  
    keyUp = (e) => {
      if (this.dropDownActive) {
        e.preventDefault();
        if (this.currentSelectedUserIndex > 0) { this.currentSelectedUserIndex--; }
      }
    }
  
    keyDown = (e) => {
      if (this.dropDownActive) {
        e.preventDefault();
        if (this.currentSelectedUserIndex < this.emojiSuggestions.length - 1) {
          this.currentSelectedUserIndex++;
        }
      }
    }
  
    onEscape = (e) => {
      if (this.dropDownActive) {
        e.preventDefault();
        this.dropDownActive = false;
      }
    }
    
    @action('on Emoji Selected')
    onEmojiSelected = (emoji: IEmojiData) => {
      this.dropDownActive = false;
      this.props.onEmojiSelected(emoji);
    }    
  
    render() {
      return (
          <span onMouseDown={() => this.mouseDownInComponent = true} onMouseUp={() => this.mouseDownInComponent = false}>
          {this.props.children}
          {this.dropDownActive && (
            <EmojisDropdown
              emojis={this.emojiSuggestions}
              onEmojiSelected={this.onEmojiSelected}
              selectIndex={this.currentSelectedUserIndex}
            />)
          }
        </span>
      );
    }
  }