const county_geomap_api = "https://hexschool.github.io/tw_revenue/taiwan-geomap.json";
const county_revenue_api = "https://hexschool.github.io/tw_revenue/tw_revenue.json";


axios.get(county_revenue_api)
  .then((response) => {
    const county_revenue = response.data[0].data;
    const revenue_min = d3.min(county_revenue, (d) => +d.revenue.replaceAll(',', ''));
    const revenue_max = d3.max(county_revenue, (d) => +d.revenue.replaceAll(',', ''));
    const colors = d3
      .scaleLinear()
      .domain([0, revenue_min, revenue_max,])
      .range(['#d6d6d6', '#bcafb0', '#ec595c',]);
    randerMap(county_revenue, colors);
  })
  .catch((error) => {
    console.log(error)
  });

function randerMap(county_revenue, colors) {
  let svg = d3
    .select('#canvas')
    .append('svg')
    .style('height', 500)
    .style('width', 500)
    .style('background', '#202d49');

  let tooltip = d3.select('#tooltip')
    .style('display', 'none')

  d3.json(county_geomap_api).then((data) => {
    const counties = topojson.feature(data, data.objects.COUNTY_MOI_1090820)
    const projection = d3.geoMercator().center([123, 24]).scale(5500);
    const path = d3.geoPath().projection;
    
    const geoPath = svg.selectAll('.geo-path')
      .data(counties.features)
      .join('path')
      .attr('class', 'geo-path')
      .attr('stroke-width', '0.5')
      .attr('d', path(projection))
      .attr('fill', (d) => {
        const city = d.properties.COUNTYNAME;
        const sale = county_revenue.find((item) => item.city === city);
        return colors(sale ? +sale.revenue.replaceAll(',', '') : 0);
      })
      .on('mouseover', function(e){
        d3.select(this).attr('stroke-width', '1');
        d3.select(this).select(function(d){
          const city = d.properties.COUNTYNAME;
          const sale = county_revenue.find((item) => item.city === city);
          let revenue;
          if (typeof sale === 'undefined') {
            revenue = 0;
          } else {
            revenue = sale.revenue;
          }
          tooltip.select('text').html(`${d.properties.COUNTYNAME}, ${revenue}`)
          tooltip.style('display', 'block')
        })
      })
      .on('mouseleave', function(e){
        d3.select(this).attr('stroke-width', '0.5');
        tooltip.style('display', 'none')
      })
      const texts = svg.selectAll('text')
        .data(counties.features)
        .enter()
        .append('text')
        .attr('x', (d, i) => {
            return path(projection).centroid(d)[0]
        })
        .attr('y', (d, i) => {
            return path(projection).centroid(d)[1]
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .text((d, i) =>{
            // return d.properties.COUNTYNAME
        })
  });
}
