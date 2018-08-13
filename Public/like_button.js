'use strict';

const e = React.createElement;

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: ''};
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}
const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
