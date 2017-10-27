document.querySelector('head').insertAdjacentHTML(
  'beforeend',
  `<style>
    .highlight { outline: 4px solid #07C; }
    .penguin-box{
      box-shadow: 0 0 10px 0 #000000;
      position: fixed;
      right: 25px;
      bottom: 25px;
      min-width: 350px;
      max-width:350px;
      min-height: 400px;
      padding: 15px;
      font-family: sans-serif;
      background-color: white;

    }
    .penguin-button {
      float: right;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: .5rem;
      padding-bottom: .5rem;
      background-color: #333;
      color: #fff;
      opacity: 1;
      cursor: pointer;
    }
    </style>`
)
console.log('Loading')

// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    addModal()
    document.body.addEventListener('mouseover', mouseover)

    document.body.addEventListener('click', click)
  }
})

// chrome.runtime.sendMessage({
//   message: 'open_new_tab',
//   url: window.location.href
// })

function mouseover(e) {
  e.stopPropagation()
  e.target.addEventListener('mouseout', function(e) {
    e.target.className = e.target.className.replace(
      new RegExp(' highlight\\b', 'g'),
      ''
    )
  })
  e.target.className += ' highlight'
}

function click(e) {
  document.body.removeEventListener('mouseover', mouseover)
  document.body.removeEventListener('click', click)

  document.querySelector('.pcms-textarea').value = e.target.innerHTML

  if (e.target.dataset.pcms != null && e.target.dataset.pcms != '') {
    document.querySelector('.pcms-selector').innerHTML = e.target.dataset.pcms
    var selector = e.target.dataset.pcms
  } else {
    document.querySelector('.pcms-selector').innerHTML = fullPath(e.target)
    var selector = fullPath(e.target)
  }

  var source = e.target
  document.querySelector('.pcms-textarea').addEventListener('input', e => {
    update(e, source)
  })
  document.querySelector('.penguin-button').addEventListener('click', e => {
    console.log({
      key: selector,
      content: document.querySelector('.pcms-textarea').value
    })
  })
}

function update(e, src) {
  src.innerHTML = e.target.value
}

function fullPath(el) {
  var names = []
  while (el.parentNode) {
    if (el.id) {
      names.unshift('#' + el.id)
      break
    } else {
      if (el == el.ownerDocument.documentElement) names.unshift(el.tagName)
      else {
        for (
          var c = 1, e = el;
          e.previousElementSibling;
          e = e.previousElementSibling, c++
        );
        names.unshift(el.tagName + ':nth-child(' + c + ')')
      }
      el = el.parentNode
    }
  }
  return names.join(' > ')
}

function addModal() {
  document.querySelector('body').insertAdjacentHTML(
    'beforeend',
    `
    <div class="penguin-box">
    <h4 class="penguin-close" style="float: right; cursor: pointer;">&nbsp;x&nbsp;</h4>
    <h4>Penguin CMS</h4>
    <hr>
    <p>
    <strong>Selector: </strong><span class="pcms-selector"></span>
    </p>
    <textarea class="pcms-textarea" style="width:100%; resize: none;" rows="20"></textarea>
    <button class="penguin-button">Generate JSON</button>
    </div>
  `
  )
  document.querySelector('.penguin-close').addEventListener('click', () => {
    document.querySelector('.penguin-box').remove()
    document
      .querySelector('.pcms-textarea')
      .removeEventListener('input', update)
  })
}
