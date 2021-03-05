export const Message = (title, bool, back) => {
    let style='';
    if(bool){
        style="#36b9cc";
    }
    else{
        style="red";
    }
    
    var h = document.getElementById("beforeend");

    if(!back){
        h.insertAdjacentHTML("beforeend", `<p className="textcolor" style="font-size: xxx-large;font-weight: bold;color:${style};">${title}</p>`);
        setTimeout(() => {
            h.querySelector(':last-child').remove();
          
                
        }, 2000);
    }else{
        h.insertAdjacentHTML("beforeend", `<p className="textcolor" style="font-size: xxx-large;font-weight: bold;color:${style};">${title}</p>`);
        setTimeout(() => {
            h.querySelector(':last-child').remove();
            back.history.goBack();
                
        }, 2000);
    }

    
}