$(document).ready(function(){
  // function getData(rawSample) {
  //     return rawSample
  // }
  // console.log(rawSample)
  const rawSample = [
    {"": "1",
    "DAY_OF_WEEK": "3",
    "year": "2015",
    "OP_UNIQUE_CARRIER": "MQ",
    "ORIGIN": "SUP",
    "ORIGIN_CITY_NAME": "Supreetha",
    "ORIGIN_STATE_ABR": "LA",
    "DEST": "DFW",
    "DEST_CITY_NAME": "Dallas/Fort Worth, TX",
    "DEST_STATE_ABR": "TX",
    "DEP_TIME": "1332",
    "DEP_DELAY_NEW": "0",
    "TAXI_OUT": "8",
    "TAXI_IN": "4",
    "ARR_DELAY_NEW": "20",
    "CANCELLED": "0",
    "CANCELLATION_CODE": "",
    "DIVERTED": "0",
    "CARRIER_DELAY": "NA",
    "WEATHER_DELAY": "NA",
    "X": "NA"
    }, {
    "": "2",
    "DAY_OF_WEEK": "3",
    "year": "2015",
    "OP_UNIQUE_CARRIER": "SUPP",
    "ORIGIN": "SUP",
    "ORIGIN_CITY_NAME": "Supreetha",
    "ORIGIN_STATE_ABR": "LA",
    "DEST": "DFW",
    "DEST_CITY_NAME": "Dallas/Fort Worth, TX",
    "DEST_STATE_ABR": "TX",
    "DEP_TIME": "1148",
    "DEP_DELAY_NEW": "0",
    "TAXI_OUT": "16",
    "TAXI_IN": "2",
    "ARR_DELAY_NEW": "10",
    "CANCELLED": "0",
    "CANCELLATION_CODE": "",
    "DIVERTED": "0",
    "CARRIER_DELAY": "NA",
    "WEATHER_DELAY": "NA",
    "X": "NA"},
     {
    "": "3",
    "DAY_OF_WEEK": "3",
    "year": "2015",
    "OP_UNIQUE_CARRIER": "NK",
    "ORIGIN": "BTR",
    "ORIGIN_CITY_NAME": "Amogh Mishra",
    "ORIGIN_STATE_ABR": "LA",
    "DEST": "DFW",
    "DEST_CITY_NAME": "Dallas/Fort Worth, TX",
    "DEST_STATE_ABR": "TX",
    "DEP_TIME": "1148",
    "DEP_DELAY_NEW": "0",
    "TAXI_OUT": "16",
    "TAXI_IN": "2",
    "ARR_DELAY_NEW": "10",
    "CANCELLED": "0",
    "CANCELLATION_CODE": "",
    "DIVERTED": "0",
    "CARRIER_DELAY": "NA",
    "WEATHER_DELAY": "NA",
    "X": "NA"}
  ];
  var originArr = [];
  var destArr = [];
  rawSample.forEach(function(item){
    var i = originArr.findIndex(x => x.id == item.ORIGIN);
    var j = destArr.findIndex(x => x.id == item.DEST);
  
    if(i <= -1){
      originArr.push({id: item.ORIGIN, name: item.ORIGIN_CITY_NAME});
    }
    if(j <= -1){
      destArr.push({id: item.DEST, name: item.DEST_CITY_NAME});
    }
  });
  var target = $('#origin');
  $(target).empty();
  $('<option>-- Select --</option>').appendTo(target);
  $.each(originArr , function(value,index) {
         $('<option value="' + index.id + '">' + index.name + '</option>').appendTo(target);
              });
  
  var targetDest = $('#destination');
  $(targetDest).empty();
  $('<option>-- Select --</option>').appendTo(targetDest);
  $.each(destArr , function(value,index) {
     $('<option value="' + index.id + '">' + index.name + '</option>').appendTo(targetDest);
  });
  $('#origin, #destination').change(function() {    
  // $("flight").on("submit",function(){
  var e = document.getElementById("origin");
  var origResult = e.options[e.selectedIndex].value; 
  
  var d = document.getElementById("destination");
  var destResult = d.options[d.selectedIndex].value; 
  
    
  if (origResult && destResult) {
    
  const itermediate = rawSample.filter(samp => {
      return (samp.ORIGIN == origResult && samp.DEST == destResult);
  });
  var temp = {};
  var obj = null;
  for(var i=0; i < itermediate.length; i++) {
     obj=itermediate[i];
     if(!temp[obj.OP_UNIQUE_CARRIER]) {
         obj.ARR_DELAY_NEW = parseInt(obj.ARR_DELAY_NEW,10);
         temp[obj.OP_UNIQUE_CARRIER] = obj;
     } else {
         temp[obj.OP_UNIQUE_CARRIER].ARR_DELAY_NEW += parseInt(obj.ARR_DELAY_NEW,10);
     }
  }
  var sample = [];
  for (var prop in temp)
      sample.push(temp[prop]);
  
  const svg = d3.select('svg');
  const svgContainer = d3.select('#container');
  
  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;
  
  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
  
  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.OP_UNIQUE_CARRIER))
    .padding(0.4)
  
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);
  
  // vertical grid lines
  // const makeXLines = () => d3.axisBottom()
  //   .scale(xScale)
  
  const makeYLines = () => d3.axisLeft()
    .scale(yScale)
  
  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));
  
  chart.append('g')
    .call(d3.axisLeft(yScale));
  
  // vertical grid lines
  // chart.append('g')
  //   .attr('class', 'grid')
  //   .attr('transform', `translate(0, ${height})`)
  //   .call(makeXLines()
  //     .tickSize(-height, 0, 0)
  //     .tickFormat('')
  //   )
  
  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )
  
  const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')
  
  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.OP_UNIQUE_CARRIER))
    .attr('y', (g) => yScale(g.ARR_DELAY_NEW))
    .attr('height', (g) => height - yScale(g.ARR_DELAY_NEW))
    .attr('width', xScale.bandwidth())
    // .on('mouseenter', function(actual, i) {
    //   d3.selectAll('.value')
    //     .attr('opacity', 0)
  
    //   d3.select(this)
    //     .transition()
    //     .duration(300)
    //     .attr('opacity', 0.6)
    //     .attr('x', (a) => xScale(a.OP_UNIQUE_CARRIER) - 5)
    //     .attr('width', xScale.bandwidth() + 10)
  
    //   const y = yScale(actual.ARR_DELAY_NEW)
  
    //   line = chart.append('line')
    //     .attr('id', 'limit')
    //     .attr('x1', 0)
    //     .attr('y1', y)
    //     .attr('x2', width)
    //     .attr('y2', y)
  
    //   barGroups.append('text')
    //     .attr('class', 'divergence')
    //     .attr('x', (a) => xScale(a.OP_UNIQUE_CARRIER) + xScale.bandwidth() / 2)
    //     .attr('y', (a) => yScale(a.ARR_DELAY_NEW) + 30)
    //     .attr('fill', 'white')
    //     .attr('text-anchor', 'middle')
    //     .text((a, idx) => {
    //       const divergence = (a.value - actual.value).toFixed(1)
  
    //       let text = ''
    //       if (divergence > 0) text += '+'
    //       text += `${divergence}`
  
    //       return idx !== i ? text : '';
    //     })
  
    // })
    // .on('mouseleave', function() {
    //   d3.selectAll('.value')
    //     .attr('opacity', 1)
  
    //   d3.select(this)
    //     .transition()
    //     .duration(300)
    //     .attr('opacity', 1)
    //     .attr('x', (a) => xScale(a.OP_UNIQUE_CARRIER))
    //     .attr('width', xScale.bandwidth())
  
    //   chart.selectAll('#limit').remove()
    //   chart.selectAll('.divergence').remove()
    // })
  
  barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.OP_UNIQUE_CARRIER) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.ARR_DELAY_NEW) + 30)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.ARR_DELAY_NEW}`)
  
  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Delay')
  
  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Flights')
  
  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Flights with their delays')
  }
  });
  });