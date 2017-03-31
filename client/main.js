import { Template } from 'meteor/templating';
import { Reactivevar } from 'meteor/reactive-var';
import './main.html';
function makeLines(text,font,width,ctx){
  ctx.font = font;
  let spaces = [];
  for(var k in text){
    if(text[k]==" "){spaces.push(k);}
  }
  let lines = [];
  let lastEnd = -1;
  let lastk = -1;
  for(var k in spaces){
    if(ctx.measureText(text.slice(lastEnd+1,spaces[k])).width>width){
      if(lastk != -1){
          lines.push(text.slice(lastEnd+1,lastk));
          lastEnd = lastk;
      }
    }
    lastk = parseInt(spaces[k]);
  }
  if(ctx.measureText(text.slice(parseInt(lastEnd)+1,text.length)).width>width){
    lines.push(text.slice(lastEnd+1,spaces[spaces.length-1]));
    lines.push(text.slice(parseInt(spaces[spaces.length-1])+1,text.length));
  }else{
    lines.push(text.slice(parseInt(lastEnd)+1,text.length));
  }
  return(lines);
}
function getSize(font){
  return(font.split(" ")[0].split("px")[0]);
}
function renderLines(lines,font,ctx,x,y){
  ctx.font = font;
  h = getSize(font);
  for(var k in lines){
    ctx.fillText(lines[k], x, y+h*k);
  }
}
function renderLinesRightJustified(lines,font,ctx,x,y,TextWidth){
  ctx.font = font;
  h = getSize(font);
  for(var k in lines){
    let offset = TextWidth-ctx.measureText(lines[k]).width;
    ctx.fillText(lines[k], x+offset, y+h*k);
  }
}
function renderLinesCentered(lines,font,ctx,x,y,TextWidth){
  ctx.font = font;
  h = getSize(font);
  for(var k in lines){
    let offset = (TextWidth-ctx.measureText(lines[k]).width)/2;
    ctx.fillText(lines[k], x+offset, y+h*k);
  }
}
function getWords(line){
  return(line.split(" "));
}
function renderLinesFullyJustified(lines,font,ctx,x,y,TextWidth){
  ctx.font = font;
  h = getSize(font);
  for(var k in lines){
    if(k==lines.length-1){
      ctx.fillText(lines[k], x, y+h*k);
    }else{
      let words = getWords(lines[k]);
      let wordsWidth = 0;
      for(var k2 in words){
        wordsWidth+=ctx.measureText(words[k2]).width;
      }
      let nSpaces = ( words.length < 2 ? 1 : words.length-1 );
      let spaceWidth = (TextWidth-wordsWidth)/nSpaces;
      let spaceLeft = 0;
      for(var k2 in words){
        ctx.fillText(words[k2],x+spaceLeft,y+h*k);
        spaceLeft+=spaceWidth+ctx.measureText(words[k2]).width;
      }
    }
  }
}
function tBox(ctx,TextContent,x,y,TextWidth,Justice){
  switch(Justice) {
    case "RightJustified":
        renderLinesRightJustified(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    case "Centered":
        renderLinesCentered(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    case "FullyJustified":
        renderLinesFullyJustified(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    default:
        renderLines(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y);
  }
}
function getValue(elementID){
  return(document.getElementById(elementID).value);
}
function getNumber(elementID){
  return(parseInt(document.getElementById(elementID).value));
}
function getFont(){
  let Font = getValue("Font_Seletor");
  let Size = getValue("FontSize_Seletor");
  return(Size+"px "+Font);
}
function redraw(c){
  //Drawing the image.
  let a = parseInt(c.getAttribute("data-left"));
  let b = parseInt(c.getAttribute("data-top"));
  let image = document.getElementById("img");
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let WaterMark = document.getElementById("watermark");
  if(!WaterMark.checked){ctx.clearRect(0, 0, canvas.width, canvas.height);}
  ctx.drawImage(image, a, b);
  //
  //Drwing the text.
  ctx.font = getFont();
  let textColor = getValue("FontColor_Seletor");
  ctx.fillStyle=textColor;
  let TextContent = getValue("TextContent");
  let TextWidth = getNumber("TextWidth");
  let LeftMargin = getNumber("LeftMargin");
  let TopMargin = getNumber("TopMargin");
  let Justification = getValue("Justification");
  console.log([TextContent,TextWidth,LeftMargin,TopMargin,a,b]);
  tBox(ctx,TextContent, LeftMargin+a, TopMargin+b,TextWidth,Justification);
}
function sAppend(sname,anArray){
  let temp = Session.get(sname).slice(0);
  for(var i = 0; i < anArray.length; i++){
    temp.push(anArray[i]);
  }
  Session.set(sname,temp);
}
Template.PreviewCanvas.events({
    'change input[type=file]'(event) {
      inp = document.getElementById("inp");
      if (inp.files && inp.files[0]) {
        let FR = new FileReader();
        FR.addEventListener("load", function(e) {
          image.src = e.target.result;
          //document.getElementById("b64").innerHTML = e.target.result;
        });
        FR.readAsDataURL( inp.files[0] );
        let image = document.getElementById("img");
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        image.onload = function() {
            redraw(document.getElementById("myCanvas"));
        };
      }
    },
});
Template.PreviewCanvas.rendered = function(){
  redraw(document.getElementById("myCanvas"));
};
Template.Cropper.events({
  'click .rightPlus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.width+=10;
    redraw(canvas);
  },
  'click .rightMinus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.width-=canvas.width>10?10:0;
    redraw(canvas);
  },
  'click .leftMinus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.width-=10;
    canvas.setAttribute("data-left",canvas.getAttribute("data-left")-10);
    redraw(canvas);
  },
  'click .topMinus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.height-=10;
    canvas.setAttribute("data-top",canvas.getAttribute("data-top")-10);
    redraw(canvas);
  },
  'click .bottomPlus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.height+=10;
    redraw(canvas);
  },
  'click .bottomMinus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.height-=canvas.height>10?10:0;
    redraw(canvas);
  },
  'click .leftPlus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.width+=10;
    canvas.setAttribute("data-left", parseInt(canvas.getAttribute("data-left"))+10);
    redraw(canvas);
  },
  'click .topPlus': function(event, template){
    let canvas = document.getElementById("myCanvas");
    canvas.height+=10;
    canvas.setAttribute("data-top", parseInt(canvas.getAttribute("data-top"))+10);
    redraw(canvas);
  },
  'click .refresh': function(event, template){
    redraw(document.getElementById("myCanvas"));
  },
});
Template.TextFactory.onCreated(function() {
  Session.set("TextFactoryTextBoxes", []);
  sAppend("TextFactoryTextBoxes",[""]);
});
Template.TextFactory.helpers({
  textElements: function(){return(Array(Session.get("TextFactoryTextBoxes")));},
  newTextBox: function(){
    sAppend("TextFactoryTextBoxes",[""]);
  },
});
Template.TextFactory.events({
  'click #newTextBoxBtn': function(){
    sAppend("TextFactoryTextBoxes",["."]);
    redraw(document.getElementById("myCanvas"));
  },
});
Template.TextBox.events({
  "input input": function(e) {
      redraw(document.getElementById("myCanvas"));
  },
  "change": function(e) {
      redraw(document.getElementById("myCanvas"));
  },
});
Template.ImageSelector.onCreated(function() {
  Session.set( "ImageSelectorImages", []);
  sAppend("ImageSelectorImages",["This application is under development. Public alpha because super low key..."]) ;
});
Template.ImageSelector.helpers({
  images: function(){return(Array(Session.get("ImageSelectorImages")));},
  addImage: function(i){
    sAppend("ImageSelectorImages",[i]);
  },
});
Template.Emailer.events({
  'submit .emailer'(event){
    event.preventDefault();
    const target = event.target;
    let destination = target.email.value;
    let canvas = document.getElementById("myCanvas");
    let image = canvas.toDataURL();
    //console.log([destination,image]);
    let bodyStr = encodeURI('content-type: text/html;<html><body><img src="'+image+'" alt="PostCard" /></body></html>');
    let mailHandle = 'mailto:'+destination+'?subject=PostCard';
    var download = document.createElement('a');
    download.href = "data:"+image;
    download.download = 'postCard.png';
    download.click();
    console.log(mailHandle);
    mailWindow = window.open(mailHandle,
      "DescriptiveWindowName",
      "resizable,scrollbars,status");
  }
});
