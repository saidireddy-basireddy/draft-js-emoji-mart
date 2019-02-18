import * as React from 'react';
import { IEmojiData } from '../../interfaces';
import EmojiSuggestion from './EmojiSuggestion';
import * as styles from './styles.less';
import { observer } from 'mobx-react';

// tslint:disable-next-line:interface-name
export interface IEmojisDropdown {
    emojis: Array<IEmojiData>;
    onEmojiSelected: (emoji: IEmojiData) => void;
    selectIndex: number;
}

@observer
export class EmojisDropdown extends React.Component<IEmojisDropdown, {}> {
    render() {
        return (
            <div className={styles.emojisWrapper}>       
             <ul contentEditable={false}>         
                    {this.props.emojis.map((emoji: IEmojiData, index) => {
                        return (
                            <li
                                key={index}
                                tabIndex={index}
                                onClick={(e) => { e.stopPropagation(); this.props.onEmojiSelected(emoji); }}
                                className={this.props.selectIndex === index ? styles.emojiSuggestionSelected : ''}
                            >
                                <EmojiSuggestion {...emoji} />
                            </li>
                        );
                    })} 
                </ul>               
            </div>
        );
    }
}