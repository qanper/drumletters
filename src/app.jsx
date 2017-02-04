import React from 'react';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';
import { findDOMNode } from 'react-dom';

import { createStore, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";
import configureStore from './store';
import * as BS from 'react-bootstrap';
import {Checkbox} from 'react-icheck';


import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("app");
log.setLevel(Logger.DEBUG);

const ColSize = 12;

class Tap extends React.Component {
  render() {
    let icon = this.props.value
      ? "\u25CF"
      : "\u25CB";
    let suffix = (this.props.active ? "active" : "inactive");

    return <div className={"drumletters-tap drumletters-bigletter-"+suffix}> {icon} </div>
  }
}

class Letter extends React.Component {
  render() {
    let taps = [true,true,false,true];
    let tapsElements = taps.map(
      (tap, idx) => <BS.Col key={idx} md={Math.floor(ColSize/taps.length)}>
        <Tap value={tap} active={this.props.active}/>
      </BS.Col>
    );
    let suffix = (this.props.active ? "active" : "inactive");
    return <div className="drumletters-letter-container">
      <BS.Row className={"drumletters-bigletter drumletters-bigletter-" + suffix}> {this.props.value} </BS.Row>
      <BS.Row className={"drumletters-taps"}>{tapsElements}</BS.Row>
    </div>;
  }
}

class MetroTempo extends React.Component {
  commitChange() {
    let value = parseInt(findDOMNode(this.refs.tempo).value);
    log.debug("commitChange", value);
    if(value > 250) {
      this.props.onChange(250);
    } else if (value < 30) {
      this.props.onChange(30);
    } else {
      this.props.onChange(value);
    }
  }

  increaseTempo(event) {
    let value = this.props.value;
    if(this.props.value < 250) {
      this.props.onChange(value + 5);
    }
  }

  decreaseTempo(event) {
    let value = this.props.value;
    if(value > 30) {
      this.props.onChange(value - 5);
    }
  }

  render() {
    return <div  className="drumletters-footer-panel">
      <BS.FormGroup>
        <BS.InputGroup>
          <BS.InputGroup.Button>
            <BS.Button onClick={::this.decreaseTempo}><BS.Glyphicon glyph="chevron-left"/></BS.Button>
          </BS.InputGroup.Button>
          <div key={this.props.value}>
            <BS.FormControl
              type="text"
              defaultValue={this.props.value}
              ref="tempo"
            />
          </div>
          <BS.InputGroup.Button> 
            <BS.Button onClick={::this.commitChange}>
              <BS.Glyphicon glyph="ok"/>
            </BS.Button>
          </BS.InputGroup.Button>
          <BS.InputGroup.Button>
            <BS.Button onClick={::this.increaseTempo}><BS.Glyphicon glyph="chevron-right"/></BS.Button>
          </BS.InputGroup.Button>
        </BS.InputGroup>
      </BS.FormGroup>
    </div>;
  }
}


class Page extends React.Component {
  changeHandler() {
    log.debug("changeHandler");
  }

  render() {
    let letters = ["A","B","C","D"];
    let lettersElements = letters.map(
      (letter, idx) => <BS.Col key={idx} md={Math.floor(ColSize/letters.length)}>
        <Letter value={letter} active={idx == 1}/>
      </BS.Col>
    );

    let selectors = [];
    for(let i = 65; i <= 80; i++) {
      selectors.push(String.fromCharCode(i));
    }

    let selectorElements = selectors.map(
      (selector,idx) => <div key={idx} className="drumletters-selector-checkbox">
        <Checkbox
        checkboxClass="icheckbox_flat-blue"
        increaseArea="20%"
        defaultChecked={true}
        />
        <span className="drumletters-selectors-checkbox-text"> {selector}</span>
      </div>
    );

    let metroBeats = <BS.ButtonGroup>
      <BS.Button> 4</BS.Button>
      <BS.Button> 8</BS.Button>
      <BS.Button>16</BS.Button>
      <BS.Button><img src="images/magic.png" width="18px" /></BS.Button>
    </BS.ButtonGroup>;


    let sequencer = <div>Секвенсер</div>;

    let sequencerSize = <BS.FormGroup>
      <BS.InputGroup>
        <BS.InputGroup.Button>
          <BS.Button><BS.Glyphicon glyph="chevron-left"/></BS.Button>
        </BS.InputGroup.Button>
        <BS.FormControl type="text" defaultValue="2"/>
        <BS.InputGroup.Button>
          <BS.Button><BS.Glyphicon glyph="chevron-right"/></BS.Button>
        </BS.InputGroup.Button>
      </BS.InputGroup>
    </BS.FormGroup>;

    let sequencerType = <BS.ButtonGroup>
      <BS.Button><BS.Glyphicon glyph="arrow-left"/></BS.Button>
      <BS.Button><BS.Glyphicon glyph="random"/></BS.Button>
      <BS.Button><BS.Glyphicon glyph="arrow-right"/></BS.Button>
    </BS.ButtonGroup>;

    return (
      <div className="drumletters-wrapper">
        <div className="drumletters-title">
          Benny Greb letters for drummers
        </div>
        <BS.Row className="drumletters-main">
          <BS.Col md={11} className="drumletters-letters-container">
            <div className="drumletters-letters">
              {lettersElements}
            </div>
          </BS.Col>
          <BS.Col md={1} className="drumletters-selectors-container">
            {selectorElements}
          </BS.Col>
        </BS.Row>
        <BS.Row className="drumletters-footer">
          <BS.Col mdOffset={1} md={2} className="">
            <MetroTempo value={this.props.state.tempo} onChange={this.props.actions.setTempo}/>
          </BS.Col>
          <BS.Col md={2} className="">
            {metroBeats}
          </BS.Col>
          <BS.Col md={2} className="drumletters-metro">
            <div className="drumletters-play">
              <BS.Glyphicon glyph="play-circle"/>
            </div>
          </BS.Col>
          <BS.Col mdOffset={1} md={2} className="drumletters-sequencer-size">
            {sequencerSize}
          </BS.Col>
          <BS.Col md={2} className="drumletters-sequencer">
            {sequencerType}
          </BS.Col>
        </BS.Row>
      </div>
    )
  }
}

const store = configureStore();

function state2Page (state) {
  return {
    state
  }
}

function dispatch2Props(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  }
}


export default class App extends React.Component {
  render() {
    //
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={
            connect(state2Page, dispatch2Props)(Page)
          }>
            
          </Route>
        </Router>
      </Provider>
    )
  }
}
