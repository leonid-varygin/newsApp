function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Ошибка. Статус код: ${xhr.status}`, xhr)
            return
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response)
        })

        xhr.addEventListener('error', () => {
          cb(`Ошибка. Статус код: ${xhr.status}`, xhr)
        })
        xhr.send()
      } catch (error) {
        cb(error)
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Ошибка. Статус код: ${xhr.status}`, xhr)
            return
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response)
        })

        xhr.addEventListener('error', () => {
          cb(`Ошибка. Статус код: ${xhr.status}`, xhr)
        })

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            console.log(key, value);
          })
        }

        xhr.send(JSON.stringify(body))
      } catch (error) {
        cb(error)
      }
    }
  }
}


const http = customHttp()

const newsService = (function () {
  const apiKey = 'ca65f535117b49f59d605ae206fa321b',
    apiUrl = 'https://newsapi.org/v2'

  return {
    topHeadLines(country, cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`, cb)

    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb)

    }
  }

})()


// const form = document.querySelector('.newsControls');
// const countrySelect = document.querySelector('#country');
// const searchInput = document.querySelector('.autocomplete');

const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const searchInput = form.elements['search']

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews()
})

document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit()
  loadNews()
})

console.log(form);
// console.log(countrySelect.value);









/* -------------------------------------------------------------------------- */
/*                               load news func                               */
/* -------------------------------------------------------------------------- */
function loadNews() {
  showLoader()
  const country = countrySelect.value
  const searchText = searchInput.value
  if (!searchText) {
    newsService.topHeadLines(country, onGetResponse)
  } else {
    newsService.everything(searchText, onGetResponse)
  }

}


/* -------------------------------------------------------------------------- */
/*                         Func on get response server                        */
/* -------------------------------------------------------------------------- */
function onGetResponse(err, res) {
  removePreloader()

  if(err) {
    showAlert(err, 'error-msg')
    return
  }

  if(!res.articles.length){
    //show empty message
    return
  }
  renderNews(res.articles)
}

/* -------------------------------------------------------------------------- */
/*                              func render news                              */
/* -------------------------------------------------------------------------- */
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row')
  if(newsContainer.children.length) {
    clearContainer(newsContainer)
  }
  let fragment = ''

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem)
    fragment += el
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment)
}

function clearContainer(container) {
  let child = container.lastElementChild
  while(child) {
    container.removeChild(child)
    child = container.lastElementChild
  }
}



function newsTemplate({
  urlToImage,
  title,
  url,
  description
}) {
  return `
    <div class="col s12 m6">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">${url || ''}</a>
        </div>
      </div>
    </div>
  `
}

function showAlert(msg, type = 'success') {
  M.toast({ html: msg, classes: type })
}


/* -------------------------------------------------------------------------- */
/*                              show loader func                              */
/* -------------------------------------------------------------------------- */

function showLoader() {
  document.body.insertAdjacentHTML('afterbegin', 
  `<div class="progress">
      <div class="indeterminate"></div>
  </div>
  `)
}


/* -------------------------------------------------------------------------- */
/*                            //remove loader func                            */
/* -------------------------------------------------------------------------- */

function removePreloader() {
  const loader = document.querySelector('.progress')
  if(loader) {
    loader.remove()
  }
}