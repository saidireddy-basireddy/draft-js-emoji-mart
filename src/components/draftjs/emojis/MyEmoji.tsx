import * as React from 'react';
import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { IEmojiData } from '../../interfaces';
import * as emojiStyles from './styles.less';
// tslint:disable
interface IMyEmoji {
  emoji: IEmojiData;
}
export default class MyEmoji extends React.Component<IMyEmoji, {}> {
  render() {
    return (
      <span className={emojiStyles.emojiWrapper}>
        <Emoji
          sheetURL="img/sheet_apple_64.png"
          emoji={{id:this.props.emoji.ID, skin: this.props.emoji.Skin}}
          size={22}
          skin={this.props.emoji.Skin}
          tooltip={true}
        >
         {this.props.children}
        </Emoji>
      </span>
    );
  }
} 