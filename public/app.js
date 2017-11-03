document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('signin-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.redirectToSignIn()
  })
  document.getElementById('signout-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.signUserOut(window.location.href)
  })

  function showProfile(profile) {
    var api = "https://api.smartbit.com.au/v1/blockchain/address/";
    var person = new blockstack.Person(profile)
    if(profile.account[0].service === "bitcoin"){
      var bitcoinAddress = profile.account[0].identifier;
    } else if (profile.account[1].service === "bitcoin"){
      var bitcoinAddress = profile.account[1].identifier;
    } else if (profile.account[2].service === "bitcoin"){
      var bitcoinAddress = profile.account[2].identifier;
    } else if (profile.account[3].service === "bitcoin"){
      var bitcoinAddress = profile.account[3].identifier;
    } else if (profile.account[4].service === "bitcoin"){
      var bitcoinAddress = profile.account[4].identifier;
    } else if (profile.account[5].service === "bitcoin"){
      var bitcoinAddress = profile.account[5].identifier;
    }
    fetch(api + bitcoinAddress)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {
            var coins = data.address.confirmed.received_int/10000000;
            document.getElementById('value').innerHTML = coins;
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      var bitcoinAmount = fetch("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR")
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
              var bitcoinAmount = data.USD;
            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
        console.log(profile)
    document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
    document.getElementById('key').innerHTML = bitcoinAddress;
    document.getElementById('description').innerHTML = profile.description;
    // document.getElementById('vallue').innerHTML = coins;
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    }
    document.getElementById('section-1').style.display = 'none'
    document.getElementById('section-2').style.display = 'block'
  }
  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile
      showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }
})
