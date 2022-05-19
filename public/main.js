const container = document.querySelector(".content-container");





async function getAccounts() {

    const response = await fetch('/api/accounts');
    const data = await response.json();
    console.log(data);
    data.forEach(account => {
        console.log(account);

        let item =
            `
            <li>
                <p>${account._id}</p>
                <p>${account.name}</p>
                <p>${account.balance}</p>
            </li>
            `
        container.innerHTML += item;
    });
}


fetchAccounts();

async function createAccount() {

    fetch('https://example.com/profile', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}