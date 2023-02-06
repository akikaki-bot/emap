const s = localStorage;
class Util {

    isfontcolor(sindo){
        if(sindo === 40) return "#000000"
        else return "#FFFFFF"
    }

    returnkyouzyaku(sindo){
        if(sindo === 45 || sindo=== 55) return "弱"
        else if(sindo === 50 || sindo=== 60 ) return "強"
        else false
    }

     textinfomation(infomationtype){
        switch(infomationtype){
            case "ScalePrompt":
                return "震度速報"
            case "Destination":
                return "震源情報"
            case "ScaleAndDestination":
                 return "震源・震度情報"
            case "DetailScale":
                  return "各地の震度情報"
           case "Foreign":
                  return "遠地地震情報"
           default:
                return "不明な情報"
        }
            }

    textforegintsunami(tsunami){
        switch(tsunami){
            case "None":
               return "。"
            case "Unknown":
               return "。"
            case "Checking":
               return "。津波の有無は調査中です。"
            case "NonEffectiveNearby":
                return "が、震源の近辺での若干の海面変動はありますが、被害の心配はありません。"
            case "WarningNearby":
                return "が、震源の近辺での津波の可能性があります。"
            case "WarningPacific":
                return "。太平洋で津波の可能性があります。"
            case "WarningPacificWide":
                return "。太平洋広域での津波の可能性があります。"
            case "WarningIndian":
                return "が、インド洋での津波の可能性があります。"
            case "WarningIndianWide":
                return "が、インド洋広域での津波の可能性があります。"
            case "Potential":
                return "。規模により津波の可能性があります。"
        }
    }

    texttsunami(tsunami){
        //"None" | "Unknown" | "Checking" | "NoneEffective" | "Watch" | "Warning"
        switch(tsunami){
            case "None":
                return "津波の心配はありません。"
            case "Unknown":
                return "津波の有無は不明です。"
            case "Checking":
                return "津波の有無は現在調査中です。"
            case "NoneEffective":
                return "若干の海面変動はありますが、津波の心配はありません。"
            case "Watch":
                return "津波注意報を発令中です。"
            case "Warning":
                return "津波警報を発令中です。"
            case "MajorWarning":
                return "大津波警報を発令中です。"
            default:
                return "情報のフォーマットに失敗しました。"
        }
    }

    maps(item,p2p,pref,maxscale){
        for(var point of p2p.points){
            if(!pref){
               maxscale = 0;
               pref = point.pref;
               maxscale = point.scale;
               //console.log(`${pref} is ${maxscale}`)
            }
            if((pref === item.properties.nam_ja)){
                if((maxscale > point.scale)) return console.log(`${pref} is ${maxscale} > ${point.scale}`)
                else {
                    console.log(`${pref} is ${maxscale} < ${point.scale}`)
                    return new Util().changesindo(maxscale)
                }
            } else {
              pref = "";
            }
         }
    }

    zoom(sindopointlength){
        if(s.getItem('zoom_tf') === "true"){
            console.log(Number(s.getItem('zoom_num')))
            return Number(s.getItem('zoom_num'))
        } else {
        if((sindopointlength >= 20)) sindopointlength = sindopointlength + 3400 * 1.5 
        else sindopointlength = 2900
        return 20000/sindopointlength
        }
    }

    depthchange(depth){
        switch(depth){
            case -1: return "不明"
            default: return depth
        }
    }

    depthchangetf(depth){
        switch(depth){
            case -1: return false
            default: return true
        }
    }
    
    depthsanketa(depth){
        if(depth >= 100) return true;
        else false
    }
    



    changesindo(sindo){
        switch(sindo){
            case 10: return s.getItem('sindo1')
            case 20: return s.getItem('sindo2')
            case 30: return s.getItem('sindo3')
            case 40: return s.getItem('sindo4')
            case 45: return s.getItem('sindo5')
            case 50: return s.getItem('sindo5p')
            case 55: return s.getItem('sindo6')
            case 60: return s.getItem('sindo6p')
            case 70: return s.getItem('sindo7')
            default: return "#666666"
        }
    }

    changewakusen(sindo){
        switch(sindo){
            case 10: return "#637180"
            case 20: return "#476bb5"
            case 30: return "#006600"
            case 40: return "#e6bf00"
            case 45: return "#e69500"
            case 50: return "#d15700"
            case 55: return "#660000"
            case 60: return "#991d1d"
            case 70: return "#3c0066"
            default: return "#CCCCCC"
        }
    }

    changesindotosindoname(sindo){
        switch(sindo){
            case 10: return "1"
            case 20: return "2"
            case 30: return "3"
            case 40: return "4"
            case 45: return "5弱"
            case 50: return "5強"
            case 55: return "6弱"
            case 60: return "6強"
            case 70: return "7"
            default: return "---"
        }
    }

    changesindotosindo(sindo){
        switch(sindo){
            case 10: return "1"
            case 20: return "2"
            case 30: return "3"
            case 40: return "4"
            case 45: return "5-"
            case 50: return "5+"
            case 55: return "6-"
            case 60: return "6+"
            case 70: return "7"
            default: return "?"
        }
    }

    changesindodisplay(sindo){
        switch(sindo){
            case 10: return "1"
            case 20: return "2"
            case 30: return "3"
            case 40: return "4"
            case 45: return "5"
            case 50: return "5"
            case 55: return "6"
            case 60: return "6"
            case 70: return "7"
            default: return "?"
        }
    }
}