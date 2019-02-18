import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Emoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { IEmojiData } from '../../interfaces';
import * as emojiStyles from './styles.less';
// tslint:disable

export interface IEmojiPicker {    
    onSelectEmoji: (emoji: IEmojiData) => void;
    showRecentEmojiList:( isOpen:boolean) => void;
  }
@observer
export default class EmojiPicker extends React.Component<IEmojiPicker, {}> {
  @observable isOpen = false;
  @observable mouseDownInComponent = false;   

  constructor(props) {
    super(props)    
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    this.onSelectEmoji = this.onSelectEmoji.bind(this);
  }
 @action("Toggle Emoji Picker")
  toggleEmojiPicker = () => { 
    this.isOpen = true;
    this.props.showRecentEmojiList(!this.isOpen);
  }
  @action("On Emoji Selected")
  onSelectEmoji =(emoji) => {
    this.props.onSelectEmoji(emoji);
  }
  componentDidMount() {    
    window.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.pageClick, false);
  }

  pageClick = () => {
    if (this.mouseDownInComponent) { return; }    
    this.isOpen = false;
  }



  render() {    
    /* const customEmojis = [
      { id: 'Octocat',
        name: 'Octocat',
        short_names: ['octocat'],
        text: '',
        emoticons: [],
        keywords: ['github'],
        imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
      },
    ] */
    return (
      <div className={emojiStyles.pickerContainer}>
        <span ref="picker" className={emojiStyles.emojiPickerButton} onClick={this.toggleEmojiPicker}>
          <Emoji            
            sheetURL="img/sheet_apple_64.png"
            emoji={{id:'slightly_smiling_face', skin: 1}}
            size={22}
            skin={1}
          />
        </span>
        <span onMouseDown={() => this.mouseDownInComponent = true} onMouseUp={() => this.mouseDownInComponent = false}>
        {this.isOpen && (          
            <div className={emojiStyles.picker}>
              <Picker
                sheetURL="img/sheet_apple_64.png"
                onSelect={this.onSelectEmoji}
                title='Pick your emoji…' 
                emoji='point_up'
                perLine={9}                
                emojiTooltip = {true}
                autoFocus = {true}   
               // custom = {customEmojis}            
              />
            </div>          
        )}
        </span>
      </div>
    )
  }
}