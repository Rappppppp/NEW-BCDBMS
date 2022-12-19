
// GETS BIRTHDAY AND AGE
$("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: '1920:',
    onSelect: function(dateText, inst) { 
    var dob = $(this).datepicker('getDate')

    var d = new Date(dob);
    var today = new Date()

    var birthDate =
    d.getFullYear() + "-" +
    ("0" + (d.getMonth() + 1)).slice(-2)+ "-" +
    ("0" + d.getDate()).slice(-2); 

    var age = today.getFullYear() - dob.getFullYear()
    
    $('#age').val(age)
    $("#datepicker").val(birthDate)
    }
})

function capitalizeWords(arr) {
        return arr.map(element => {
            return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
        });
    }
