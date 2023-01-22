function init(){
    const s = localStorage

    
    if(!s.getItem('zoom_tf')){
        s.setItem('zoom_tf',false);
    }
    if(!s.getItem('zoom_num')){
        s.setItem('zoom_num',4);
    }

    const tf = s.getItem('zoom_tf')
    console.log(tf)

    document.getElementById('zoom').value = s.getItem('zoom_num')

    //success,danger
    if(tf === "true"){
        $('#zoom_on').addClass('is-success')
        $('#zoom_off').removeClass('is-danger')
    } else {
        $('#zoom_off').addClass('is-danger')
        $('#zoom_on').removeClass('is-success')
    }

    $('#zoom_on').on('click', function() {
        if(!$(this).hasClass('is-success')){
            $(this).addClass('is-success')
            $('#zoom_off').removeClass('is-danger')
        }
    })
    $('#zoom_off').on('click', function() {
        if(!$(this).hasClass('is-danger')){
            $(this).addClass('is-danger')
            $('#zoom_on').removeClass('is-success')
        }
    })

    $('#save').on('click', function() {
 
        let tf = true;

       if(!($('#zoom_on').hasClass('is-success'))){
          tf = false;
       }
       s.setItem('zoom_tf',tf);
       if(tf === true){
         s.setItem('zoom_num',$('#zoom').val())
       }
    })
}