const chooseVal = document.querySelector('.chooseVal');

const btn1week = document.querySelector('.btn1');
const btn2month = document.querySelector('.btn2');
const btn3quarter = document.querySelector('.btn3');
const btn4year = document.querySelector('.btn4');
const fromDate = document.querySelector('.fromDate');
const toDate = document.querySelector('.toDate');
const dmChart = document.getElementById('curChart');


const today = dayjs().format('YYYY-MM-DD');

const worker = new Worker('/js/worker.js');
worker.addEventListener('message', ({data}) => {
      mapping[data.msg](data.payload);    
  });

  let allValues;
  
  const mapping = {
      cur: (payload) => {
        allValues = payload;
        createSelect(allValues);

      }
  }
  

function createSelect(x){     
        x.forEach(el => {
            const option = document.createElement('option');
            option.innerText = el.Cur_Name;
            option.value = el.Cur_ID;
            chooseVal.append(option);
        })
}


/*-------*/
btn1week.addEventListener('click', () => period4btns(-1, `week`));
btn2month.addEventListener('click', () => period4btns(-1, `month`))
btn3quarter.addEventListener('click', () => period4btns(-3, `month`))
btn4year.addEventListener('click', () => period4btns(-1, `year`))

chooseVal.addEventListener('change', deleteTable)
   
fromDate.addEventListener('change', Inp)
toDate.addEventListener('change', Inp)
/*-------*/   
   
   
function Inp() {
    if(fromDate.value && toDate.value) {
           fromTo(chooseVal.value, fromDate.value, toDate.value)
    }
}

function period4btns(a, b) {
    const underneeddate = dayjs().add(a, b).format('YYYY-MM-DD')
    fromTo(chooseVal.value, underneeddate, today)
}
//--------------------------------------------------
function deleteTable() {
    const tr = document.querySelectorAll('td');
    tr.forEach(el => el.remove('tr'))
}


chooseVal.addEventListener('change', () => {
    deleteTable()
    getCur(allValues);
  })



  
function getCur(allValues) {
    deleteTable()
    const el = allValues.filter((el) => {
          return el.Cur_ID == chooseVal.value
          })[0];
    fromDate.min = el.Cur_DateStart.slice(0,10)
    fromDate.max = el.Cur_DateEnd.slice(0,10)
    toDate.min = el.Cur_DateStart.slice(0,10)
    toDate.max = el.Cur_DateEnd.slice(0,10)
    count = el.Cur_QuotName
    fromTo(el.Cur_ID, el.Cur_DateStart, el.Cur_DateEnd)
}

let allCurs 
const worker2 = new Worker('/js/worker2.js')

function fromTo(idCur, start, end) {
    deleteTable()
    worker2.postMessage({
         id: idCur,
         dataStart: start,
         dataEnd: end,
    });
}

worker2.addEventListener('message', ({data}) => {
    Worker4chart({data}.data)
})


function createTable (col1, col2) {

    const tab = document.querySelector('.table');
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerText = col1;
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    td2.innerText = col2;
    tr.appendChild(td2);

    table.appendChild(tr);
    tab.appendChild(table);
}



function Worker4chart(el) {
    let dinamics = el;

    dinamics.forEach((json) => {
            createTable(`${json.Date.slice(0,10)}`, ` ${count} ` + ` ${json.Cur_OfficialRate} ` + `BYN`)
            })
    allCurs = [];
    dinamics.forEach(el => allCurs.push([new Date(el.Date), el.Cur_OfficialRate]))

    createGraph()
}

  
  // --------------------------------------------------------------------
function createGraph() {
    dmChart.innerHTML = '';
      google.charts.load('current', {packages: ['corechart', 'line']});
      google.charts.setOnLoadCallback(drawBasic);
      function drawBasic() {
          let data = new google.visualization.DataTable();
  
          data.addColumn('datetime', 'X');
          data.addColumn('number', 'Rate');
  
          data.addRows(allCurs);
          let options = {
            hAxis: {
                  title: 'Дата',
              },
              vAxis: {
                  title: 'Курс'
              },
              width: 1000,
              height: 560,
              chartArea: {
                  top: 50,
                  width: 800,
                  height: 400
              },
              
              };
      
          let chart = new google.visualization.LineChart(dmChart);
          chart.draw(data, options);
      }
}