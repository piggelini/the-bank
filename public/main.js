const container = document.querySelector(".account-container");
const submitForm = document.querySelector(".create-form");
const accountName = document.getElementById("name");
const createBalance = document.getElementById("balance");
const contentContainer = document.querySelector(".content-container")
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
            getAccount(e);
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
            balance: createBalance.value

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

const editMode = (account) => {


    console.log(account);
    submitForm.classList.add("create-form-hide");
    container.classList.add("account-container-hide");

    let editForm =
        `
    <form class="create-form">
    <h2>Edit account balance</h2>
    <label for="name">Account name</label>
    <input type="text" name="name" id="name" value = ${account.name} disabled>
    <label for="balance">Account balance</label>
    <input type="balance" name="balance" id="edit-balance" value = ${account.balance}>
    <button type="submit" class="save-btn">Save edit</button>
</form>
    `
    contentContainer.innerHTML = editForm;

    let saveEditBtn = document.querySelector(".save-btn");

    saveEditBtn.addEventListener("click", (e) => {
        editAccount(account._id);
    })

    const editAccount = async (id) => {

        let balance = document.getElementById("edit-balance");

        fetch(`/api/accounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

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


}

function getAccount(e) {

    accounts.forEach((account) => {
        console.log(account._id);
        if (account._id == e.target.dataset.accountid) {
            console.log(account);
            editMode(account);
        }

    })

}



