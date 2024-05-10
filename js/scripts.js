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
    document.getElementById('signinForm').addEventListener('submit', function (event) {
      console.log("sign in submit event triggered!")
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value; // In a real application, handle passwords securely
      localStorage.setItem('username', username); // Store username in local storage
      alert('You have successfully signed in!');
      window.location.href = 'profile.html';
    });
  }
};