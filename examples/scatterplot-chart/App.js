import React from 'react';
import ReactDOM from 'react-dom';
import ScatterplotChart from 'rc-d3/scatterplot-chart';

const data = [
  {
    species: 'setosa',
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2
  },
  {
    species: 'setosa',
    sepalLength: 4.9,
    sepalWidth: 3.0,
    petalLength: 1.4,
    petalWidth: 0.2
  },
  {
    species: 'setosa',
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2
  },
  {
    species: 'setosa',
    sepalLength: 4.6,
    sepalWidth: 3.1,
    petalLength: 1.5,
    petalWidth: 0.2
  },
  {
    species: 'setosa',
    sepalLength: 5.0,
    sepalWidth: 3.6,
    petalLength: 1.4,
    petalWidth: 0.2
  },
  {
    species: 'versicolor',
    sepalLength: 7.0,
    sepalWidth: 3.2,
    petalLength: 4.7,
    petalWidth: 1.4
  },
  {
    species: 'versicolor',
    sepalLength: 6.4,
    sepalWidth: 3.2,
    petalLength: 4.5,
    petalWidth: 1.5
  },
  {
    species: 'versicolor',
    sepalLength: 6.9,
    sepalWidth: 3.1,
    petalLength: 4.9,
    petalWidth: 1.5
  },
  {
    species: 'versicolor',
    sepalLength: 5.5,
    sepalWidth: 2.3,
    petalLength: 4.0,
    petalWidth: 1.3
  },
  {
    species: 'versicolor',
    sepalLength: 6.5,
    sepalWidth: 2.8,
    petalLength: 4.6,
    petalWidth: 1.5
  },
  {
    species: 'virginica',
    sepalLength: 6.3,
    sepalWidth: 3.3,
    petalLength: 6.0,
    petalWidth: 2.5
  },
  {
    species: 'virginica',
    sepalLength: 5.8,
    sepalWidth: 2.7,
    petalLength: 5.1,
    petalWidth: 1.9
  },
  {
    species: 'virginica',
    sepalLength: 7.1,
    sepalWidth: 3.0,
    petalLength: 5.9,
    petalWidth: 2.1
  },
  {
    species: 'virginica',
    sepalLength: 6.3,
    sepalWidth: 2.9,
    petalLength: 5.6,
    petalWidth: 1.8
  },
  {
    species: 'virginica',
    sepalLength: 6.3,
    sepalWidth: 3.0,
    petalLength: 5.8,
    petalWidth: 2.2
  }
];

export default class ScatterplotContainer extends React.Component {
  render() {
    return (
      <div>
        <ScatterplotChart data={data} />
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
