fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(response => response.json())
    .then (payload => payload.filter((el) => Number(el.Cur_DateEnd.slice(0,4)) >= 2022))
    .then(payload => ({
        msg: 'cur',
        payload,
       })
    )
    .then(postMessage)
   
   
    
    function getCourse(data){
        fetch(`https://www.nbrb.by/api/exrates/rates/$${data.data.id}?startdate=${data.data.startDate}&enddate=${data.data.endDate}`)
        .then(response => response.json())
        .then(payload => ({
            msg: 'course',
            payload
        }))
        .then(postMessage)
    }