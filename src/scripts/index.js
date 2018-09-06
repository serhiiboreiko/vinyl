const getAverageRGB = (imgEl) => {
  const blockSize = 5;
  const defaultRGB = { r: 0, g: 0, b: 0 };
  const canvas = document.createElement('canvas');
  const context = canvas.getContext && canvas.getContext('2d');
  let data;
  let i = blockSize * 4;
  const rgb = { r: 0, g: 0, b: 0 };
  let count = 0;

  if (!context) {
    return defaultRGB;
  }

  const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    console.warn(e);
    return defaultRGB;
  }

  const length = data.data.length;

  while (i < length) {
    count += 1;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
    i += blockSize * 4;
  }

  rgb.r = ~~(rgb.r / count); // eslint-disable-line no-bitwise
  rgb.g = ~~(rgb.g / count); // eslint-disable-line no-bitwise
  rgb.b = ~~(rgb.b / count); // eslint-disable-line no-bitwise

  return rgb;
};

const toDataURL = url =>
  fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));

const getImageElement = (base64) => {
  const image = document.createElement('img');
  image.src = base64;
  return image;
};

const getShadow = ({ r, g, b }) =>
  `0 0.3em 0.5em -0.2em rgba(${r}, ${g}, ${b}, .5),
  0 1em 2em -0.75em rgba(${r}, ${g}, ${b}, .45),
  0 1em 3em -0.5em rgba(${r}, ${g}, ${b}, .2),
  0 3em 3em -0.25em rgba(${r}, ${g}, ${b}, .1)`;


const copyItemsForBlur = () => {
  const items = document.querySelector('#items .items-content');

  const itemsBefore = document.getElementById('items-before');

  itemsBefore.innerHTML = items.innerHTML;

  items.onscroll = (event) => {
    itemsBefore.scrollTop = items.scrollTop;
  };
};

copyItemsForBlur();

const setActiveItem = (item) => {
  const imgEl = item.querySelector('img')
  const img = imgEl.src;

  const artist = item.querySelector('.artist').innerHTML;
  const album = item.querySelector('.album').innerHTML;
  const link = item.querySelector('.link a').href;
  const year = item.querySelector('.year').innerHTML;

  const activeCover = document.getElementById('activeCover');

  activeCover.src = img;
  activeCover.style.boxShadow = getShadow(getAverageRGB(imgEl));

  document.getElementById('activeArtist').innerHTML = artist;
  document.getElementById('activeAlbum').innerHTML = album;
  document.getElementById('activeYear').innerHTML = year;
  document.getElementById('activeLink').href = link;

  document.getElementById('activeTitle').innerHTML = album;
};

const items = document.querySelectorAll('.items .items-content .item');

items.forEach(item => {
  item.onmouseenter = () => { setActiveItem(item); };
});

setActiveItem(document.querySelector('.items .items-content .item:first-child'));
