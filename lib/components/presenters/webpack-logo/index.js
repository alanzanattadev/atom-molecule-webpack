'use babel'
import {React} from 'react-for-atom'

export class Icon extends React.Component {
    constructor(props) {
        super(props)

        this.listeners = {
            spin: this.spin.bind(this),
            reset: this.reset.bind(this)
        }

        this.state = {
            x: 0,
            y: 0,
            z: 0
        }
    }

    render() {
        let { x, y, z } = this.state,
            { theme, depth } = this.props

        return (
            <span ref={ ref => this.container = ref }
              className={ `webpack-icon -${theme}` }
              style={{
                width: `${depth}px`,
                marginLeft: `${depth * 0.5}px`,
                paddingBottom: `${depth * 0.5}px`
              }}>
              <figure className="webpack-icon-cube -outer"
                style={{
                  width: `${depth}px`,
                  height: `${depth}px`,
                  transform: `translateX(-50%)
                  scale3d(1,1,1)
                  rotateX(${x}deg)
                  rotateY(${y}deg)
                  rotateZ(${z}deg)`
                }}>
                { this._getFaces() }
              </figure>
              <figure className="webpack-icon-cube -inner"
                style={{
                  width: `${depth}px`,
                  height: `${depth}px`,
                  transform: `translateX(-50%)
                  scale3d(0.5,0.5,0.5)
                  rotateX(${-x}deg)
                  rotateY(${-y}deg)
                  rotateZ(${-z}deg)`
                }}>
                { this._getFaces() }
              </figure>
            </span>
        )
    }

    componentDidMount() {
        if (this.props.hover) {
            // this.container.addEventListener('mouseenter', this.listeners.spin)
            // this.container.addEventListener('mouseleave', this.listeners.reset)
        }
        this.interval = setInterval(() => {this.listeners.spin(); }, 500);
    }

    componentWillUnmount() {
        if (this.props.hover) {
            // this.container.removeEventListener('mouseenter', this.listeners.spin)
            // this.container.removeEventListener('mouseleave', this.listeners.reset)
        }
        clearInterval(this.interval);
    }

    /**
     * Get all faces for a cube
     *
     * @return {array} - An array of nodes
     */
    _getFaces() {
        return [
            'rotateX(0deg)',
            'rotateX(-90deg)',
            'rotateX(90deg)',
            'rotateY(-90deg)',
            'rotateY(90deg)',
            'rotateY(180deg)'
        ].map((rotation, i) => {
            return (
                <section key={ i } className="webpack-icon-cube-face"
                  style={{ transform: `${rotation} translateZ(${ this.props.depth / 2 }px)` }} />
            )
        })
    }

    /**
     * Get a random axis
     *
     * @return {string} - A random axis (i.e. x, y, or z)
     */
    _getRandomAxis() {
        let axes = Object.keys(this.state)

        return axes[ Math.floor(Math.random() * axes.length) ]
    }

    /**
     * Spin the cubes in opposite directions semi-randomly
     *
     * @param {object} e - Native event
     */
    spin(e) {
        let obj = {},
            axis = this._getRandomAxis(),
            sign = Math.random() < 0.5 ? -1 : 1

        obj[axis] = sign * 90

        this.setState(obj)
    }

    /**
     * Rotate the cubes back to their original position
     *
     * @param {object} e - Native event
     */
    reset(e) {
        this.setState({
            x: 0,
            y: 0,
            z: 0
        })
    }
}

// Check incoming props for issues
Icon.propTypes = {
    hover: React.PropTypes.bool,
    theme: React.PropTypes.string,
    depth: React.PropTypes.number
}

// Set up defaults
Icon.defaultProps = {
    hover: false,
    theme: 'dark',
    depth: 30
}

export default class Logo extends React.Component {
    constructor(props) {
        super(props)

        this.listeners = {
            spin: this._triggerSpin.bind(this),
            reset: this._triggerReset.bind(this)
        }
    }

    render() {
        return (
            <span className="webpack-logo" ref={ ref => this.container = ref }>
              <Icon ref={ ref => this.icon = ref }
                theme={ this.props.theme || 'dark' }
                depth={ 20 } />
              <span className={ `webpack-logo-text -${ this.props.theme || 'dark' }`}>Webpack</span>
            </span>
        )
    }

    componentDidMount() {
        this.container.addEventListener('mouseenter', this.listeners.spin)
        this.container.addEventListener('mouseleave', this.listeners.reset)
    }

    componentWillUnmount() {
        this.container.removeEventListener('mouseenter', this.listeners.spin)
        this.container.removeEventListener('mouseleave', this.listeners.reset)
    }

    /**
     * Proxy to Icon's spin method
     *
     * @param {object} e - Native event
     */
    _triggerSpin(e) {
        this.icon.spin(e)
    }

    /**
     * Proxy to Icon's reset method
     *
     * @param {object} e - Native event
     */
    _triggerReset(e) {
        this.icon.reset(e)
    }
}
