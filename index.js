var down = document.getElementById('download'),
    text1 = document.getElementById('text1'),
    text2 = document.getElementById('text2'),
    sliderSize = document.getElementById('sliderSize'),
    sliderSizeBottom = document.getElementById('sliderSizeBottom'),
    canvas = document.getElementById('canvas'),
    uploaded = document.getElementById('uploaded'),
    meme_images = document.getElementsByClassName('meme-preview-img'),
    firstMemeElement = document.getElementsByClassName('active-meme')[0];

text1.addEventListener('keyup', updateImage);
text2.addEventListener('keyup', updateImage);
sliderSize.addEventListener('change', updateImage);
sliderSizeBottom.addEventListener('change', updateImage);
down.addEventListener('click', exportCanvas);
$('.meme-preview-img').on('click', changeBaseImg);

var curImg = null;

firstMemeElement.onload = function() {
    curImg = firstMemeElement;
    updateImage();
}


function drawLines(ctx, lines, x, y, yStep) {
    lines = lines.split('\n');
    if (yStep < 0) lines = lines.reverse();
    lines.forEach(function(l, k) {
        ctx.strokeText(l, x, y + yStep * k);
        ctx.fillText(l,   x, y + yStep * k);

    });
}

function updateImage() {
    var LINE_HEIGHT = 1.1;
    var PARAGRAPH_HEIGHT = 1.2;

    var canvasSize = autoScale({
        w: curImg.width,
        h: curImg.height
    }, 600);

    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;

    var ctx = canvas.getContext("2d");
    var txtSize = parseFloat(sliderSize.value) || 24;
    var txtSizeBottom = parseFloat(sliderSizeBottom.value) || 24;

    if (!curImg) return;

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(curImg, 0, 0, canvas.width, canvas.height);

    ctx.font = txtSize + "px Impact";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = Math.round(Math.max(1, txtSize / 12));

    drawLines(ctx, text1.value, canvas.width / 2,
              txtSize * PARAGRAPH_HEIGHT / 2, LINE_HEIGHT * txtSize);

    ctx.font = txtSizeBottom + "px Impact";
    drawLines(ctx, text2.value, canvas.width / 2,
              canvas.height - txtSizeBottom * PARAGRAPH_HEIGHT, -1 * LINE_HEIGHT * txtSize );


    //apply hashtag image overlay
    var imageObj = new Image();
    imageObj.onload = function() {
      ctx.drawImage(imageObj, 400, 560);
    };
    imageObj.src = 'assets/img/i16-tag.png';

    console.log(text1.value, text2.value);
}


function autoScale(input, max) {
    var larger = input.w > input.h ? 'w' : 'h',
        smaller = larger == 'w' ? 'h' : 'w';
    var factor = max / input[larger];

    var output = {};
    output[larger] = factor * input[larger];
    output[smaller] = factor * input[smaller];
    return output;
}

function exportCanvas(){
  if (canvas && canvas.getContext) {
    var img = canvas.toDataURL("image/png;base64;");
    img = img.replace("image/png","image/octet-stream"); // force download, user would have to give the file name
    down.href = img;
  } else {
    alert("Can not export");
  }
}

function changeBaseImg () {
  console.log('ehy');
  $('#' + curImg.id).removeClass('active-meme');  //this is hacky. could just be javascript instead of this quazi-jquery. (but, hey, it works)
  $('#' + this.id).addClass('active-meme'); //this is hacky too. (but, hey, it works)
  curImg = this;
  updateImage();
}
