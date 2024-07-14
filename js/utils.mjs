async function getData(){
  let responseText = await fetch("../assets/data/transactions.json");
  let data = await responseText.json();
  return data.transactions;
};

export async function getSortedData(){
  let data = await getData();
  let sortedData = data.sort((a,b) => {
    return new Date(a.date_time).getTime() -  new Date(b.date_time).getTime();
  })
  return sortedData
}

export function fillTableWithData(transactions){
  let transaction_table = document.getElementById("transactions_table");
  let transaction_table_body = document.getElementById("transactions_table_body");
  let tbody = ``;
  for (let transaction of transactions){
    tbody += `
      <tr >
        <td class="text-center">${transaction.date_time}</td>
        <td class="text-center">${transaction.client_id}</td>
        <td class="text-center text-primary text-decoration-underline pointer"><a data-id='${transaction.client_id}'>${transaction.client_name}</a></td>
        <td class="text-center ${parseInt(transaction.amount) < 0 ? 'text-danger' : 'text-success'}">${transaction.amount}</td>
        <td class="text-center fw-bold ${parseInt(transaction.balance) < 0 ? 'text-danger' : 'text-primary'}">${transaction.balance}</td>
      </tr>
    `
  }
  transaction_table_body.innerHTML = tbody;
  transaction_table.classList.remove('d-none');
  let table = new DataTable('#transactions_table', {
    ordering : false ,
  });

  document.getElementsByClassName('dt-layout-row')[0].classList.add('d-none');

  /* Adding custom filter searches */
  $('input[data-search="name_search_column"]').on('keyup', function () {
    table
        .columns(2)
        .search(this.value)
        .draw();
});
}

export function hideDetails(){
  let details_section = document.getElementById('details_section');
  let data_section = document.getElementById('data_section');
  
  details_section.classList.add('d-none');
  data_section.classList.toggle('w-65 w-100');
}

export function showDetails(){
  let details_section = document.getElementById('details_section');
  details_section.classList.remove('d-none'); 
}