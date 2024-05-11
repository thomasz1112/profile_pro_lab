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

function getHtmlFileName() {
  var path = window.location.pathname; // Gets the path
  var fileName = path.substring(path.lastIndexOf('/') + 1); // Extracts file name from the path
  return fileName;
}

window.onload = function () {
  const username = localStorage.getItem('username');
  const currentPage = getHtmlFileName();
  if (username && ['signin.html', 'signup.html'].includes(currentPage)) {
    window.location.href = 'profile.html';
  }

  if (username) {
    const usernameElements = document.querySelectorAll('.username'); // Select all elements with the class 'username'
    usernameElements.forEach(function (element) {
      element.textContent = username; // Set the text content of each element to the username
    });
  }

  var signinFormElem = document.getElementById('signinForm');
  if (signinFormElem) {
    signinFormElem.addEventListener('submit', function (event) {
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
    });
  }
  var signupFormElem = document.getElementById('signupForm');
  if (signupFormElem) {
    signupFormElem.addEventListener('submit', function (event) {
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
    });
  }

  if (currentPage == 'profile.html') {
    cachePostsToLocal()
  }
};

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
  const lines = content.split('\n'); // Split the content into lines
  const title = lines[0].replace('# ', ''); // Assume the first line is the title
  const markdownContent = lines.slice(1).join('\n'); // The rest is the content

  // Store the title in local storage or wherever needed
  localStorage.setItem('currentPostTitle', title);

  // Use Showdown to convert Markdown to HTML
  const converter = new showdown.Converter();
  const htmlContent = converter.makeHtml(markdownContent);
  const firstParagraph = getFirstParagraph(htmlContent)
  return {
    title,
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
    localStorage.setItem(postId, postDetail);

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