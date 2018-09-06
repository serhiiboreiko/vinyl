const copyItemsForBlur = () => {
  const items = document.querySelector('#items .items-content');

  const itemsBefore = document.getElementById('items-before');

  itemsBefore.innerHTML = items.innerHTML;

  items.onscroll = (event) => {
    itemsBefore.scrollTop = items.scrollTop;
  };
};

copyItemsForBlur();
