// const { head } = require("../../routes/Admin/posts")
GenerateID = () => {
    fn = $('#first_name').val().charAt(0).toUpperCase()
    ln = $('#last_name').val().charAt(0).toUpperCase()
    randomNum = Math.floor(Math.random() * 1000)
    randomDate = Date.now().toString().slice(5, 10)
    $('#id').val(`${fn}${ln}${randomNum}${randomDate}`)
}

Capitalize = () => {
    STRING_inputs = document.getElementsByClassName('cap')
    for (i = 0; i < STRING_inputs.length; i++) {

        arr = STRING_inputs[i].value.split(" ")

        for (j = 0; j < arr.length; j++) {
            arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1);
        }
        capitalized = arr.join(" ")
        STRING_inputs[i].value = capitalized
    }
}

Datepicker = () => {
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1920:',
        onSelect: function (dateText, inst) {
            var dob = $(this).datepicker('getDate')

            var d = new Date(dob);
            var today = new Date()

            var birthDate =
                d.getFullYear() + "-" +
                ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("0" + d.getDate()).slice(-2);

            var age = today.getFullYear() - dob.getFullYear()

            if (age != undefined) {
                GetYearsOfStay(age)
                document.getElementById("inputYearsofStay").disabled = false
                document.getElementById("inputYearsinBrgy").disabled = false
                document.getElementById("inputYearsinCurrent").disabled = false
            }

            $('#age').val(age)

            $("#datepicker").val(birthDate)
        }
    })
}
Datepicker()

// Length of Stay of both Cembo and Current is dependent to Makati
GetYearsOfStay = (age) => {
    len_makati = document.getElementById("inputYearsofStay")
    len_cembo = document.getElementById("inputYearsinBrgy")
    len_curr = document.getElementById("inputYearsinCurrent")

    function years_stay(len_stay, len_stay_next) {
        if (len_makati.value == "") {
            for (i = 1; i <= age; i++) {
                len_makati.options[i] = new Option(i, i)
            }
        }

        if (typeof len_stay_next === 'undefined') {
            len_stay.addEventListener('change', (e) => {
            })
        }
        else {
            len_stay.addEventListener('change', (e) => {
                for (i = 1; i <= len_stay.value; i++) {
                    len_stay_next.options[i] = new Option(i, i)
                }
            })
        }
    }
    years_stay(len_makati, len_cembo)
    years_stay(len_cembo, len_curr)
    years_stay(len_curr)
}

HouseholdDropdown = () => {
    household = document.getElementById("inputNoofHousehold")
    fam_household = document.getElementById
        ("inputNoofFamilies")
    fam_members = document.getElementById
        ("inputNoofFamilyMembers")

    function dropdown_val(dropdown, val) {
        for (var i = 0; i <= val; i++) {
            dropdown.options[i] = new Option(i, i)
        }
    }

    $('#isHead').click(function () {
        if (document.getElementById(this.id).checked) {

            dropdown_val(household, 100)
            dropdown_val(fam_household, 20)
            dropdown_val(fam_members, 100)
        }
        else {
            $(".household_info").hide()
            dropdown_val(household, 0)
            dropdown_val(fam_household, 0)
            dropdown_val(fam_members, 0)
        }
    })
}
HouseholdDropdown()

Checkboxes = () => {
    isVoter = document.getElementById("isVoter")
    isHead = document.getElementById("isHead")
    checkboxes = [
        yellow = document.getElementById("yellow"),
        blue = document.getElementById("blue"),
        white = document.getElementById("white"),
        makatizen = document.getElementById("makatizen"),
        philhealth = document.getElementById("philhealth")
    ]

    function isChecked(box) {
        box.addEventListener('change', (e) => {
            box.checked ? box.value = 1 : box.value = 0
        })
    }
    for (i in checkboxes) isChecked(checkboxes[i])

    isChecked(isVoter)
    isChecked(isHead)

    isHead.addEventListener('change', (e) => {
        isHead.checked ? $(".household_info").show() : $(".household_info").hide()
    })
}
Checkboxes()

setDefault = () => {
    $(".household_info").hide()
    $("#isVoter").val(0)
    household.options[0] = new Option(0, 0)
    fam_household.options[0] = new Option(0, 0)
    fam_members.options[0] = new Option(0, 0)
    document.getElementById("isVoter").value = 0
    document.getElementById("inputYearsofStay").disabled = true
    document.getElementById("inputYearsinBrgy").disabled = true
    document.getElementById("inputYearsinCurrent").disabled = true
}
setDefault()

Income = () => {
    income = document.getElementById('inputMonthly').value
    expenses = document.getElementById('inputExpenses').value
    netIncome = document.getElementById('inputNetIncome')
    means = document.getElementById('mean_income').value = income + (income - expenses)
    if (netIncome < 0) netIncome.value = 0
}
