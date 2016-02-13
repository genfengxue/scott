import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Header extends Component {
  static propTypes = {
    back: PropTypes.string.isRequired,
    children: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {};
  }

  openSidebar() {
    this.state.open = true;
    this.setState(this.state);
  }

  closeSidebar() {
    this.state.open = false;
    this.setState(this.state);
  }

  render() {
    const open = this.state.open;
    return (
      <div className="header">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={this.props.back}>
                <i className="icon-left" />
              </Link>
            </li>
            <li className="nav-item pull-xs-right">
              <a className="nav-link" onClick={() => this.openSidebar()} >
                <i className="icon-hamburger" />
              </a>
            </li>
          </ul>
        </nav>
        <div className={'header-side-memu' + (open ? ' open' : '')}>
          <ul className="nav">
            {
              this.props.children.map((child, index) => {
                return (
                  <li key={index} className="nav-item" onClick={() => this.closeSidebar()}>
                    {child}
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className={'header-overlay' + (open ? ' open' : '')} onClick={() => this.closeSidebar()}>
        </div>
      </div>
    );
  }
}

export default Header;
