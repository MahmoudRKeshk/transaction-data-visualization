import { fillTableWithData, getSortedData, hideDetails, showDetails } from "./utils.mjs";
let close_details = document.getElementById('close_details');
let client_name = document.getElementById('client_name');
  
close_details.addEventListener('click', ()=>{
  hideDetails();
})

let transactions = await getSortedData().then(data =>{
  fillTableWithData(data);
  return data;
})


let balanceChart ;
let amountChart ;
function renderDetailsCharts(id){

  // Getting all data related to a specific user
  let client_transactions = transactions.filter(transaction =>{
    return transaction.client_id == id
  })

  // Extracting the name of the client and displaying it 
  const name = client_transactions[0].client_name;
  client_name.innerText = name;
  
  
  // getting the data needed for the firsr chart : [Array] of {month , balance}
  const MonthsNames = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec']; 
    const balance_data = client_transactions.map(transaction =>{
      return {
        month : MonthsNames[new Date(transaction.date_time).getMonth()] ,
        balance : parseInt(transaction.balance)
      }
    })

    // getting the data needed for the second chart : [Array] of {month , amount}
    const amount_data = client_transactions.map(transaction =>{
      return {
        month : MonthsNames[new Date(transaction.date_time).getMonth()] ,
        amount : parseInt(transaction.amount)
        
      }
    })

    /* 
      Creating the charts & setting the X - Y axis values and chosing the type of the chart
    */
    balanceChart = new Chart(
      document.getElementById('balance'),
      {
        type: 'line',
        data: {
          labels: balance_data.map(row => row.month),
          datasets: [
            {
              label: 'client balance per month [2023]',
              data: balance_data.map(row => row.balance)
            }
          ]
        }
      }
    );

    amountChart = new Chart(
      document.getElementById('amount'),
      {
        type: 'bar',
        data: {
          labels: amount_data.map(row => row.month),
          datasets: [
            {
              label: 'net transactions amount per month',
              data: amount_data.map(row => row.amount)
            }
          ]
        }
      }
    );

    // After rendering the charts => show the section of the details as it is hiden by deafult
    showDetails();
}


// Rendering the charts on clicking on the client name
let anchors = document.getElementsByTagName('a');
for (let a of anchors){
  a.addEventListener('click', ()=>{
    if (balanceChart || amountChart) {
      balanceChart.destroy();
      amountChart.destroy();
      // console.log('Chart destroyed');
    }
    renderDetailsCharts(a.dataset.id)
  })
}

// rendering charts functionality needs to be added with every pagination 
$('#transactions_table').on('draw.dt', function() {
  let anchors = document.getElementsByTagName('a');
  for (let a of anchors){
  a.addEventListener('click', ()=>{
    if (balanceChart || amountChart) {
      balanceChart.destroy();
      amountChart.destroy();
      // console.log('Chart destroyed');
    }
    renderDetailsCharts(a.dataset.id)
  })
}
})