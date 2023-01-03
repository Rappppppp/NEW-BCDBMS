const bgColor = ['rgba(255, 99,  132, 0.2)',
    'rgba(54,  162, 235, 0.2)',
    'rgba(255, 206, 86,  0.2)',
    'rgba(75,  192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64,  0.2)']

const bColor = ['rgba(255, 99,  132, 1)',
    'rgba(54,  162, 235, 1)',
    'rgba(255, 206, 86,  1)',
    'rgba(75,  192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64,  1)']

const link = `${window.location.origin}/admindashboard`

$.ajax({
    url: `${link}/n_households`,
    method: "POST",
    dataType: "JSON",
    success: function (households) {
        const total_households = document.getElementById('n_households')
        var n = []

        function sum(n) { return n.reduce((a, b) => a + b, 0) }

        for (var i in households.data) {
            n.push(households.data[i].household)
        }
        total_households.innerHTML = `${sum(n)}`
    }
})

$.ajax({
    url: `${link}/n_families`,
    method: "POST",
    dataType: "JSON",
    success: function (families) {
        const total_families = document.getElementById('n_families')
        var n = []

        function sum(n) { return n.reduce((a, b) => a + b, 0) }

        for (var i in families.data) {
            n.push(families.data[i].families_household)
        }
        total_families.innerHTML = `${sum(n)}`
    }
})

