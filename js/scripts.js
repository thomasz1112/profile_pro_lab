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
  if (localStorage.getItem('username') && ['signin.html', 'signup.html'].includes(getHtmlFileName())) {
    window.location.href = 'profile.html';
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
};