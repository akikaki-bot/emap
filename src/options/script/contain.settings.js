const sl = localStorage

const chretu = (elementid) => (document.getElementById(elementid).value ? document.getElementById(elementid).value : "nothing Else.")

const rename = (elementid,value) => {
    document.getElementById(elementid).value = value
}

window.load = () => {
    setTimeout(() => {
        console.log('nubejosn')
        for(i of document.getElementById('disabledfamily').children){
            i.removeAttribute("disabled")
        }      
        

    },2000)
}

function asset(){

    const savejson = {
        "a":chretu('sindo1i'),
        "b":chretu('sindo2i'),
        "c":chretu('sindo3i'),
        "d":chretu('sindo4i'),
        "e":chretu('sindo5i'),
        "f":chretu('sindo5pi'),
        "g":chretu('sindo6i'),
        "h":chretu('sindo6pi'),
        "i":chretu('sindo7i')
    } 

    console.log(`Saving Asset ${savejson.a ? savejson.a : "何もない...だと？"}`);

    const savedata = JSON.stringify(savejson);
    sl.setItem(`user_asset`,savedata)

    console.log(`Successfully saved ${savedata}`)
}

function assetCall(){
    const data = sl.getItem('user_asset')
    const color = JSON.parse(data) 
    console.log(color)
    rename("sindo1i",color.a)
    rename("sindo2i",color.b)
    rename('sindo3i',color.c)
    rename('sindo4i',color.d)
    rename('sindo5i',color.e)
    rename('sindo5pi',color.f)
    rename('sindo6i',color.g)
    rename('sindo6pi',color.h)
    rename('sindo7i',color.i)
}

