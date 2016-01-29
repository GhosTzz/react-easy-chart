import React from 'react';
import ReactDom from 'react-dom';
import {escapeHTML} from '../util';
import ToolTip from '../ToolTip';
import {AreaChart} from 'react-easy-chart';
import moment from 'moment';
import {format} from 'd3-time-format';
import Scrollspy from 'react-scrollspy';

class AreaChartContainer extends React.Component {
    constructor(props) {
      super(props);
      // Generate multiple Areas of data
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
      const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
      this.state = {
        showToolTip: false,
        windowWidth: initialWidth - 100,
        componentWidth: 300
      };
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.handleResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    handleResize() {
      this.setState({
        windowWidth: window.innerWidth - 100,
        componentWidth: this.refs.component.offsetWidth
      });
    }

    mouseOverHandler(d, e) {
      this.setState({
        showToolTip: true,
        top: `${e.screenY - 10}px`,
        left: `${e.screenX + 10}px`,
        y: d.y,
        x: d.x});
    }

    mouseMoveHandler(e) {
      if (this.state.showToolTip) {
        this.setState({top: `${e.y - 10}px`, left: `${e.x + 10}px`});
      }
    }

    mouseOutHandler() {
      this.setState({showToolTip: false});
    }

    clickHandler(d) {
      this.setState({dataDisplay: `The amount selected is ${d.y}`});
    }

    generateData() {
      const data = [];
      const xs = [];

      let date = moment('2015-1-1 00:00', 'YYYY-MM-DD HH:mm');
      for (let i = 1; i <= 12; i++) {
        xs.push(date.format('D-MMM-YY HH:mm'));
        date = date.add(1, 'hour');
      }
      xs.map((x) => {
        data.push({x: x, y: this.getRandomArbitrary(0, 100)});
      });
      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 400)});
    }

    turnOffRandomData() {
      clearInterval(this.state.randomDataIntervalId);
      this.setState({randomDataIntervalId: null});
    }

    updateData() {
      const parseDate = format('%d-%b-%y %H:%M').parse;
      this.data.map((data) => {
        data.shift();
        let y = this.getRandomArbitrary(
          data[data.length - 1].y - 20,
           data[data.length - 1].y + 20);
        if (y < 0 || y > 100) y = data[data.length - 1].y;
        const date = moment(parseDate(data[data.length - 1].x));
        date.add(1, 'hour');
        data.push({x: date.format('D-MMM-YY HH:mm'), y: y});
      });

      this.forceUpdate();
    }

    toggleState() {
      this.setState({
        active: !this.state.active
      });
    }

    render() {
      const cn = this.state.active ? 'menu active' : 'menu';
      return (<div>
        <aside id="menu" className={cn}>
          <a id="menuToggle" className="menu__toggle" aria-hidden="true" href="#" onClick={this.toggleState.bind(this)}>
            <span>Toggle menu</span>
          </a>
          <nav className="menu__nav">
            <ul>
              <li><a href="../" className="menu__all-charts">&#8592; All charts</a></li>
            </ul>
            <Scrollspy
              items={
                ['introduction',
                'data',
                'heightAndWidth',
                'margin',
                'axes',
                'yaxesorientation',
                'axesLabels',
                'interpolate',
                'axisType',
                'grid',
                'verticalGrid',
                'domainRange',
                'tickDisplay',
                'tickAmount',
                'dataPoints',
                'mouseHandlers',
                'clickHandler',
                'areaColors',
                'areaGradient',
                'updateData',
                'fluid'
                ]
              }
              currentClassName="active"
            >
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#data">Data</a></li>
              <li><a href="#heightAndWidth">Height &amp; Width</a></li>
              <li><a href="#margin">Margin</a></li>
              <li><a href="#axes">Axes</a></li>
              <li><a href="#yaxesorientation">Y Axis orientation</a></li>
              <li><a href="#axesLabels">Axes labels</a></li>
              <li><a href="#interpolate">Interpolate</a></li>
              <li><a href="#axisType">Axis type</a></li>
              <li><a href="#grid">Grid</a></li>
              <li><a href="#verticalGrid">Vertical Grid</a></li>
              <li><a href="#domainRange">Domain range</a></li>
              <li><a href="#tickDisplay">Tick display</a></li>
              <li><a href="#tickAmount">Number of ticks</a></li>
              <li><a href="#dataPoints">Data points</a></li>
              <li><a href="#mouseHandlers">Mouse handlers</a></li>
              <li><a href="#clickHandler">Click handlers</a></li>
              <li><a href="#areaColors">Area colors</a></li>
              <li><a href="#areaGradient">Area Gradient</a></li>
              <li><a href="#updateData">Updating the data</a></li>
              <li><a href="#fluid">Fluid</a></li>
            </Scrollspy>
          </nav>
        </aside>
        <div className="content">
        <h1>The React Easy Area chart </h1>
        <div ref="component">
          <AreaChart
            data={this.data}
            datePattern={'%d-%b-%y %H:%M'}
            xType={'time'}
            width={this.state.componentWidth}
            height={this.state.componentWidth / 2}
            interpolate={'cardinal'}
            yDomainRange={[0, 100]}
            axisLabels={{x: 'Hour', y: 'Percentage'}}
            style={{'.Area0':
            {
              stroke: 'green'
            }}}
          />
        </div>
        <h2 id="introduction">Introduction</h2>
        <p>An area chart or area graph displays graphically quantitive data. It is based on the line chart. The area between axis and line are commonly emphasized with colors, textures and hatchings.<sup>(<a href="https://en.wikipedia.org/wiki/Area_chart">ref</a>)</sup></p>
        <h2 id="data">Data</h2>
        <p>At the most basic the Area chart can just take a single data file supplied in a JSON format and will render a
         simple Area chart.</p>
        <p>The format of the data is an array of arrays which allows multiple Areas to be generated.
        The x field represents the x axis and the y the y axis. This is to unify the data accross R2-D3 charts.</p>

        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}]]}/>
        `)}}
        />
        </pre>

        <AreaChart
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}]]}
        />
        <p>If a second Area is needed then this is easily added by adding a new data array to the existing array. The number of Areas drawn is infinite but only coloured up to 4 Areas.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />
        <h2 id="heightAndWidth">Height and Width</h2>
        <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
width={50}
height={50}
data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          width={50}
          height={50}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h2 id="margin">Margin</h2>
        <p>The Margin can be overridden by passing in a margin object. The margin object must define the following: top, right, bottom and left</p>
        <p>This can be particulary useful if a label is cut off.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
margin={{top: 30, right: 30, bottom: 30, left: 30}}
width={250}
height={250}
data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          margin={{top: 30, right: 30, bottom: 30, left: 30}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h2 id="axes">Axes</h2>
        <p>The axes can be turned on by simply passing a boolean flag to true for <b>axes</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  axes
  width={250}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          axes
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h2 id="axesLabels">Axes labels</h2>
        <p>The axes labels can be overridden by simply passing <b>axisLabels</b> object with both a x and y value.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  axes
  margin={{top: 10, right: 10, bottom: 50, left: 50}}
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={250}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          axes
          margin={{top: 10, right: 10, bottom: 50, left: 50}}
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h2 id="yaxesorientation">Y Axis orientation</h2>
          <p>The Y axis can be placed on the right hand side by passing a boolean flag to true for yAxisOrientRight</p>
           <pre>
           <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
 axes
 axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
 yAxisOrientRight
 width={450}
 height={250}
 data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
           `)}}
           />
           </pre>
          <AreaChart
            axes
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            yAxisOrientRight
            width={350}
            height={250}
            data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
          />

        <h2 id="interpolate">Interpolate (making the Areas smooth)</h2>
        <p>The Areas drawn can be set to be interpolated by passing in an interpolated param. By default this is set to linear.
        We can though override this for instance to make a cardinal Area. The options that can be chosen can be found <a href="https://github.com/mbostock/d3/wiki/SVG-Shapes">here</a> under the interpolate section.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  axes
  margin={{top: 10, right: 10, bottom: 50, left: 50}}
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={250}
  interpolate={'cardinal'}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <AreaChart
          interpolate={'cardinal'}
          axes
          margin={{top: 10, right: 10, bottom: 50, left: 50}}
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h2 id="axisType">Axis type</h2>
        <p>The data passed associated to the particular axes can be in numeric, date (the default
           format is for example 1-Jan-15 but can be overridden)
         or textual formats (used for labelling). </p>
        <p>For the example below the data for the x is text and so the <b>xType</b> needs to be changed to <b>text</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'text'}
  axes
  width={350}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 'Mon', y: 20}, {x: 'Tue', y: 10}, {x: 'Wed', y: 33}, {x: 'Thu', y: 45}, {x: 'Fri', y: 15}],
    [{x: 'Mon', y: 10}, {x: 'Tue', y: 15}, {x: 'Wed', y: 13}, {x: 'Thu', y: 15}, {x: 'Fri', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'text'}
          axes
          interpolate={'cardinal'}
          width={350}
          height={250}
          data={[
            [{x: 'Mon', y: 20}, {x: 'Tue', y: 10}, {x: 'Wed', y: 33}, {x: 'Thu', y: 45}, {x: 'Fri', y: 15}],
            [{x: 'Mon', y: 10}, {x: 'Tue', y: 15}, {x: 'Wed', y: 13}, {x: 'Thu', y: 15}, {x: 'Fri', y: 10}]
          ]}
        />
        <p>Setting the <b>xType</b> to be <b>time</b></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <p>Setting the <b>yType</b> to be <b>text</b>. (The yDomainRange has also been set to keep the range order.)</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  yType={'text'}
  xType={'text'}
  axes
  margin={{top: 0, right: 0, bottom: 100, left: 100}}
  yDomainRange={['Allot', 'Middle', 'Less']}
  interpolate={'cardinal'}
  width={350}
  height={250}
  data={[
    [{x: 'Mon', y: 'Less'}, {x: 'Tue', y: 'Middle'}, {x: 'Wed', y: 'Middle'}, {x: 'Thu', y: 'Less'}, {x: 'Fri', y: 'Middle'}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          yType={'text'}
          xType={'text'}
          axisLabels={{x: 'Day', y: 'How much did I eat'}}
          axes
          interpolate={'cardinal'}
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          width={350}
          height={250}
          yDomainRange={['Allot', 'Perfect', 'Little']}
          data={[
            [{x: 'Mon', y: 'Little'}, {x: 'Tue', y: 'Perfect'}, {x: 'Wed', y: 'Allot'}, {x: 'Thu', y: 'Little'}, {x: 'Fri', y: 'Perfect'}]
          ]}
        />

        <h2 id="grid">Grid</h2>
        <p>A grid can be added to the graph by just passing in a boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  grid
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          grid
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <h2 id="verticalGrid">Vertical Grid</h2>
        <p>A vertical grid can be added to the graph by just passing in a boolean for verticalGrid.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  grid
  verticalGrid
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          grid
          verticalGrid
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <h2 id="domainRange">Domain Range</h2>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest x and y values.</p>
        <p>The range can be fixed by passing an array param of 2 numbers for the particular axis.
        The first number is the bottom of the range the second is the higher point of the range.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  axes
  xDomainRange={[0, 100]}
  yDomainRange={[0, 100]}
  margin={{top: 0, right: 0, bottom: 100, left: 100}}
  width={750}
  height={250}
  interpolate={'cardinal'}
  data={  [
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 4}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          axes
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          width={750}
          height={250}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />
      <h2 id="tickDisplay">Tick display format</h2>
        <p>If the x or y axis  has an xType/yType of time then a display for the axis can be overridden by setting the tickTimeDisplayFormat.</p>
        <p>The options are very flexible and can be seen here <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">Time Formatting</a></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  grid
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          grid
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <h2 id="tickAmount">Setting the tick numbers</h2>
        <p>The number of ticks on the x and y axis can be set by passing in a number to xTicks or yTicks.
        This can make the axis easier to read.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  xTicks={5}
  yTicks={3}
  grid
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          xTicks={5}
          yTicks={3}
          grid
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

      <h2 id="dataPoints">Data Points</h2>
        <p>Data points can be added to the Area chart by simply passing a dataPoints boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  dataPoints
  xTicks={5}
  yTicks={3}
  grid
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          dataPoints
          xTicks={5}
          yTicks={3}
          grid
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <h2 id="mouseHandlers">Mouse handlers</h2>
        <p>The chart will send out a mouseOver event, mouseMove and mouseOut event from the dataPoints (see above). The dataPoints will need to be set. This can be used by your react application in anyway you would require.
         The event handlers provides the mouse event and the point data. The mouse event can for instance provide the x and y coordinates which can be used for a tool tip.
          The data is related to the point currently moused over.</p>
          <pre>
          <code dangerouslySetInnerHTML={{__html: escapeHTML(`
mouseOverHandler(d, e) {
  this.setState({
    showToolTip: true,
    top: \`\${e.screenY - 10}px\`,
    left: \`\${e.screenX + 10}px\`,
    y: d.y,
    x: d.x});
}

mouseMoveHandler(e) {
  if (this.state.showToolTip) {
    this.setState({top: \`\${e.y - 10}px\`, left: \`\${e.x + 10}px\`});
  }
}

mouseOutHandler() {
  this.setState({showToolTip: false});
}

{this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of x is {this.state.x} and the value of y is {this.state.y}</ToolTip> : null}

<AreaChart
  xType={'time'}
  axes
  dataPoints
  xTicks={5}
  yTicks={3}
  grid
  mouseOverHandler={this.mouseOverHandler.bind(this)}
  mouseOutHandler={this.mouseOutHandler.bind(this)}
  mouseMoveHandler={this.mouseMoveHandler.bind(this)}
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>          `)}}
          />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          dataPoints
          xTicks={5}
          yTicks={3}
          grid
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <h2 id="clickHandler">Click Handler</h2>
        <p>The chart will send out a clickHandler event from the dataPoints (see above). The dataPoints will need to be set. This can be used by your react application in anyway you would require.
         The event handler provides the point data.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<div>
 <div style={{display: 'inline-block'}}>
 <AreaChart
   xType={'time'}
   axes
   dataPoints
   xTicks={5}
   yTicks={3}
   grid
   clickHandler={(d) => this.setState({dataDisplay: \`The value of x is \${d.x} and y is \${d.y}\`})}
   tickTimeDisplayFormat={'%d %m'}
   interpolate={'cardinal'}
   width={750}
   height={250}
   data={[
     [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
     [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
   ]}
 />
 </div>
 <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
   {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a point to show the value'}
 </div>
</div>
        `)}}
         />
         </pre>
         <div>
           <div style={{display: 'inline-block'}}>
           <AreaChart
             xType={'time'}
             axes
             dataPoints
             xTicks={5}
             yTicks={3}
             grid
             clickHandler={(d) => this.setState({dataDisplay: `The value of x is ${d.x} and y is ${d.y}`})}
             tickTimeDisplayFormat={'%d %m'}
             interpolate={'cardinal'}
             width={750}
             height={250}
             data={[
               [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
               [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
             ]}
           />
           </div>
           <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
             {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a point to show the value'}
           </div>
         </div>

         <h2 id="areaColors">areaColors</h2>
         <p>The colours of the areas can be overridden easily. To do this we can pass in a areaColor array as a prop.</p>
         <p>The following example would be to change the color of the first Area.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <AreaChart
   xType={'time'}
   axes
   xTicks={5}
   yTicks={3}
   dataPoints
   grid
   areaColors={['black', 'purple']}
   tickTimeDisplayFormat={'%d %m'}
   interpolate={'cardinal'}
   width={750}
   height={250}
   data={[
     [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
     [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
   ]}
 />
         `)}}
         />
         </pre>
        <AreaChart
          xType={'time'}
          axes
          xTicks={5}
          yTicks={3}
          dataPoints
          grid
          areaColors={['black', 'purple']}
          tickTimeDisplayFormat={'%d %M'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
             [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
             [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />


        <h2 id="areaGradient">noAreaGradient</h2>
        <p>The gradient of colours of the areas can be overridden and a solid color provided instead. To do this we can pass in a noAreaGradient boolean as a prop.</p>

        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  xType={'time'}
  axes
  xTicks={5}
  yTicks={3}
  dataPoints
  grid
  noAreaGradient
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
  [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
  [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <AreaChart
          xType={'time'}
          axes
          xTicks={5}
          yTicks={3}
          dataPoints
          grid
          noAreaGradient
          tickTimeDisplayFormat={'%d %M'}
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />


        <h2 id="updateData">Updating the data</h2>
        <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
        React provides the functionality to only update the elements of the dom when required so should just change the Area attributes.
        The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<AreaChart
  data={this.data} // this is generated randomly and updated randomly within a range of -20 to + 20
  datePattern={'%d-%b-%y %H:%M'}
  xType={'time'}
  width={800}
  height={400}
  axisLabels={{x: 'Hour', y: 'Percentage'}}
  interpolate={'cardinal'}
  yDomainRange={[0, 100]}
  axes
  grid
  style={{'.Area0':
  {
    stroke: 'green'
  }}}
/>
        `)}}
        />
        </pre>
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <AreaChart
          data={this.data}
          datePattern={'%d-%b-%y %H:%M'}
          xType={'time'}
          width={this.state.componentWidth}
          height={this.state.componentWidth / 2}
          interpolate={'cardinal'}
          yDomainRange={[0, 100]}
          axisLabels={{x: 'Hour', y: 'Percentage'}}
          axes
          grid
          style={{'.Area0':
          {
            stroke: 'green'
          }}}
        />

        <h2 id="fluid">Fluid</h2>
        <p>Because the width and height of the chart can be passed in by a param then changes to the size of a window or container can change the chart dynamically.
        If you shrink your browser window width you will see the charts below change in a fluid manor. You can also introduce basic break points such as removing the axes if below a certain width.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
constructor(props) {
  const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
  this.state = {showToolTip: false, windowWidth: initialWidth - 100};
}

componentDidMount() {
  window.addEventListener('resize', this.handleResize.bind(this));
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}

handleResize() {
  this.setState({windowWidth: window.innerWidth - 100});
}
<AreaChart
  xType={'time'}
  axes={(this.state.windowWidth / 3) > 400 ? true : false}
  xTicks={5}
  yTicks={3}
  grid
  width={this.state.windowWidth / 3}
  height={this.state.windowWidth / 6}
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <div style={{display: 'inline-block'}}>
        <h4>2013</h4>
        <AreaChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-13', y: 8}, {x: '1-Feb-13', y: 17}, {x: '1-Mar-13', y: 17}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 20}],
            [{x: '1-Jan-13', y: 5}, {x: '1-Feb-13', y: 13}, {x: '1-Mar-13', y: 10}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 30}]
          ]}
        />
        </div>
        <div style={{display: 'inline-block', padding: '0 10px'}}>
        <h4>2014</h4>
        <AreaChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-14', y: 20}, {x: '1-Feb-14', y: 10}, {x: '1-Mar-14', y: 33}, {x: '1-Apr-14', y: 45}, {x: '1-May-14', y: 14}],
            [{x: '1-Jan-14', y: 7}, {x: '1-Feb-14', y: 88}, {x: '1-Mar-14', y: 10}, {x: '1-Apr-14', y: 15}, {x: '1-May-14', y: 55}]
          ]}
        />
        </div>
        <div style={{display: 'inline-block'}}>
        <h4>2015</h4>
        <AreaChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />
        </div>
        </div>
        <br/>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of x is {this.state.x} and the value of y is {this.state.y}</ToolTip> : null}
        </div>
      );
    }
}


ReactDom.render(<AreaChartContainer/>, document.getElementById('root'));
