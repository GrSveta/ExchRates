const val = document.querySelector('.val');

const tbody = document.createElement('tbody')
tbody.classList.add('dyn');
        function courseNow(id){
            fetch(`https://www.nbrb.by/api/exrates/rates/${id}`)
            .then((response) => response.json())
            .then((data) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${data.Cur_Scale} ${data.Cur_Abbreviation}</td>
                        <td>${data.Cur_OfficialRate}</td>`
                    tbody.append(tr)
                }
            )
        }
        courseNow(431)
        courseNow(451)
        courseNow(456)
        val.append(tbody)
        table.setAttribute('tabliza')
        let style = document.createElement('style');
        style.innerText =`.tabliza`
        table.append(style);
        