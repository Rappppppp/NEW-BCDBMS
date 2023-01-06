
const url = `${window.location.origin}/official/action`
load_data()

function dob(date) {
  var d = new Date(date)
  var today = new Date()

  var birthdate =
    d.getFullYear() + "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    ("0" + d.getDate()).slice(-2)
  var age = today.getFullYear() - d.getFullYear()
  $('#age').val(age)
  return birthdate
}

function load_data() {
  $.ajax({
    url: url,
    method: "POST",
    data: { action: 'fetch' },
    dataType: "JSON",
    success: function (data) {
      var html = ''
      if (data.data.length > 0) {
        for (var i = 0; i < data.data.length; i++) {
          html += `
                  <tr>
                      <td>
                          <input type="checkbox" value="${data.data[i].id}" name="delete_id" class="delete_id" id="delete_id"/>
                          <a href="/admintable/${data.data[i].id}" target="_blank">${data.data[i].id}</a>
                      </td>
                      <td>${data.data[i].role}</td>
                      <td>${data.data[i].first_name} ${data.data[i].middle_name.split(' ').map(word => word.charAt(0))}. ${data.data[i].last_name}</td>
                      <td>${data.data[i].gender}</td>
                      <td>${dob(data.data[i].dob)}</td>
                      <td>${data.data[i].age}</td>
                      <td>${data.data[i].pob}</td>
                      <td>${data.data[i].civil_status}</td>
                      <td>${data.data[i].religion}</td>
                      <td id="isActive" class="${data.data[i].isActive == 1 ? 'alert alert-success' : 'alert alert-danger'}">${data.data[i].isActive == 1 ? 'Active' : 'Inactive'}</td>
                  </tr>
                  `
        }
      } else { console.log('error no data found') }
      $('#user_data tbody').html(html)

      $('#user_data').dataTable({

        initComplete: function () {
          this.api().columns().every(function () {
            var column = this;
            var select = $('<select  class="browser-default custom-select form-control-sm"><option value="" selected>Search</option></select>')
              .appendTo($(column.footer()).empty())
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                )
                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              })

            column.data().unique().sort().each(function (d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            })
          })
        },
        "bDestroy": true
      })
    }
  })
}

