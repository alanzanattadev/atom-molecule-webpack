'use babel';
import WebpackStatusTile from "./components/presenters/StatusBarWebpackTile";
import WebpackTaskRunnerToolBar from './components/presenters/WebpackTaskRunnerToolBar';
import WebpackDiagnosticsPane from './components/presenters/WebpackDiagnosticsPane';
import MoleculeWebpackView from './molecule-webpack-view';
import ConnectedStatusBarTile from "./components/containers/ConnectedStatusBarTile";
import ConnectedDiagnosticsTable from "./components/containers/ConnectedDiagnosticsTable";
import ConnectedToolBar from "./components/containers/ConnectedToolBar";
import {React, ReactDOM} from 'react-for-atom';
import { CompositeDisposable } from 'atom';
import actions from "./redux/actions";
import store from "./redux/store";


export default {

  moleculeWebpackView: null,
  moleculeWebpackTaskBar: null,
  moleculeWebpackDiagnostics: null,
  webpackTaskBar: null,
  subscriptions: null,

  activate(state) {
    // this.moleculeWebpackView = new MoleculeWebpackView(state.moleculeWebpackViewState);
    // this.webpackTaskBar = atom.workspace.addModalPanel({
    //   item: this.moleculeWebpackView.getElement(),
    //   visible: false
    // });
    this.moleculeWebpackTaskBar = new MoleculeWebpackView(state.moleculeWebpackViewState);
    this.moleculeWebpackDiagnostics = new MoleculeWebpackView(state.moleculeWebpackViewState);
    this.webpackTaskBar = atom.workspace.addTopPanel({
      item: this.moleculeWebpackTaskBar.getElement(),
      visible: false
    });

    this.webpackDiagnostics = atom.workspace.addBottomPanel({
      item: this.moleculeWebpackDiagnostics.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'molecule-webpack:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.webpackTaskBar.destroy();
    this.subscriptions.dispose();
    this.moleculeWebpackView.destroy();
  },

  serialize() {
    return {
    };
  },

  consumeStatusBar: function(statusBar) {
    this.statusBar = statusBar;
    this.webpackStatusBarView = document.createElement('div');
    this.webpackStatusBarView.classList.add("molecule-webpack-status-bar");
    this.statusTile = this.statusBar.addRightTile({
      item: this.webpackStatusBarView,
      priority: 3000
    });
    ReactDOM.render((
      <ConnectedStatusBarTile>
        <WebpackStatusTile onClick={() => this.toggle()}/>
      </ConnectedStatusBarTile>
    ), this.webpackStatusBarView);
  },

  toggle() {
    console.log('MoleculeWebpack was toggled!');
    // let Container = ({children}) => (<div>{children}</div>);
    // ReactDOM.render((
    //   <Container>
    //     <WebpackLogo theme="dark"/>
    //   </Container>
    // ), this.moleculeWebpackView.getElement());
    ReactDOM.render((
      <ConnectedToolBar>
        <WebpackTaskRunnerToolBar/>
      </ConnectedToolBar>
    ), this.moleculeWebpackTaskBar.getElement());
    ReactDOM.render((
      <ConnectedDiagnosticsTable>
        <WebpackDiagnosticsPane/>
      </ConnectedDiagnosticsTable>
    ), this.moleculeWebpackDiagnostics.getElement());
    if (this.webpackTaskBar.isVisible()) {
      this.webpackTaskBar.hide()
    } else {
      store.dispatch(actions.findWebpackConfigs());
      this.webpackTaskBar.show();
    }
    this.webpackDiagnostics.isVisible() ? this.webpackDiagnostics.hide() : this.webpackDiagnostics.show();
  }

};
