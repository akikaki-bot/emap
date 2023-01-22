


async function eew(hypocenter,lat,lot,dep,sec,infono,){

    const eew = await (await fetch(`https://weather-kyoshin.east.edge.storage-yahoo.jp/RealTimeData/20210213/20210213230859.json`)).json()
    document.getElementById('eq_map').children[0].remove();

    const width = 1280
    const height = 720
    const scale = 1600

    const projection = d3.geoMercator().center([137.0, 38.2]).translate([width / 2, height / 2]).scale(scale);
    const path = d3.geoPath().projection(projection);

//あたらしい地図のベース作成
    const svg = d3.select(document.getElementById('eq_map'))
              .append('svg')
              .attr("xmlns",'http://www.w3.org/2000/svg')
              .attr('width', width)
              .attr('height', height)
              .style(`background-color`,"#1c1b1b")

              const data = await d3.json("https://images.akika.ga/japan.json");

              console.log(typeof eew.psWave.items[0].longitude)
             // const hypocenter = [Number((eew.psWave.items[0].longitude).replace('E',"")),Number((eew.psWave.items[0].latitude).replace('N',""))]

              const hypocenterProjection = projection([Number((eew.psWave.items[0].longitude).replace('E',"")),Number((eew.psWave.items[0].latitude).replace('N',""))])
              const zoomnum = new Util().zoom(100)

              svg
              .selectAll('path')
              .data(data.features)
              .enter()
              .append(`path`)
              .attr(`d`, path)
              .attr(`stroke`, "#333333")
              .attr(`stroke-width`, 0.25)
              .attr(`fill`,(item) => {
                return "#666666"
              })
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + zoomnum + ")translate(" + - hypocenterProjection[0] + "," + - hypocenterProjection[1] + ")");

              svg.append('g')
              .attr('cx',hypocenterProjection[0])
              .attr('cx',hypocenterProjection[1])
              .attr('r',4)
              .attr('fill','#FFFFFF')
}