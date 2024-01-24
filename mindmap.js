"use strict";
// my helpers...
const $ = function(t = null) {
  return new class {
    constructor(t) {
      t && (this.nodes = t.nodeType ? [t] : NodeList.prototype.isPrototypeOf(t) ? t : document.querySelectorAll(t), this.n = this.nodes[0])
    }
    each = t => (this.nodes.forEach((s => t(s))), this);
    addClass = t => this.each((s => s.classList.add(...t.split(",").map((t => t.trim())))), this);
    html = t => this.each(s => s.innerHTML = t)
    create = t => $(document.createElement(t));
    append = t => {
      let s = this.create(t);
      return this.n.appendChild(s.n), s
    };
    remove = () => this.each(_node => _node.remove())
    insertAfter = t => (t.n.after(this.n), this);
    setAttr = (t, s = "") => this.each((e => e.setAttribute(t, s)), this);
    sCreate = t => {
      let s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      return s.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), s.setAttribute("viewBox", t), $(s)
    };
    sAppend = t => (this.n.appendChild(t.n), this);
    sC = t => document.createElementNS("http://www.w3.org/2000/svg", t);
    id = t => (this.setAttr("id", t), this);
    d = t => (this.setAttr("d", t), this);
    fill = t => (this.setAttr("fill", t), this);
    stroke = t => (this.setAttr("stroke", t), this);
    strokeWidth = t => (this.setAttr("stroke-width", t), this);
    sBezier = (t, s, e, i) => $(this.sC("path")).d(`M${t},${s} C ${(t+e)/2},${s} ${(t+e)/2},${i} ${e},${i}`);
  }(t)
};
// by resize repaint SVG
const resizeObserver = new ResizeObserver(entries => {
  $('#mySVG').remove()
  drawLines(data)
})

function createMap(data) {
  //find depth of Elements
  function findDepth(id, depth = 0) {
    while (id !== null) {
      let aktEl = data.filter(x => x.id == id)
      depth++
      id = aktEl[0].parentId
      if (id == null) depth = depth * aktEl[0].div
    }
    return depth
  }
  // first div at right side (-1*-1=1)
  var aktDiv = -1
  // swap between left and right side
  data.filter(x => x.parentId == null)
    .forEach(x => {
      x.div = aktDiv;
      aktDiv *= -1
    })
  // set root Elements div = 0
  data.find(x => x.id == null).div = 0
  // set divs for Childs
  data.filter(x => (x.parentId !== null && x.id !== null))
    .forEach(x => x.div = findDepth(x.id))
  // find min and max Div-Number
  let minDiv = Math.min(...data.map(item => item.div))
  let maxDiv = Math.max(...data.map(item => item.div))
  // create Divs in container
  for (let i = minDiv; i <= maxDiv; i++) {
    $('#container').append('div').id(`div${i}`).addClass('f-col')
  }
  // put paragraphs in Div´s
  data.forEach(el => {
    $(`#div${el.div}`).append('p').html(el.text).id(`p${el.id}`)
  })

  // Clear existing content in the container
  $('#container').html('');

  // create Divs in container
  for (let i = minDiv; i <= maxDiv; i++) {
    $('#container').append('div').id(`div${i}`).addClass('f-col').setAttr('style', 'align-items: center; width: 100%; height: 100vh; display: flex; justify-content: center;');
  }
  
  // put paragraphs in Div´s
  data.forEach(el => {
    $(`#div${el.div}`).append('p').html(el.text).id(`p${el.id}`).setAttr('style', 'margin: 0;');
  })
}

function drawLines(data) {
  // find Coordinates from Container
  let mC = $('#container').n.getBoundingClientRect();
  // calculate the center of the page
  let centerX = window.innerWidth / 2.04 - mC.width / 2;
  let centerY = window.innerHeight / 1.955 - mC.height / 2;
  // create SVG with same ViewportSize as Container
  $().sCreate(`0,0,${mC.width},${mC.height}`).setAttr('id', 'mySVG')
    .insertAfter($('#container'));
  // set SVG at the center of the page
  $('#mySVG').n.style = `top:${centerY + mC.top}px;left:${centerX + mC.left}px;
        width:${mC.width}px;height:${mC.height}px;`
  // create Bezier from Element's to Parent´s
  data.forEach(el => {
    if ('parentId' in el) {
      let aktEl = $(`#p${el.id}`).n.getBoundingClientRect()
      let parEl = $(`#p${el.parentId}`).n.getBoundingClientRect()
      let aktLeft = (aktEl.left < parEl.left) ? aktEl.left + aktEl.width : aktEl.left
      let parLeft = (aktEl.left > parEl.left) ? parEl.left + parEl.width : parEl.left
      let aktTop = aktEl.top + (aktEl.height / 2) - mC.top + centerY;
      let parTop = parEl.top + (parEl.height / 2) - mC.top + centerY;
      $('#mySVG').sAppend(
        $().sBezier(aktLeft - mC.left + centerX, aktTop, parLeft - mC.left + centerX, parTop).addClass('path'))
    }
  })
}



/* Entering data/pages */
/* { id: , parentId: , text: "" }, */
const data = [
    { id: null , text: "<b>Home (Average data value expected) </b>" },
    { id: 1 , parentId: null, text: "About" },
    { id: 2, parentId: null, text: "Focus" },
    { id: 3, parentId: null, text: "Data" },
    { id: 4, parentId: null, text: "Feedback" },
    { id: 5, parentId: null, text: "gibberish"}
    

];
createMap(data)
resizeObserver.observe($('#container').n)
