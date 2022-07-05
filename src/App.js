import './App.css';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css';
import { useState, Fragment } from 'react';
import { extent, scaleLinear, scaleOrdinal, format } from 'd3';
import { useData } from './components/useData';
import { AxisBottom } from './components/AxisBottom';
import { AxisLeft } from './components/AxisLeft';
import { Marks } from './components/Marks';
import { ColorLegend } from './components/ColorLegend';
// import { DropdownMenu } from './components/Dropdown';

// https://www.youtube.com/watch?v=2LhoCfjm8R4
// 8:46:00


const menuHeight = 60
const width = window.innerWidth 
const height = window.innerHeight - menuHeight;  

// const width = 1700
// const height = 500
const margin = { top: 100, right: 300, bottom: 150, left: 150 };
const xAxisLabelOffset = 100;
const yAxisLabelOffset = 70;
const xAxisTickFormat = n => format('.2s')(n).replace('G', 'B');
const fadeOpacity = 0.2

const attributes = [
  { value: 'sepal_length', label: 'Sepal Length' },
  { value: 'sepal_width', label: 'Sepal Width' },
  { value: 'petal_length', label: 'Petal Length' },
  { value: 'petal_width', label: 'Petal Width' },
  { value: 'species', label: 'Species' }
];

const getLabel = value => {
  for(let i = 0; i < attributes.length; i++) {
    if(attributes[i].value === value) {
      return attributes[i].label;
    }
  }
}

function App() {
  const data = useData();
  const [hoveredValue, setHoveredValue] = useState(null);
  // console.log(hoveredValue)

  const initialXAttribute = 'petal_length';
  const [ xAttribute, setXAttribute ] = useState(initialXAttribute);
  const xValue = (d) => d[xAttribute];
  const xAxisLabel = getLabel(xAttribute);

  const initialYAttribute = 'sepal_length';
  const [ yAttribute, setYAttribute ] = useState(initialYAttribute);
  const yValue = (d) => d[yAttribute];
  const yAxisLabel = getLabel(yAttribute);

  if(!data) {
    return <pre>Loading...</pre>;
  } 
  // console.log(data.columns)

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
   
  const colorValue = (d) => d.class;
  const colorLegendLabel = 'Species';
  const circleRadius = 7

  const filteredData = data.filter(d => hoveredValue === colorValue(d));

// Because scatter plots will not necessarily have a zero as 
// beginning value we use extent
// extent is a function that finds the min and max values
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([0, innerHeight])
    

  const colorScale = scaleOrdinal()
    .domain(data.map(colorValue))
    .range(['#E6842A', '#137B80', '#8E6C8A']);

    
    // console.log(data[0])
    // console.log(xScale.ticks())
    console.log(innerWidth)

   return (
    <Fragment>
      <div className="menus-container">
        <span className='dropdown-label'>X:</span> 
        <Dropdown 
          options={attributes} 
          value={xAttribute}
          onChange={({ value }) => setXAttribute(value)}
        />
        <span className='dropdown-label'>Y:</span> 
        <Dropdown
          options={attributes} 
          value={yAttribute}
          onChange={({ value }) => setYAttribute(value)}
        /> 
      </div> 
      <svg width={width} height={height} >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom 
            xScale={xScale} 
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat} 
            tickOffset={5}
          />
          <AxisLeft 
            yScale={yScale}  
            innerWidth={innerWidth}
            tickOffset={5}
            />
          <text 
            className="axis-label" 
            x={innerWidth / 2} 
            y={innerHeight + xAxisLabelOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <text 
            className="axis-label" 
            transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
          >
            {yAxisLabel}
          </text>
          <g transform={`translate(${innerWidth + 50 })`}>
            <text
              x={80}
              y={-25}
              className="axis-label" 
              textAnchor="middle"
            >
              {colorLegendLabel}
            </text>
            <ColorLegend 
              tickSpacing={30}
              tickSize={circleRadius}
              tickTextOffset={20}
              colorScale={colorScale}
              fadeOpacity={fadeOpacity}
              onHover={setHoveredValue}
              hoveredValue={hoveredValue}
            />
          </g>
          <g opacity={hoveredValue ? fadeOpacity : 1}>
            <Marks
            data={data}
            xScale={xScale}
            xValue={xValue}
            yScale={yScale}
            yValue={yValue}
            colorScale={colorScale}
            colorValue={colorValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={circleRadius}
          />
          </g>
          <Marks
            data={filteredData}
            xScale={xScale}
            xValue={xValue}
            yScale={yScale}
            yValue={yValue}
            colorScale={colorScale}
            colorValue={colorValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={circleRadius}
          />
        </g>
      </svg>
    </Fragment>
   )
}

export default App;
