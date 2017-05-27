/* eslint-disable no-console, react/forbid-prop-types */

import Cookies from 'universal-cookie';
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Login from 'shared/components/login/login';
import familyImage from 'images/Family-2.png';
import SignUp from './signup/signup';
import MentorRequestsTable from './mentor/mentorRequestsTable/mentorRequestsTable';
import SquadsTable from './squads/squadsTable/squadsTable';
import Dashboard from './dashboard/dashboard';
import MentorsTable from './mentor/mentorsTable/mentorsTable';
import Thanks from './thanks/thanks';
import styles from './home.css';
import Header from './header/header';
import Landing from './landing/landing';
import Footer from './footer/footer';
import MentorRequest from './mentorRequest/mentorRequest';
import SquadsNew from './squads/squadsNew/squadsNew';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgImage: false,
      bgImageUrl: null,
      signedIn: false,
      mentor: false
    };

    this.props.history.listen((location) => {
      this.setBgImage(location);
    });
  }

  componentWillMount() {
    this.setBgImage(this.props.location);
    this.setSessionCookies();
  }

  setBgImage(location) {
    if (location.pathname === '/') {
      this.setState({ bgChanged: !(this.state.bgImage), bgImage: true, bgImageUrl: familyImage });
    } else {
      this.setState({ bgChanged: this.state.bgImage, bgImage: false, bgImageUrl: null });
    }
  }

  setSessionCookies = () => {
    const cookies = new Cookies();
    this.setState({
      mentor: !!cookies.get('mentor'),
      signedIn: !!cookies.get('token')
    });
  }

  handleSignIn = () => {
    this.setSessionCookies();
    window.location = '/home';
  }

  logOut = () => {
    const cookies = new Cookies();
    cookies.remove('token');
    cookies.remove('firstName');
    cookies.remove('lastName');
    cookies.remove('slackName');
    cookies.remove('mentor');
    window.location = '/';
  }

  render() {
    const { mentor, signedIn } = this.state;
    const authProps = {
      signedIn,
      mentor
    };
    const classes = classNames({
      [`${styles.home}`]: true,
      [`${styles.backgroundImage}`]: this.state.bgImage
    });
    return (
      <div
        className={classes}
        style={(this.state.bgImage) ? { backgroundImage: `url(${this.state.bgImageUrl})` } : {}}
      >
        <Header transparent={this.state.bgImage} logOut={this.logOut} signedIn={signedIn} mentor={mentor} />
        <div className={styles.main} >
          <Route
            exact
            path="/"
            render={props => (
              <Landing {...props} />
            )}
          />
          <Route
            exact
            path="/"
            component={Landing}
          />
          <Route
            path="/home"
            component={Dashboard}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <Login handleSignIn={this.handleSignIn} />
            )}
          />
          <Route
            path="/signup"
            component={SignUp}
          />
          <Route
            path="/join"
            component={SignUp}
          />
          <Route
            path="/sign_up"
            component={SignUp}
          />
          <Route
            path="/thanks"
            component={Thanks}
          />
          <Route
            path="/mentor-request"
            render={() => (
              <MentorRequest {...authProps} />
            )}
          />
          <Route
            path="/requests"
            render={() => (
              <MentorRequestsTable {...authProps} />
            )}
          />
          <Route
            path="/squads/new-squad"
            render={() => (
              <SquadsNew {...authProps} />
            )}
          />
          <Route
            exact path="/mentors"
            render={() => (
              <MentorsTable {...authProps} />
            )}
          />
          <Route
            path="/squads"
            render={() => (
              <SquadsTable {...authProps} />
            )}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

Home.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(Home);
