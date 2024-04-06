const deschtimesToken = process.env.deschtimesToken
const url = 'https://script.google.com/macros/s/AKfycbzQh-MnvTR3hRTCJx5Ki0SZZUfpsgg_zJ2RjuQLfAH2R3-QhwFFbILk7_iRebkBPgSw/exec'

const returnData = await fetch(url, {
    method: "POST" 
}).then( data => console.log(data))