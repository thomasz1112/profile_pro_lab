jQuery(function ($) {
  var $bodyEl = $('body'),
    $sidedrawerEl = $('#sidedrawer');


  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function () {
        $sidedrawerEl
          .removeClass('active')
          .appendTo(document.body);
      }
    };

    var $overlayEl = $(mui.overlay('on', options));

    // show element
    $sidedrawerEl.appendTo($overlayEl);
    setTimeout(function () {
      $sidedrawerEl.addClass('active');
    }, 20);
  }


  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
  }


  $('.js-show-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);

  var $titleEls = $('strong', $sidedrawerEl);

  $titleEls
    .next()
    .hide();

  $titleEls.on('click', function () {
    $(this).next().slideToggle(200);
  });

  $('#signOutLink').click(function (event) {
    event.preventDefault(); // Prevent the default action

    // Clear user data from local storage
    localStorage.removeItem('username'); // Adjust this key if you store something else for the session

    // Optionally alert the user
    alert('You have successfully signed out.');

    // Redirect to another page, like the sign-in page
    window.location.href = 'signin.html';
  });
});

window.onload = async function () {
  const username = localStorage.getItem('username');
  const currentPage = getHtmlFileName();
  if (username && ['signin.html', 'signup.html'].includes(currentPage)) {
    window.location.href = 'profile.html';
  }

  if (username) {
    const usernameElements = document.querySelectorAll('.username');
    usernameElements.forEach(function (element) {
      element.textContent = username;
    });
  }

  var signinFormElem = document.getElementById('signinForm');
  if (signinFormElem) {
    signinFormElem.addEventListener('submit', handleSignup);
  }
  var signupFormElem = document.getElementById('signupForm');
  if (signupFormElem) {
    signupFormElem.addEventListener('submit', handleSignin);
  }

  if (currentPage == 'profile.html') {
    await cachePostsToLocal();
    appendPosts(['post_1.txt'], 'pinned-posts');
    appendPosts(['post_6.txt', 'post_5.txt', 'post_4.txt'], 'recent-posts');
  }

  if (currentPage == 'post_detail.html') {
    showPostDetail();
  }

  if (currentPage == 'posts.html') {
    const allPostIds = JSON.parse(localStorage.getItem('allPosts'));
    appendPosts(allPostIds, 'all-posts');
  }

  if (currentPage == 'gallery.html') {
    document.querySelectorAll('.gallery-img').forEach(img => {
      img.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = img.src; // Set the src for lightbox image
        lightbox.style.display = 'flex'; // Show the lightbox
      });
    });

    document.getElementById('lightbox').addEventListener('click', () => {
      const lightbox = document.getElementById('lightbox');
      lightbox.style.display = 'none'; // Hide the lightbox on click
    });
  }

  if (currentPage == 'resumes.html') {
    await showResumes();
  }
};

async function showResumes() {
  const resumeNames = ['web_development.txt', 'app_development.txt'];
  const container = document.getElementById('resumes');
  container.innerHTML = '';
  resumeNames.forEach(async (rn) => {
    const resumeData = await fetch(`./resumes/${rn}`).then(response => response.text())
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(resumeData);

    const resumeHtml = `
        <div id="resume">
            ${htmlContent}
        </div>
        <div class="mui-divider"></div>
    `;
    container.insertAdjacentHTML('beforeend', resumeHtml)

  })
}

function showPostDetail() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const postId = urlParams.get('postId');

  const postData = JSON.parse(localStorage.getItem(postId));
  var postDetailContainer = document.getElementById('post-detail-container');
  postDetailContainer.innerHTML = '';
  console.log(postDetailContainer)

  var postHtml = `
        <div id="post">
            <br>
            <div class="mui--text-headline">${postData.title}</div>
            <div class="mui--text-dark-secondary">By <a class="username" href="#">${postData.author}</a> ${postData.date}</div>
            <div>
                ${postData.htmlContent}
            </div>
        </div>
    `;
  postDetailContainer.insertAdjacentHTML('beforeend', postHtml)
}

