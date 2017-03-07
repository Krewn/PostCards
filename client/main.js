import { Template } from 'meteor/templating';
import { Reactivevar } from 'meteor/reactive-var';

import './main.html';

/*
	Template.hello.onCreated(function helloOnCreated() {
	  // counter starts at 0
	  this.counter = new Reactivevar(0);
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
Template.PreviewCanvas.events({
    'change input[type=file]'(event) {
      console.log(event);
      inp = document.getElementById("inp");
      if (inp.files && inp.files[0]) {
        var FR = new FileReader();
        FR.addEventListener("load", function(e) {
          image.src = e.target.result;
          //document.getElementById("b64").innerHTML = e.target.result;
        });
        FR.readAsDataURL( inp.files[0] );
        var image = document.getElementById("img");
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
        };
      }
    },
});
function redraw(a,b){
  var image = document.getElementById("img");
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, a, b);
}
Template.Cropper.events({
  'click .rightPlus': function(event, template){
    console.log("fired");
    var canvas = document.getElementById("myCanvas");
    canvas.width+=10;
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .rightMinus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.width-=canvas.width>10?10:0;
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .leftPlus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.width+=10;
    canvas.setAttribute("data-left", canvas.getAttribute("data-left")+10);
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .leftMinus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.width-=10;
    canvas.setAttribute("data-left",canvas.getAttribute("data-left")-10);
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .topPlus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.height+=10;
    canvas.setAttribute("data-top",canvas.getAttribute("data-top")+10);
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .topMinus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.height-=10;
    canvas.setAttribute("data-top",canvas.getAttribute("data-top")-10);
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .bottomPlus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.height+=10;
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  },
  'click .bottomMinus': function(event, template){
    var canvas = document.getElementById("myCanvas");
    canvas.height-=canvas.height>10?10:0;
    redraw(canvas.getAttribute("data-left"),canvas.getAttribute("data-top"));
  }
});
Template.logo.helpers({
  logoSrc() {
		return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZcAAAAfCAYAAAAr8oAMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExODA4M0VCODNDNjJCRDdDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MEU3QjQ2NUY5MzgxMUU0OTNBOUQxMUQzNUJBODA0QyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MEU3QjQ2NEY5MzgxMUU0OTNBOUQxMUQzNUJBODA0QyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUNBRjQ3ODM3NTI1NjgxMTgyMkFBNDBCMDYwODI1N0YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc3RjExNzQwNzIwNjgxMTgwODNFQjgzQzYyQkQ3QzEiLz4gPC9yZGY6RGVzY3Jp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";
	},
});
