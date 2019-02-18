import * as React from 'react';
import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { IEmojiData } from '../../interfaces';
import * as emojiStyles from './styles.less';
// tslint:disable
const EmojiSuggestion = (props: IEmojiData) => {
    return (
      <div className={emojiStyles.emojiSuggestion}>
        <Emoji
          sheetURL="img/sheet_apple_64.png"
          emoji={{id:props.ID, skin: props.Skin}}
          size={22}
          skin={props.Skin}
          tooltip={true}
        />
      </div>
    )
  }

  export default EmojiSuggestion;