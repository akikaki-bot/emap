function conv(){
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;

    const ctx = canvas.getContext("2d");
    const image = new Image;
    image.onload = function(){
        ctx.drawImage( image, 0, 0 );

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.setAttribute("download", `SindoBunpu_d.${new Date().getDate()}_t.${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}.png`);
        a.dispatchEvent(new MouseEvent("click"));
}

image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(svgData))); 

}

/*
 ( ^ ^ ) < Wow! there's a javascript code sea!
*/