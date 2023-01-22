

/**
 * 
 * @param {string} pointname 
 * 
 * @return {Array} Lat Lot
 */
async function changelatlot(pointname){
    try{
    const data = await (await fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${pointname}`)).json();
    //console.log(data[0])
    return data[0].geometry.coordinates
    }catch(e){
    return [0,0]
    }
}