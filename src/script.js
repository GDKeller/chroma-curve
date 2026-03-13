let hue = 200;
let saturation = 0.2;
let sMod = 70;

const hueSlider = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const sModSlider = document.getElementById('sMod');

noUiSlider.create(hueSlider, {
    start: hue,
    connect: 'lower',
    step: 1,
    tooltips: true,
    range: {
        'min': 0,
        'max': 360
    }
}).on('update', (values, handle) => {
  hue = parseFloat(values[0]);
  previewPalette();
});

noUiSlider.create(saturationSlider, {
    start: saturation,
    connect: 'lower',
    step: 0.01,
    tooltips: true,
    range: {
        'min': 0,
        'max': 1
    }
}).on('update', (values, handle) => {
  saturation = parseFloat(values[0]);
  previewPalette();
});

noUiSlider.create(sModSlider, {
    start: sMod,
    connect: 'lower',
    step: 1,
    tooltips: {
      to: function(value) {
        const v = 0 - Math.pow(50, 2)/value;
        return Math.round(v) + '%'; 
      }
    },
    range: {
        'min': 25,
        '80%': [200, 100],
        'max': [2500]
    }
}).on('update', (values, handle) => {
  sMod = parseFloat(values[0]);
  previewPalette();
});

function previewPalette() {
  document.getElementById('preview').innerHTML = getPaletteHTML(
      generateNeutrals(
        {hue: hue, distance: 0.01, max: 1.01, min: 0.03, saturation: saturation}
      )
  );
  
  document.getElementById('miniPreview').innerHTML = getMiniPaletteHTML(
      generateNeutrals(
        {hue: hue, distance: 0.01, max: 1.01, min: 0.03, saturation: saturation}
      )
  );
}

/*
  visual representation
  https://www.desmos.com/calculator/02ufrfsuzy
*/
function getSaturation2(l) {
  const o = 50; // ranges goes from 0 to 100, 50 is the lowest value 
  const p = sMod;
  const v = 1 + (Math.pow(l - o, 2)/p - Math.pow(o, 2)/p) / 100;
  return v;
}

function generateNeutrals(params) {
  let {
    hue = 200,
    saturation = 0.1,
    min = 0.04,
    max = 1,
    distance = 0.02
  } = params || {};
  
  let tokens = {};
  
  let colorsArray = [];
  let value = min;
  let step = 0;
  console.clear()
  while (value < max ) {
    const i = parseInt(value * 100);
    const sK = getSaturation2(i);

    console.log(sK);
    
    const color = chroma.hsl(hue, saturation * sK, value);
    tokens[`grey-${i}`] = {
      '$value': color.css('hsl')
    }
    
    colorsArray.push(
      color.css('hsl')
    )
    step++;
    value = step * distance + min;
  }
  console.log(tokens);
  return colorsArray.reverse();
}

function getPaletteHTML(colors) {
  let markup = [];
  colors.forEach((c, i) => {
    
    let contrast = [
      chroma.contrast("white", c),
      chroma.contrast("#1d1d1d", c)
    ];

    markup.push(`
      <div class="color-box" style="background: ${c}; color: ${contrast[0] < 2.9 ? "#1d1d1d" : "#FFF"}">
        <div class="row">
          <b>grey-${100-i}</b>
        </div>
        <div class="row">
          <span>hsl</span><span>${outputHSL(c)}</span>
        </div>
      </div>
    `);
  });
  
  return markup.join('');
}

function getMiniPaletteHTML(colors) {
  let markup = [];
  colors.forEach((c, i) => {
    if(true) {
      markup.push(`
        <div class="color-box" style="background: ${c};" title="grey-${i}">
        </div>
      `);      
    }
  });
  
  return markup.join('');
}

function outputHSL(color) {
  const [h, s, l] = chroma(color).hsl();
  return `${Math.round(h)|| 0}deg ${Math.round(roundTwoDigits(s) * 100)}% ${Math.round(roundTwoDigits(l) * 100)}%`;
}

function roundTwoDigits(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
