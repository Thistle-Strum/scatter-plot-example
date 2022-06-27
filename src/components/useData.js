import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/curran/9e04ccfebeb84bcdc76c/raw/3d0667367fce04e8ca204117c290c42cece7fde0/iris.csv'

export const useData = () => {
    const [ data, setData ] = useState(null)
      // from this -> (which will produce an infinite loop)
      // csv(csvUrl).then(data => {
      //   setData(data);
      // })
      // to this ->
    useEffect(() => {
      const row = d => {
        // d.sepal_length = parseFloat(d.sepal_length]);
        // Unary plus (+) operator
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
        d.sepal_length = +d.sepal_length
        d.sepal_width = +d.sepal_width
        d.petal_length = +d.petal_length
        d.petal_width = +d.petal_width
      
        return d
      };
      csv(csvUrl, row).then(setData);
    }, []);
    return data;
  };
  