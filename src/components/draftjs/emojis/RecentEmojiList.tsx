import * as React from 'react';
import { Emoji } from 'emoji-mart';
import * as emojiStyles from './styles.less';
// import FaAngleDown from 'react-icons/lib/fa/angle-down';
import { IEmojiData } from '../../interfaces';
// tslint:disable

export interface IRecentEmojiList {    
    emojis: IEmojiData[];
    onClick:(emoji: IEmojiData) => void;
    onHide:() => void;
  }
  export default class RecentEmojiList extends React.Component<IRecentEmojiList, {}> {
    render() {
  return (
    <div className={emojiStyles.recentEmojiListContainer}>
      {/* <div className={emojiStyles.RecentEmojiListHideButton} onClick={this.props.onHide}>
        <FaAngleDown size={40} className={emojiStyles.RecentEmojiListhideButtonIcon} />
      </div>  */}
      <div className={emojiStyles.recentEmojiListList}>
        {this.props.emojis.map(emoji => (
          <span key={emoji.ID} className={emojiStyles.recentEmojiListItem}>
            <Emoji
              onClick={this.props.onClick}
              sheetURL="img/sheet_apple_64.png"
              emoji={{id:emoji.ID, skin: 1}}
              size={22}
              skin={1}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
  }