function getHtmlFileName() {
  var path = window.location.pathname; // Gets the path
  var fileName = path.substring(path.lastIndexOf('/') + 1); // Extracts file name from the path
  return fileName;
}

function appendPosts(postIds, postsContainerId) {
  const postsContainer = document.getElementById(postsContainerId);
  postsContainer.innerHTML = '';
  postIds.forEach((id) => {
    const postData = JSON.parse(localStorage.getItem(id));
    const postHtml = `
        <div id="post">
            <br>
            <div class="mui--text-headline">${postData.title}</div>
            <div class="mui--text-dark-secondary">By <a class="username" href="#">${postData.author}</a> ${postData.date}</div>
            <div>
                ${postData.firstParagraph}
                <a href="post_detail.html?postId=${id}">Read more...</a>
            </div>
        </div>
    `;
    postsContainer.insertAdjacentHTML('beforeend', postHtml)
  });
}

function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const hashedPassword = btoa(password); // Same simple "encryption" for demonstration

  let users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username] === hashedPassword) {
    localStorage.setItem('username', username);
    alert('You are successfully signed in!');
    // Redirect to a new page or update UI
    window.location.href = 'profile.html';
  } else {
    alert('Invalid username or password.');
  }
}

function handleSignin(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;

  if (password !== passwordConfirm) {
    alert('Passwords do not match. Please try again.');
    return;
  }

  // Assume some basic encryption or hashing (not actually secure, just for demonstration)
  const hashedPassword = btoa(password); // Using Base64 just for the example

  // Check if users data already exists
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username]) {
    alert('Username already exists. Please use a different username.');
    return;
  }

  // Save new user data
  users[username] = hashedPassword;
  localStorage.setItem('users', JSON.stringify(users));

  alert('You have successfully signed up!');
  // Redirect or clear form
  this.reset();
  window.location.href = 'signin.html';
}

function trimContentByCharacter(content, maxLength) {
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
}

function getFirstParagraph(htmlContent) {
  // Create a new DOMParser instance
  const parser = new DOMParser();
  // Parse the HTML content into a document
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Find the first <p> element and return its innerHTML
  const firstParagraph = doc.querySelector('p');
  return firstParagraph ? firstParagraph.innerHTML : '';
}

function extractPostInfo(content) {
  const lines = content.split('\n');
  const title = lines[0].replace('# ', '');
  const markdownContent = lines.slice(1).join('\n');
  const username = localStorage.getItem('username');

  // Store the title in local storage or wherever needed
  localStorage.setItem('currentPostTitle', title);

  // Use Showdown to convert Markdown to HTML
  const converter = new showdown.Converter();
  const htmlContent = converter.makeHtml(markdownContent);
  const firstParagraph = getFirstParagraph(htmlContent)
  return {
    title,
    author: username || "Joe Doe",
    date: Date().toString(),
    firstParagraph,
    htmlContent
  }
}

async function cachePostsToLocal() {
  console.log("shit")
  const numberOfPosts = 6;
  let allPosts = [];
  let newestPosts = [];
  let pinnedPosts = ['post_1.txt']; // Example pinned posts, manage as needed

  for (let i = 1; i <= numberOfPosts; i++) {
    const postId = `post_${String(i)}.txt`; // Ensures correct file name

    const postData = await fetch(`./posts/${postId}`).then(response => response.text());

    const postDetail = extractPostInfo(postData)
    console.log(postDetail)

    // Store each post's content by ID in local storage
    localStorage.setItem(postId, JSON.stringify(postDetail));

    // Store each post ID in the allPosts array
    allPosts.push(postId);

    // Assume the newest posts are the last three added (for example)
    if (i > numberOfPosts - 3) newestPosts.push(postId);
  }

  // Store lists in local storage
  localStorage.setItem('allPosts', JSON.stringify(allPosts));
  localStorage.setItem('newestPosts', JSON.stringify(newestPosts));
  localStorage.setItem('pinnedPosts', JSON.stringify(pinnedPosts));
}