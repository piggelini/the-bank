const container = document.querySelector(".account-container");
const submitForm = document.querySelector("form");
const accountName = document.getElementById("name");
const balance = document.getElementById("balance");
let accounts = [];



async function getAccounts() {
    container.innerHTML = "";
    accounts = [];

    const response = await fetch('/api/accounts');
    const data = await response.json();
    console.log(data);
    data.forEach(account => {
        console.log(account);

        let item =
            `
            <li>
                <p>${account.name}</p>
                <p>Account number: ${account._id}</p>
                <p>Balance: ${account.balance}</p>
                <button class="delete-a" data-accountid="${account._id}">Delete account</button>
                <button class="edit-a" data-accountid="${account._id}">Change balance</button>
            </li>
            `
        container.innerHTML += item;
        accounts.push(account);
    });

    let deleteButtons = document.querySelectorAll(".delete-a");
    let editButtons = document.querySelectorAll(".edit-a");

    deleteButtons.forEach(button => {

        button.addEventListener("click", (e) => {
            console.log(button);
            deleteAccount(e);
        })
    })

    editButtons.forEach(button => {

        button.addEventListener("click", (e) => {
            console.log(button);
            editAccount(e);
        })
    })


}


getAccounts();


submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Hej");
    createAccount();

})

async function createAccount() {

    fetch('/api/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({

            name: accountName.value,
            balance: balance.value

        }
        ),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



const deleteAccount = async (e) => {
    await fetch(`/api/accounts/${e.target.dataset.accountid}`, {
        method: 'DELETE'
    });
    getAccounts();
}

const editAccount = async (e) => {
    editPostItem = accounts.find(({ _id }) => _id === e.target.dataset.postid);

    formTitle.value = editPostItem.title;
    formContent.value = editPostItem.content;
    formTags.value = editPostItem.tags.join(',');
}
