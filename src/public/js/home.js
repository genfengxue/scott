import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MobilePanel from './components/MobilePanel';
import EmailPanel from './components/EmailPanel';
import ProfilePanel from './components/ProfilePanel';
import homeReducer from './redux/homeReducer';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { actions as homeViewActions, HomeViewSections } from './redux/homeViewState';
import { actions as userActions } from './redux/user';

const middleware = applyMiddleware(thunk);
const store = compose(middleware)(createStore)(
  homeReducer, {}
);

const mapStateToProps = ({user, homeViewState, updateMobileState, updateEmailState}) => ({
  user, homeViewState, updateMobileState, updateEmailState,
});

class Home extends Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    store: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    updateMobileState: React.PropTypes.object,
    updateEmailState: React.PropTypes.object,
    fetchUserAsync: React.PropTypes.func.isRequired,
    homeViewState: React.PropTypes.string.isRequired,
    changeView: React.PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchUserAsync();
  }

  render() {
    const user = this.props.user;
    return (
      <Provider store={this.props.store}>
        <div className="content">
          {
            (() => {
              switch (this.props.homeViewState) {
              case HomeViewSections.UPDATE_MOBILE:
                return <MobilePanel updateMobileState={this.props.updateMobileState} dispatch={this.props.store.dispatch} />;
              case HomeViewSections.UPDATE_EMAIL:
                return <EmailPanel updateEmailState={this.props.updateEmailState} dispatch={this.props.store.dispatch} />;
              default:
                return <ProfilePanel user={user} dispatch={this.props.store.dispatch} />;
              }
            })()
          }
          <div className="bottom-nav">
            <a href="/change_password/">修改密码</a>
            <span className="spliter"></span>
            <a href="/logout/">登出</a>
          </div>
        </div>
      </Provider>
    );
  }
}

const HomeConnected = connect(mapStateToProps, Object.assign(homeViewActions, userActions))(Home);

ReactDom.render(<HomeConnected store={store} />, document.getElementById('app'));
