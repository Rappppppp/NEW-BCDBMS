
const url = `${window.location.origin}/admin/action`
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
                      <td>
                          <button type="button" class="btn btn-warning btn-sm edit" data-id="${data.data[i].id}">Edit</button>
                          
                          &nbsp
                          
                          <button type="button" class="btn btn-danger btn-sm delete" data-id="${data.data[i].id}">Delete</button>
                      </td>
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

$('#add_data').click(() => {
  $('#dynamic_modal_title').text('Add Data')
  $('#user_form')[0].reset()
  $('#action').val('Add')
  $('#action_button').text('Add')
  $('#action_modal').modal('show')
})

$('#close_button').click(() => {
  $('#action_modal').modal('hide')
})

$('#user_form').on('submit', (event) => {
  event.preventDefault()

  $.ajax({
    url: url,
    method: "POST",
    data: $('#user_form').serialize(),
    dataType: "JSON",
    beforeSend: function () {
      $('#action_button').attr('disabled', 'disabled')
    },
    success: window.location.reload()
  })
})

$(document).on('click', '.edit', function () {
  var id = $(this).data('id')

  $('#dynamic_modal_title').text('Edit Data')
  $('#action').val('Edit')
  $('#action_button').text('Edit')
  $('#action_modal').modal('show')
  $.ajax({
    url: url,
    method: "POST",
    data: { id: id, action: 'fetch_single' },
    dataType: "JSON",
    success: function (data) {
      d = new Date(data.dob)
      dateFormat =
      d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2)+ "-" +
      ("0" + d.getDate()).slice(-2); 
  
      $('#id').val(data.id)
      $('#first_name').val(data.first_name)
      $('#last_name').val(data.last_name)
      $('#middle_name').val(data.middle_name)
      $('#role').val(data.role)
      $('#password').val(data.password)
      $('#gender').val(data.gender)
      $('#datepicker').val(dateFormat)
      $('#age').val(data.age)
      $('#pob').val(data.pob)
      $('#civil_status').val(data.civil_status)
      $('#isActiveForm').val(data.isActive)
      $('#religion').val(data.religion)
    }
  })
})

$(document).on('click', '.delete', function () {
  var id = $(this).data('id')
  if (confirm("Are you sure you want to delete this data?")) {
    $.ajax({
      url: url,
      method: "POST",
      data: {
        action: 'delete',
        id: id
      },
      dataType: "JSON",
      success: (data) => {
        alert(data.message)
        window.location.reload()
      }
    })
  }
})

// Multiple Delete
idArr = []

$(document).on('change', '.delete_id', function () {
  if (this.checked) idArr.push($(this).val())
  if (!this.checked) idArr.pop($(this).val())
})

$(document).on('click', '#select-all', function () {
  $(this).html('Unselect All')
  $(this).prop('id', 'unselect-all')
  $('.delete_id').prop('checked', true).map((i, cb) => idArr.push(cb.value))
})

$(document).on('click', '#unselect-all', function () {
  $(this).html('Select All')
  $(this).prop('id', 'select-all')
  $('.delete_id').prop('checked', false).map((i, cb) => idArr.pop(cb.value))
})

$(document).on('click', '#multipleDelete_btn', function () {
  if (idArr == '') {
    alert('No Data Selected')
  }
  else {
    if (confirm("Are you sure you want to delete this data?")) {
      $.ajax({
        url: `${window.location.origin}/admin/action`,
        method: "POST",
        data: {
          action: 'delete_id',
          data: JSON.stringify(idArr)
        },
        dataType: "JSON",
        success: function (data) {
          alert(data.message)
          window.location.reload()
        }
      })
    }
  }
})