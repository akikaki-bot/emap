function sleep(waitSeconds, someFunction) {
  return new Promise(resolve => {
    setTimeout(async () => {
      resolve(await someFunction())
    }, waitSeconds * 1000)
  })	
}


const remake = () => {
   const dankai1 = () => {
     fetch(`https://api.p2pquake.net/v2/jma/quake?quake_type=ScalePrompt`)
     .then((response) => response.json())
     .then(async p2p => {
       create(p2p[0])
     })
     console.log("dankai1")
   }
   const dankai2 = () => {
    fetch(`https://api.p2pquake.net/v2/jma/quake?quake_type=Destination`)
    .then((response) => response.json())
    .then(async p2p => {
      create(p2p[0])
    })
    console.log("dankai2")
  }
  const dankai3 = () => {
    fetch(`https://api.p2pquake.net/v2/jma/quake?quake_type=ScaleAndDestination`)
    .then((response) => response.json())
    .then(async p2p => {
      create(p2p[0])
    })
    console.log("dankai3")
  }
  const dankai4 = () => {
    fetch(`https://api.p2pquake.net/v2/jma/quake?quake_type=DetailScale`)
    .then((response) => response.json())
    .then(async p2p => {
      create(p2p[0])
    })
    console.log("dankai4")
  }
  const dankai5 = () => {
    fetch(`https://api.p2pquake.net/v2/jma/quake?quake_type=Other`)
    .then((response) => response.json())
    .then(async p2p => {
      create(p2p[0])
    })
  }

  sleep(0,dankai1)
  sleep(10,dankai2)
  sleep(20,dankai3)
  sleep(30,dankai4)
 // sleep(10000,dankai5)
}
const main = async () => {



    //const log = document.getElementById('log');

    if(!localStorage.getItem('sindo1')){
      location.href = "./options/index.html?message=初期設定を行ってください。"
    }

    
    console.log("FNC ? main : EarthQuake Mapping Tool \nfor Electron... LoadingNow...")
    console.log("FNC ? main : Try to Connect wss://api.p2pquake.net/v2/ws")


 // let p2p;
//おまじない
//試験 : https://api.p2pquake.net/v2/jma/quake?min_scale=60
//通常 : https://api.p2pquake.net/v2/history?codes=551&
      fetch(`https://api.p2pquake.net/v2/history?codes=551&`)
      .then((response) => response.json())
      .then(async p2p => {

        
        //p2p = json
        //console.log(p2p[0])
        console.log("FNC ? main ? FETCH : Create the first earthquake map...")
        console.log("DATA / JSON : "+p2p[0])
        create(p2p[0])
        
      })

    

      const data = new WebSocket('wss://api.p2pquake.net/v2/ws')

      data.addEventListener('open', function (event) {
        document.getElementById('status').remove()
        console.log("FNC ? main ? WS : Successfully Connect to wss://api.p2pquake.net/v2/ws")
      })

      data.onmessage = (data) => {
        const p2p = JSON.parse(data.data)
        //ToDo : そのうち全部の情報に対応させる
        if(p2p.code === 551){
          if(p2p.issue.type === "ScaleAndDestination" || p2p.issue.type === "DetailScale")
          {
            
            create(p2p)
          }
        }
      }
      
}

let global_firstmake = false;

