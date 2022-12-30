function getCurrentDate() {
    var d = new Date()
    var date = d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2)

    return date
}

function getCurrentTime() {
    var currentTime;
    var currentDate = new Date()
    var hour = currentDate.getHours();
    var meridiem = hour >= 12 ? "PM" : "AM";
    var currentTime = `${((hour + 11) % 12 + 1)}:${currentDate.getMinutes()} ${meridiem}`

    return currentTime;
}

$('#date_post').val(getCurrentDate())
$('#time_post').val(getCurrentTime())

$(document).ready(() => {

    $(document).on('click', '#close_button', function () {
        $('#form_post')[0].reset()
        $('#action_button').attr('disabled', false)
        $('#action_modal').modal('hide')
    })

    var url = `$${window.location.origin}/adminposts/editpost`

    $(document).on('click', '.edit', function (e) {
        e.preventDefault()
        var id = $(this).data('id')

        $('#dynamic_modal_title').text('Edit Post')
        $('#action').val('Edit')
        $('#action_button').text('Edit')
        $('#action_modal').modal('show')
        $.ajax({
            url: url,
            method: "POST",
            data: { action: 'fetch_single', id: id },
            dataType: "JSON",
            success: function (data) {
                $('#id').val(data.id)
                $('#title_post').val(data.title)
                $('#body_post').val(data.body)
            }
        })
    })

    $(document).on('click', '.delete', function () {
        var id = $(this).data('id')
        if (confirm("Are you sure you want to delete this data?")) {
            $.ajax({
                url: url,
                method: "POST",
                data: { action: 'delete', id: id },
                success: function () {
                    setTimeout(function () {
                        window.location.reload()
                    }, 100)
                }
            })
        }
    })
})