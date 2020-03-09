
const form = document.querySelector('form');
const error = document.getElementById('error');
const API_URL = 'http://localhost:3000/users';

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const surname = formData.get('surname');
    const patronymic = formData.get('patronymic');
    const email = formData.get('email');
    const password = formData.get('password');

    // Here need to add if the same user is registered!!!
    
    const user = {
        name,
        surname,
        patronymic,
        email,
        password
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'content-type': 'application/json'
        }
    };
    fetch(API_URL, options).then(response => {
        if(!response.ok){
            const contentType = response.headers.get('content-type');
            if(contentType.includes('json')){
                return response.json().then(error => Promise.reject(error.message));
            }else{
                return response.text().then(message => Promise.reject(message));
            }
        }else{
            error.textContent = '';
        }
    }).then(() =>{
        form.reset();
        // successfully registered
    }).catch(errorMessage => {
        // show error
        error.textContent = errorMessage;
    });
    

});