async function create(p2p){
  
  if(global_firstmake)
   {
    document.getElementById('eq_map').children[1].remove()
    console.log('FNC ? create : Removing old map...')
   }
   global_firstmake = true;
    console.log("FNC ? create : Running...")
      
    //サイズ指定
    const width = 1280
    const height = 720
    const scale = 1600

//一時的
    let pref = "";
    let maxscale = 0;

    const svg = d3.select(document.getElementById('eq_map'))
    .append('svg')
    .attr("xmlns",'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)
    .style(`background-color`,"#1c1b1b")

    $("svg").css('display', 'none');$("#loading_display").css('display','inline')

    //SindoArrays

    const size = 15 //20 
    const s_size = 7 //13
    const s_width = 10 //5
    const red_width = 9 //5



    const projection = d3.geoMercator().center([137.0, 38.2]).translate([width / 2, height / 2]).scale(scale);
    const path = d3.geoPath().projection(projection);

//あたらしい地図のベース作成

            //  const data = await d3.json("https://images.akika.ga/japan.json");

              const url = (p2p) => {
                  if(p2p.issue.type === "Foreign"){
                    return "https://japonyol.net/editor/article/mundo.geojson"
                  } else {
                    return'https://images.akika.ga/japan.json'
                  }
              }

              console.log(url(p2p))
              const data = await d3.json(url(p2p))

              //if(p2p.earthquake) return;

              //console.log(data);
              if(p2p.earthquake.hypocenter.longitude === NaN) {
                p2p.earthquake.hypocenter.longitude = 0;
                p2p.earthquake.hypocenter.latitude = 0;
              }

              const zoom = projection([p2p.earthquake.hypocenter.longitude,p2p.earthquake.hypocenter.latitude])
              const zoomnum = () => {
                if(p2p.issue.type === "Foreign") return 0.1
                else return new Util().zoom(p2p.points.length ? p2p.points.length : 1000)
              }

              console.log(`Zoom ${zoomnum()} ZoomXYproj${zoom}`)


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
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + zoomnum() + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");
              
              if(p2p.issue.type === "Destination"){
               await display(p2p)
                $("svg").css('display', 'inline')
                $("#loading_display").css('display','none')
                return
             }
             
    /**@param {Array<string>}*/
    const s1 = [];
    const s2 = [];
    const s3 = [];
    const s4 = [];
    const s5 = [];
    const s5p = [];
    const s6 = [];
    const s6p = [];
    const s7 = [];





    for(i of p2p.points){
      if(i.scale === 10){
        s1.push(i)
      }
      if(i.scale === 20){
        s2.push(i)
      }
      if(i.scale === 30){
        s3.push(i)
      }
      if(i.scale === 40){
        s4.push(i)
      }
      if(i.scale === 45){
        s5.push(i)
      }
      if(i.scale === 50){
        s5p.push(i)
      }
      if(i.scale === 55){        
        s6.push(i)
      }
      if(i.scale === 60){
        s6p.push(i)
      }
      if(i.scale === 70){
        s7.push(i)
      }
    }



          if(!(p2p.issue.type === "Foreign")){
            console.log('こっち')
              await MapCreate(p2p)
           } else {
            console.log('...！？')
              await display(p2p)
              $("svg").css('display', 'inline')
             $("#loading_display").css('display','none')
          }
             async function MapCreate(){
              const sindo1 = async () => {
                await s1.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 10){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo2 = async () => {
                await s2.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 20){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo3 = async () => {
                await s3.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 30){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo4 = async () => {
                await s4.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 40){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo5 = async () => {
                await s5.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 45){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo5p = async () => {
                await s5p.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 50){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo6 = async () => {
                await s6.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 55){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo6p = async () => {
                await s6p.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 60){
                  await display(p2p)
                  $("svg").css('display', 'inline')
                  $("#loading_display").css('display','none')
                  }
              }

              const sindo7 = async () => {
                await s7.forEach(async i => {
                  await CreatePoint(i.addr,i.scale,zoom,zoomnum(),width,height)
                })
                if(p2p.earthquake.maxScale === 70){
                  await display(p2p)
                $("svg").css('display', 'inline')
                $("#loading_display").css('display','none')
                }
              }
              sleep(1,sindo1)
              sleep(3,sindo2)
              sleep(5,sindo3)
              sleep(7,sindo4)
              sleep(7.5,sindo5)
              sleep(8,sindo5p)
              sleep(8.5,sindo6)
              sleep(9,sindo6p)
              sleep(9.5,sindo7)
             }

                //.scale([zoom[0],zoom[1]])

             async function CreatePoint(pointname,sindo,zoom,zoomnum,width,height){
                  coordinate = projection(await changelatlot(pointname))
                  svg.append('circle')
                      .attr('r', 3)
                      .attr('cx', coordinate[0])
                      .attr('cy', coordinate[1])
                      .attr('stroke', new Util().changewakusen(+(sindo)))
                      .attr('stroke-width',"0.5")
                      .style('fill', new Util().changesindo(+(sindo)))
                      .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + zoomnum() + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

              
                  svg.append('text')
                      .text(new Util().changesindotosindo(sindo))
                      .attr('x', coordinate[0] + 0)
                      .attr('y', coordinate[1] + 1.6)
                      .attr('font-size', 5)
                      .attr('text-anchor', 'middle')
                      .attr('font-family', "Arial")
                      .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + zoomnum() + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

                 }
             
          async function display(p2p){

              await svg.append("text")
              .attr("x", 0)
              .attr("y", 20)
              .attr("width",80)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr('fill',"#FFFFFF")
              .text(`x${zoomnum()}`)

              await svg.append("text")
              .attr("x", 1000)
              .attr("y", 20)
              .attr("width",80)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr('fill',"#FFFFFF")
              .text(`地図データ : NaturalEarth / 国土地理院`)

              
                 await svg.append("text")
                 .attr('x', 0)
                 .attr('y', 715)
                 .attr('width',80)
                 .attr('height',20)
                 .attr('opacity',0.5)
                 .attr('fill',"#FFFFFF")
                 .text(`${p2p.issue.type === "Foreign" ? "この地震は遠地地震です。正しく描画されない可能性があります。 / ": ""}${p2p.earthquake.domesticTsunami === "None" ? "この地震による津波の心配はありません" : "この地震により、津波が発生している可能性があります"}${new Util().textforegintsunami(p2p.earthquake.foreignTsunami)}`)
              
              
           
              //震度色表示
              await svg.append("rect")
              .attr("x", 20)
              .attr("y", 200)
              .attr("width",120)
              .attr("height",260)
              .attr('fill','#1F2023')

              const singendisplayx = 48
              const singendisplayy = 425

              const singendisplay = [singendisplayx , singendisplayy]

              await svg.append('text')
              .attr("x",81)
              .attr("y",435)
              .attr("font-size", 25)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震源`)

              svg.append('line')
              .attr('x1', singendisplay[0] - s_size - s_width)
              .attr('x2', singendisplay[0] + s_size + s_width)
              .attr('y1', singendisplay[1] - s_size - s_width)
              .attr('y2', singendisplay[1] + s_size + s_width)
              .attr('stroke-width', s_width + 3 * 2)
              .style('stroke', "yellow")

          svg.append('line')
              .attr('x1', singendisplay[0] - s_size - s_width)
              .attr('x2', singendisplay[0] + s_size + s_width)
              .attr('y1', singendisplay[1] + s_size + s_width)
              .attr('y2', singendisplay[1] - s_size - s_width)
              .attr('stroke-width', s_width + 3 * 2)
              .style('stroke', "yellow")

          svg.append('line')
              .attr('x1', singendisplay[0] - size)
              .attr('x2', singendisplay[0] + size)
              .attr('y1', singendisplay[1] - size)
              .attr('y2', singendisplay[1] + size)
              .attr('stroke-width', red_width)
              .style('stroke', "red")

          svg.append('line')
              .attr('x1', singendisplay[0] - size)
              .attr('x2', singendisplay[0] + size)
              .attr('y1', singendisplay[1] + size)
              .attr('y2', singendisplay[1] - size)
              .attr('stroke-width', red_width)
              .style('stroke', "red")


              //震度7から１の棒
              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 210)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo7'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",225)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度 7`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 230)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo6p'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",245)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度6強`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 250)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo6'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",265)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度6弱`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 270)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo5p'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",285)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度5強`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 290)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo5'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",305)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度5弱`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 310)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo4'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",325)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度 4`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 330)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo3'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",345)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度 3`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 350)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo2'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",365)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度 2`)

              await svg.append("rect")
              .attr("x", 30)
              .attr("y", 370)
              .attr("width",5)
              .attr("height",20)
              .attr("opacity",0.5)
              .attr("fill",s.getItem('sindo1'))

              await svg.append('text')
              .attr("x",40)
              .attr("y",385)
              .attr("font-size", 15)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .text(`震度 1`)


             /*
                 ここから
                 [震度X - 震源]
                 [      - 深さ M]
                 のやつ
             */


              await svg.append("rect")
              .attr("x", 20)
              .attr("y", 30)
              .attr("width",506)
              .attr("height",114)
              .attr('fill',"#1F2023")



              await svg.append("rect")
              .attr("x", 20)
              .attr("y", 20)
              .attr("width",506)
              .attr("height",28)
              .attr('fill',"#2B2B2F")

              await svg.append("rect")
              .attr("x", 50)
              .attr("y", 21)
              .attr("width",6)
              .attr("height",26)
              .attr('fill',"#333945")

              await svg.append("rect")
              .attr("x", 176)
              .attr("y", 48)
              .attr("width",350)
              .attr("height",96)
              .attr('fill',"#27292D")

              //震源情報の上の長い線
              await svg.append("rect")
              .attr("x", 176)
              .attr("y", 48)
              .attr("width",350)
              .attr("height",4)
              .attr('fill',"#333945")

              //hypocenter Name
              await svg.append('text')
              .attr('x', 185)
              .attr('y', 90)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .attr("font-weight","")
              .attr('font-size' , 30)
              .text(`${p2p.earthquake.hypocenter.name ? p2p.earthquake.hypocenter.name : "不明"}`)

              await svg.append('text')
              .attr('x', 185)
              .attr('y', 135)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .attr("font-weight","")
              .attr('font-size' , 25)
              .text(`深さ`)

              await svg.append('text')
              .attr('x', 240)
              .attr('y', 135)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Inter Light 300')
              .attr("font-weight","")
              .attr('font-size' , 33)
              .text(`${p2p.earthquake.hypocenter.depth ? new Util().depthchange(p2p.earthquake.hypocenter.depth) : "不明"}`)

              await svg.append('text')
              .attr('x', `${new Util().depthsanketa(p2p.earthquake.hypocenter.depth) ? 295 : 276}`)
              .attr('y', 135)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Noto Sans jp')
              .attr("font-weight","")
              .attr('font-size' , 25)
              .text(`${new Util().depthchangetf(p2p.earthquake.hypocenter.depth) ? "km" : ""}`)

              await svg.append('text')
              .attr('x', 350)
              .attr('y', 135)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Inter Light 300')
              .attr("font-weight","")
              .attr('font-size' , 25)
              .text(`M`)

              await svg.append('text')
              .attr('x', 375)
              .attr('y', 135)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Inter Light 300')
              .attr("font-weight","")
              .attr('font-size' , 33)
              .text(`${p2p.earthquake.hypocenter.magnitude}`)

              //震度ぼっくす
              await svg.append("rect")
              .attr("x", 22.5)
              .attr("y", 50.5)
              .attr("width",151)
              .attr("height",91)
              .attr('fill',`${new Util().changesindo(p2p.earthquake.maxScale)}`)
              .attr('stroke',`${new Util().changewakusen(p2p.earthquake.maxScale)}`)
              .attr('stroke-width',5)

              await svg.append('text')
              .attr('x', 28)
              .attr('y', 134)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Noto Sans jp')
              .attr("font-weight","")
              .attr('font-size' , 25)
              .text(`震度`)

              await svg.append('text')
              .attr('x', 88)
              .attr('y', 136)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Inter Light 300')
              .attr("font-weight","")
              .attr('font-size' , 90)
              .text(`${p2p.earthquake.maxScale ? new Util().changesindodisplay(p2p.earthquake.maxScale) : "?"}`)

              
              await svg.append('text')
              .attr('x', 134)
              .attr('y', 132)
              .attr('fill',"#FFFFFF")
              .attr('font-family','Noto Sans jp')
              .attr("font-weight","")
              .attr('font-size' , 35)
              .text(`${new Util().returnkyouzyaku(p2p.earthquake.maxScale) ? new Util().returnkyouzyaku(p2p.earthquake.maxScale) : ""}`)

              await svg.append("text")
              .attr("x", 22)
              .attr("y", 40)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Inter Regular 400")
              .attr("font-weight","")
              .attr('font-size' , 20)
              .text(`🗾`)

              await svg.append("text")
              .attr("x", 62)
              .attr("y", 41)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .attr("font-weight","")
              .attr('font-size' , 20)
              .text(`${new Util().textinfomation(p2p.issue.type)}`)

              await svg.append("text")
              .attr("x", 230)
              .attr("y", 41)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Inter Medium 500")
              .attr("font-weight","")
              .attr('font-size' , 16)
              .text(`${p2p.earthquake.time} に発生した地震`)


              


//ここまで

/*
await svg.append('rect')
              .attr("x",480)
              .attr("y",550)
              .attr("width",300)
              .attr("height",30)
              .attr("opacity",0.8)

              await svg.append('text')
              .attr("x",485)
              .attr("y",570)
              .attr("font-size", 17)
              .attr('fill',"#FFFFFF")
              .attr('font-family',"Noto Sans jp")
              .attr("font-weight","bold")
              .text(`${new Util().texttsunami(p2p.earthquake.domesticTsunami)}`)
          */


          


              //log.innerText += `\n LO ${p2p[0].earthquake.hypocenter.longitude} \n LA${p2p[0].earthquake.hypocenter.latitude}`

              const singen = projection([p2p.earthquake.hypocenter.longitude,p2p.earthquake.hypocenter.latitude])

              const diff = projection([137,38])

              //log.innerText += `\nX ${singen[0]} \n Y ${singen[1]} \nArray (長すぎ) \ndiff X ${diff[0]} \n Y ${diff[1]}`

              if(singen[0] === NaN || singen[1] === NaN) return 

           //   await svg.append("g")
           //   .append('circle')
           //   .attr("cx", singen[0])
            //  .attr("cy", singen[1])
           //   .attr('r', 4)
             // .attr('stroke', 'yellow') // 枠線色
            //  .attr('fill', 'red') // 塗りつぶし色
           //   .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + zoomnum() + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");



             const center = singen
              svg.append('line')
                  .attr('x1', center[0] - s_size - s_width)
                  .attr('x2', center[0] + s_size + s_width)
                  .attr('y1', center[1] - s_size - s_width)
                  .attr('y2', center[1] + s_size + s_width)
                  .attr('stroke-width', s_width + 3 * 2)
                  .style('stroke', "yellow")
                  .attr("transform", "translate(" + width/2 + "," + height/2 + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

              svg.append('line')
                  .attr('x1', center[0] - s_size - s_width)
                  .attr('x2', center[0] + s_size + s_width)
                  .attr('y1', center[1] + s_size + s_width)
                  .attr('y2', center[1] - s_size - s_width)
                  .attr('stroke-width', s_width + 3 * 2)
                  .style('stroke', "yellow")
                  .attr("transform", "translate(" + width/2 + "," + height/2 + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

              svg.append('line')
                  .attr('x1', center[0] - size)
                  .attr('x2', center[0] + size)
                  .attr('y1', center[1] - size)
                  .attr('y2', center[1] + size)
                  .attr('stroke-width', red_width)
                  .style('stroke', "red")
                  .attr("transform", "translate(" + width/2 + "," + height/2 + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

              svg.append('line')
                  .attr('x1', center[0] - size)
                  .attr('x2', center[0] + size)
                  .attr('y1', center[1] + size)
                  .attr('y2', center[1] - size)
                  .attr('stroke-width', red_width)
                  .style('stroke', "red")
                  .attr("transform", "translate(" + width/2 + "," + height/2 + ")translate(" + - zoom[0] + "," + - zoom[1] + ")");

              console.log('Fnc ? map : Successfully Create')
          }
}

/**
 * ( ~  ~ ) < I'm sleepy....
 * EarthQuake Map Creater... What's this...?
 * ....O ! I C.....I want to go to bed...
 */