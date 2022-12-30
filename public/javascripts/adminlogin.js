function login() {
  $(document).ready(function () {
    // WORKING: AJAX INSERT DATA FROM DB
    $('#login_info').on('submit', (e) => {
      e.preventDefault()
      $.ajax({
        url: `${window.location.origin}/adminlogin/action`,
        method: "POST",
        data: { action: 'fetch' },
        dataType: "JSON",
        success: (data) => {
          var datas = data.data
          var fn = $('#username').val()
          var password = $('#password').val()

          for (var i = 0; i < data.data.length; i++) {
            if (datas[i].name == fn && datas[i].password == password) {

              window.location.assign('/admintable')
            }
            else {
              $('#message').html(`<br><div class="alert alert-warning">Wrong Username or Password</div>`)

              setTimeout(() => {
                $('#message').html('')
              }, 2000)
            }
          }

          $('#login_info')[0].reset()
        }
      })
    })
  })
}