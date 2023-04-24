const main = document.querySelector('main');

const menuObj = [
  { title: 'Posts', targetURL: '#' },
  { title: 'About me', targetURL: '#' },
  { title: 'Contact', targetURL: 'https://www.facebook.com' }
];

function showChevron() {
  const scrollTop = window.scrollY;
  const chevron = document.querySelector('.arrow');
  let bottomValue = Math.floor(1 + scrollTop / 5);

  if (bottomValue < 10) {
    chevron.style.bottom = '-120px';
  } else if (bottomValue > 10 && bottomValue < 20) {
    chevron.style.bottom = `${bottomValue}px`;
  }
}


function dimLogo() {
  const logo = document.querySelector('.big-logo');
  const scrollTop = window.scrollY;
  logo.style.opacity = 1 - scrollTop / 350;
  const navBar = document.querySelector('.nav-container');

  if (scrollTop / 1000 < 0.3) {
    navBar.style.backgroundColor = `rgba(241, 240, 246, .8`;
  } else {
    navBar.style.backgroundColor = `rgba(241, 240, 246, ${
      scrollTop / 1000 + 0.6
    })`;
  }
  showChevron();
}

async function getPosts() {
  const res = await fetch('/posts.json');
  const posts = await res.json();
  return posts;
}

async function createMainPosts(posts) {
  const newPosts = await getPosts();
  const firstTwoPosts = newPosts.map((post, index) => {
    if (index <= 2) {
      const div = document.createElement('div');
      div.classList.add('post-preview');
      div.innerHTML = `
        
            <img src="${
              post.imgSrc
            }" class="responsive" alt="stairs" width="100%">
            <h2 post-heading>${post.title}</h2>
            <hr class="line">
            <span class="date-posted">
                <em>Posted on ${post.date}</em>
            </span>
            <div class="post-entry">
                <p id ="${post.id}">
                ${
                  post.body.length > 400
                    ? `${post.body.substring(0, 400)}...`
                    : post.body
                }
                </p><br><p id="read-more">Läs mer</a>
            </div>
            `;

      document.querySelector('main').appendChild(div);
    }
  });
    createSidePosts(newPosts);
}

function createSidePosts(posts) {
  posts.forEach((post, index) => {
    if (index > 2 && index < 8) {
        const li = document.createElement('li');
      li.innerHTML = `
            <h5>${post.title}</h5>
            <p>${post.body.substring(0, 100)} . . .</p>
            <a href="#"><span class="read-more-btn">Läs mer</span></a>`;
      document.querySelector('.recent').appendChild(li);
    }
  });
}

async function showFullPost(e) {
  const posts = await getPosts();
  let fullBody;
  if (e.target.id === 'read-more') {
    const activePost = e.target.previousSibling.previousSibling.id;
      if (activePost === '1') {
          e.target.parentElement.parentElement.classList.toggle('active');
          
          if (!e.target.parentElement.classList.contains('active')) {
        e.target.previousSibling.previousSibling.textContent = posts[0].body;
        e.target.parentElement.classList.add('active');
        e.target.textContent = "Close"; 
    } else {
        e.target.previousSibling.previousSibling.textContent = posts[0].body.substring(0, 400);
        e.target.parentElement.classList.remove('active');
        e.target.textContent = "Read More";
            }
    }
  }
}

function createMenuItem(item) {  
  const li = document.createElement('li');
  li.classList.add('list-item');
  li.innerHTML = `<a href="${item.targetURL}">${item.title}</a>`
  document.querySelector('.menu').appendChild(li);
}

function showNavItems(e) {
  if (e.target.classList.contains('fa-bars') && e.target.id !== 'active') {
    document.querySelector('.menu').hidden = false;
    e.target.id = 'active';
    e.target.classList.remove('fa-bars');
    e.target.classList.add('fa-xmark');
    document.getElementById('active').style.fontSize = '1.4rem';
    menuObj.forEach((item, index) => {
      setTimeout(() => {
        createMenuItem(item);
      }, index * 40);
    });
  } else if (e.target.id === 'active') {
    document.querySelector('.menu').hidden = true;
    document.querySelector('.menu').innerHTML = '';
    e.target.id = '';
    e.target.classList.remove('fa-xmark');
    e.target.classList.add('fa-bars');
    document.querySelector('.fa-bars').style.fontSize = '1.3rem';

  }
}

function rollUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
})
}

function init() {
  document.querySelector('.menu').hidden = true;
  document.querySelector('.menu').innerHTML = '';

}

init();

window.addEventListener('DOMContentLoaded', createMainPosts);
document.querySelector('nav').addEventListener('click', showNavItems);
window.addEventListener('scroll', dimLogo);
main.addEventListener('click', showFullPost);
document.querySelector('.top-arrow').addEventListener('click', rollUp);
// document.querySelector('fa-xmark').addEventListener('click', () => document.getElementById('active').hidden = true);

