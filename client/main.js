import { Template } from 'meteor/templating';
import { Reactivevar } from 'meteor/reactive-var';

import './main.html';

/*
	Template.hello.onCreated(function helloOnCreated() {
	  // counter starts at 0
	  this.counter = new ReactiveVar(0);
	});

	Template.hello.helpers({
	  counter() {
	    return Template.instance().counter.get();
	  },
	});
  Template.hello.events({
    'click button'(event, instance) {
      // increment the counter when button is clicked
      instance.counter.set(instance.counter.get() + 1);
    },
  });
*/
function makeLines(text,font,width,ctx){
  ctx.font = font;
  let spaces = [];
  for(var k in text){
    if(text[k]==" "){spaces.push(k);}
  }
  let lines = [];
  let lastEnd = -1;
  let lastk = 0;
  for(var k in spaces){
    if(ctx.measureText(text.slice(parseInt(lastEnd)+1,spaces[k])).width>width){
      lines.push(text.slice(parseInt(lastEnd)+1,lastk));
      lastEnd = lastk;
    }
    lastk = spaces[k];
  }
  lines.push(text.slice(parseInt(lastEnd)+1,text.Length));
  return(lines);
}
function renderLines(lines,font,ctx,x,y){
  ctx.font = font;
  h = 40;
  for(var k in lines){
    ctx.fillText(lines[k], x, y+h*k);
  }
}
function renderLinesRightJustified(lines,font,ctx,x,y,TextWidth){
  ctx.font = font;
  h = 40;
  for(var k in lines){
    let offset = TextWidth-ctx.measureText(lines[k]).width;
    ctx.fillText(lines[k], x+offset, y+h*k);
  }
}
function renderLinesCentered(lines,font,ctx,x,y,TextWidth){
  ctx.font = font;
  h = 40;
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
  h = 40;
  for(var k in lines){
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
function tBox(ctx,TextContent,x,y,TextWidth,Justice){
  switch(Justice) {
    case "RightJustified":
        console.log("r");
        renderLinesRightJustified(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    case "Centered":
        console.log("c");
        renderLinesCentered(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    case "FullyJustified":
        console.log("f");
        renderLinesFullyJustified(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y,TextWidth);
        break;
    default:
        console.log("l");
        renderLines(makeLines(TextContent,ctx.font,TextWidth,ctx),ctx.font,ctx,x,y);
  }
}
function redraw(c){
  let a = parseInt(c.getAttribute("data-left"));
  let b = parseInt(c.getAttribute("data-top"));
  let image = document.getElementById("img");
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let WaterMark = document.getElementById("watermark");
  if(!WaterMark.checked){ctx.clearRect(0, 0, canvas.width, canvas.height);}
  ctx.drawImage(image, a, b);
  ctx.font = '28px serif';
  let elements = document.getElementById("TextBox");
  let data = [];
  for (var i = 0; i < elements.length; i++) {
    let temp = elements[i].value;
    if(temp != "") {
      data.push(temp);
    }
  }
  let TextContent = data[0];
  let TextWidth = parseInt(data[1]);
  let LeftMargin = parseInt(data[2]);
  let TopMargin = parseInt(data[3]);
  let Justification = data[4];
  //console.log([TextContent,TextWidth,LeftMargin,TopMargin,a,b]);
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
      console.log(event);
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
    console.log("fired");
    sAppend("TextFactoryTextBoxes",["."]);
    console.log(Session.get("TextFactoryTextBoxes"));
    redraw(document.getElementById("myCanvas"));
  },
});
Template.TextBox.events({
  'submit': function(event){
    redraw(document.getElementById("myCanvas"));
  },
  'keyup [class=TextBox]': function(event){
    redraw(document.getElementById("myCanvas"));
  },
});
Template.ImageSelector.onCreated(function() {
  Session.set( "ImageSelectorImages", []);
  sAppend("ImageSelectorImages",["test"]) ;
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
