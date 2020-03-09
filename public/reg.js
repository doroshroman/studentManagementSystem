
const regForm = document.getElementById('register');
const regError = document.getElementById('reg-error');
const REG_API_URL = 'http://localhost:3000/reg';


function postData(API_URL, data, errorElement, form){
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
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
            errorElement.textContent = '';
        }
    }).then(() =>{
        form.reset();
        // successfully registered
    }).catch(errorMessage => {
        // show error
        errorElement.textContent = errorMessage;
    });
}

regForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(regForm);
    const name = formData.get('name');
    const surname = formData.get('surname');
    const patronymic = formData.get('patronymic');
    const email = formData.get('email');
    const password = formData.get('password');

    const user = {
        name,
        surname,
        patronymic,
        email,
        password
    };

    postData(REG_API_URL, user, regError, regForm);

});


