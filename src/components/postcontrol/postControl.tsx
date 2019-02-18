// tslint:disable
// tslint:disable:jsx-no-string-ref
import * as React from 'react';
import { observer } from 'mobx-react';
import { MyDraft } from '../draftjs';
import config from '../../config';
import * as styles from './styles.less';

@observer
export class PostControl extends React.Component<{}, {}> {
  myDraft: MyDraft;
  
  onChange = (content: string, text: string) => {
  }

  async onSaveContent() {
    this.myDraft.setContent();
  }

  onClear = () => {
    this.myDraft.setContent();
  }

  render() {       
    let title = "Draft-JS - Emoji-Mart";
    return (
      <div >       
          <h1 className={styles.appTitle}>{title}</h1>       
          
          <fieldset>            
            <div >
              <div >
                <MyDraft
                  ref={myDraft => this.myDraft = myDraft}
                  onChange={this.onChange}
                  placeholder={config.postControlPlaceholder}
                />
              </div>
            </div>
          </fieldset>
      </div>
    );
  }
}