//* DONE-GENDER
$.ajax({
    url: `${link}/gender`,
    method: "POST",
    dataType: "JSON",
    success: function (gender) {
        var counter = []
        for (var i in gender.data) { counter.push(gender.data[i].gender) }

        var Male = counter.filter(x => x === "Male").length
        var Female = counter.filter(x => x === "Female").length
        var Lesbian = counter.filter(x => x === "Lesbian").length
        var Gay = counter.filter(x => x === "Gay").length
        var Others = counter.filter(x => x === "Others").length

        const chart_gender = document.getElementById('gender')
        new Chart(chart_gender, {
            type: 'doughnut',
            data: {
                labels: ['MALE', 'FEMALE', 'LESBIAN', 'GAY', 'OTHERS'],
                datasets: [{
                    label: '',
                    data: [Male, Female, Lesbian, Gay, Others],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    }
})

//* DONE-AGE
$.ajax({
    url: `${link}/age`,
    method: "POST",
    dataType: "JSON",
    success: function (age) {
        var residents = [], child = [], teen = [], youngAdult = [], adult = [], senior = []
        // child 14 and Below, teen 15-17, youngAdult 15-30, adult 18-59, senior 60 and above
        function a() { return age.data[i] }
        for (var i in age.data) {
            residents.push(a().age)
            a().age > 60 ? senior.push(a().age) : ''
            a().age >= 18 && a().age <= 59 ? adult.push(a().age) : ''
            a().age >= 15 && a().age <= 30 ? youngAdult.push(a().age) : ''
            a().age >= 15 && a().age <= 17 ? teen.push(a().age) : ''
            a().age <= 14 ? child.push(a().age) : ''
        }

        const total_residents = document.getElementById('n_residents')
        total_residents.innerHTML = residents.length

        // AGE
        const chart_age = document.getElementById('ages')
        new Chart(chart_age, {
            type: 'bar',
            data: {
                labels: ['<=14', '15-17', '15-30', '18-59', '>=60'],
                datasets: [{
                    label: '',
                    data: [child.length, teen.length, youngAdult.length, adult.length, senior.length],
                    backgroundColor: [
                        'rgba(255, 99,  132, 0.2)',
                        'rgba(54,  162, 235, 0.2)',
                        'rgba(255, 206, 86,  0.2)',
                        'rgba(75,  192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64,  0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99,  132, 1)',
                        'rgba(54,  162, 235, 1)',
                        'rgba(255, 206, 86,  1)',
                        'rgba(75,  192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64,  1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
})


//* STILL WORKING - SOCIAL SECTOR
$.ajax({
    url: `${link}/social_sector`,
    method: "POST",
    dataType: "JSON",
    success: function (ss) {
        var counter = []
        for (var i in ss.data) { counter.push(ss.data[i].social_sector) }

        var NA = counter.filter(x => x === "NA").length
        var Education = counter.filter(x => x === "Education").length
        var Health = counter.filter(x => x === "Health").length
        var Social_Welfare = counter.filter(x => x === "Social Welfare").length
        var Sports = counter.filter(x => x === "Sports").length

        const chart_ss = document.getElementById('social_sector')
        new Chart(chart_ss, {
            type: 'bar',
            data: {
                labels: ['NA', 'EDUCATION', 'HEALTH', 'SOCIAL WELFARE', 'SPORTS'],
                datasets: [{
                    label: '',
                    data: [NA, Education, Health, Social_Welfare, Sports],
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(245, 245, 245, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(205, 205, 205, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    }
})

//* DONE-CARDS
$.ajax({
    url: `${link}/cards`,
    method: "POST",
    dataType: "JSON",
    success: function (cards) {
        var
            yellow = [],
            blue = [],
            white = [],
            makatizen = [],
            philhealth = []

        function sum(arr) { return arr.reduce((a, b) => a + b, 0) }

        for (var i in cards.data) {
            yellow.push(cards.data[i].yellow)
            blue.push(cards.data[i].blue)
            white.push(cards.data[i].white)
            makatizen.push(cards.data[i].makatizen)
            philhealth.push(cards.data[i].philhealth)
        }

        const chart_cards = document.getElementById('cards')
        new Chart(chart_cards, {
            type: 'bar',
            data: {
                labels: ['Yellow Card', 'Blue Card', 'White Card', 'Makatizen Card', 'Philhealth'],
                datasets: [{
                    label: '',
                    data: [
                        sum(yellow),
                        sum(blue),
                        sum(white),
                        sum(makatizen),
                        sum(philhealth)
                    ],
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(245, 245, 245, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(75, 192, 192, 0.2)'

                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(205, 205, 205, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    }
})

//* DONE-CIVIL STATUS
$.ajax({
    url: `${link}/civil_status`,
    method: "POST",
    dataType: "JSON",
    success: function (civil_status) {
        var counter = []
        for (var i in civil_status.data) { counter.push(civil_status.data[i].civil_status) }

        var single = counter.filter(x => x === "Single").length
        var married = counter.filter(x => x === "Married").length
        var widowed = counter.filter(x => x === "Widowed").length
        var livein = counter.filter(x => x === "Live-in").length
        var separated = counter.filter(x => x === "Separated").length

        const chart_age = document.getElementById('civil_status')
        new Chart(chart_age, {
            type: 'bar',
            data: {
                labels: ['SINGLE', 'MARRIED', 'WIDOWED', 'LIVE-IN', 'SEPARATED'],
                datasets: [{
                    label: '',
                    data: [single, married, widowed, livein, separated],
                    backgroundColor: [
                        'rgba(255, 99,  132, 0.2)',
                        'rgba(54,  162, 235, 0.2)',
                        'rgba(255, 206, 86,  0.2)',
                        'rgba(75,  192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64,  0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99,  132, 1)',
                        'rgba(54,  162, 235, 1)',
                        'rgba(255, 206, 86,  1)',
                        'rgba(75,  192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64,  1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
})

//* DONE-CIVIL STATUS
$.ajax({
    url: `${link}/vaccine`,
    method: "POST",
    dataType: "JSON",
    success: function (vaccine) {
        var counter = []
        for (var i in vaccine.data) {
            counter.push(vaccine.data[i].isVaccinated)
        }

        var fvaccinated = counter.filter(x => x === "Fully Vaccinated").length
        var SD = counter.filter(x => x === "Single Dose").length
        var UV = counter.filter(x => x === "Unvaccinated").length

        //* STILL WORKING-VACCINATED
        const chart_vaccine = document.getElementById('vaccinated')
        new Chart(chart_vaccine, {
            type: 'bar',
            data: {
                labels: ['FULLY VACCINATED', 'SINGLE DOSE', 'UNVACCINATED'],
                datasets: [{
                    label: '',
                    data: [fvaccinated, SD, UV],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    }
})



//* DONE-RELIGION
$.ajax({
    url: `${link}/religion`,
    method: "POST",
    dataType: "JSON",
    success: function (religion) {
        var counter = []
        for (var i in religion.data) {
            counter.push(religion.data[i].religion)
        }

        var catholic = counter.filter(x => x === "Roman Catholic").length

        var INC = counter.filter(x => x === "Iglesia ni Cristo").length

        var muslim = counter.filter(x => x === "Muslim").length

        var bornAgain = counter.filter(x => x === "Born Again").length

        var SDA = counter.filter(x => x === "Seventh Day Adventist").length

        var SNJ = counter.filter(x => x === "Saksi ni Jehovah").length

        var mormons = counter.filter(x => x === "Mormons").length

        var buddhist = counter.filter(x => x === "Buddhist").length

        var others = counter.filter(x => x === "Others").length

        const chart_religion = document.getElementById('religion')
        new Chart(chart_religion, {
            type: 'bar',
            data: {

                labels: ['CATHOLIC', 'IGLESIA NI CRISTO', 'MUSLIM', 'BORN AGAIN', 'SEVENTH DAY ADVENTIST', 'SAKSI NI JEHOVAH', 'MORMONS', 'BUDDHIST', 'OTHERS'],
                datasets: [{
                    label: '',
                    data: [catholic, INC, muslim, bornAgain, SDA, SNJ, mormons, buddhist, others],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    }
})