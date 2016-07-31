'use babel'

import {fork} from 'child_process';
import path from 'path';
import loophole from 'loophole';
import fs from 'fs';
var {allowUnsafeEval, allowUnsafeNewFunction} = loophole;
loophole.Function.prototype = Function.prototype;

export default {
  buildProgressUpdated(progress) {
    return {
      type: "BUILD_PROGRESS_UPDATED",
      payload: {
        progress
      }
    };
  },

  launchWDS() {

  },

  stopWDS() {

  },

  webpackConfigFileFound(filePath) {
    return {
      type: "WEBPACK_CONFIG_FOUND",
      payload: {
        path: filePath
      }
    };
  },

  findWebpackConfigs() {
    return (dispatch) => {
      let findFiles = (regex) => {
        return new Promise((resolve, reject) => {
          let helper = (cwd, regex) => {
            let entries = fs.readdirSync(cwd);
            let files = entries.reduce((total, entry) => {
              let fullPath = path.join(cwd, entry);
              if (entry.indexOf('node_modules') != -1) {
                return total;
              } else if (fs.statSync(fullPath).isFile()) {
                if (fullPath.match(regex)) {
                  return total.concat([fullPath]);
                } else {
                  return total;
                }
              } else if (fs.statSync(fullPath).isDirectory()) {
                return total.concat(helper(fullPath, regex));
              } else {
                return total;
              }
            }, []);
            return files;
          }
          let projects = atom.project.getPaths();
          let files = projects
                        .map(project => helper(project, regex))
                        .reduce((total, files) => total.concat(files), []);
          resolve(files);
        });
      }

      findFiles(/\.config\.js$/)
        .then(files => {
          files.forEach(file => dispatch(this.webpackConfigFileFound(file)))
        })
    }
  },

  updateStatus(warnings, errors) {
    return {
      type: "WEBPACK_STATUS_UPDATE",
      payload: {
        warnings,
        errors
      }
    };
  },

  run(config, dispatch) {
    if (!this.child) {
      this.child = fork(__dirname + '/../process/webpack.js', [], {
        cwd: path.dirname(config.path),
        env: {
          WEBPACK_CONFIG_FILE_PATH: config.path,
          WEBPACK_WATCH: config.watch || undefined
        },
        silent: true
      });
      this.child.stdout.on('data', (data) => console.log(`[Webpack Child ${this.child.pid}] ${data}`));
      this.child.stderr.on('data', (data) => console.log(`[Webpack Child ${this.child.pid}] ${data}`));
      console.log(`Child process with pid ${this.child.pid}`);
      dispatch(this.buildProgressUpdated(0));
      this.child.on('message', (message) => {
        if (message.progress)
          dispatch(this.buildProgressUpdated(Math.trunc(message.progress)));
        if (message.status) {
          dispatch(this.updateStatus(message.webpackWarnings, message.webpackErrors));
        }
      });
      this.child.on('exit', () => {
        console.log(`Webpack, pid ${this.child.pid} has exited`);
        this.child = null;
      });
    }
  },

  stop() {
    return (dispatch) => {
      if (this.child) {
        this.child.kill();
      }
    }
  },

  build(config) {
    return (dispatch) => {
      this.run(config, dispatch);
    }
  },

  watch(config) {
    return (dispatch) => {
      this.run(Object.assign({watch: true}, config), dispatch);
    }
  },

  webpackConfigurationSelected(config) {
    return {
      type: "WEBPACK_CONFIG_SELECTED",
      payload: config
    };
  }

}
