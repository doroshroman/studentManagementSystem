const signForm = document.getElementById('sign-in');
const signError = document.getElementById('sign-error');
const AUTH_API_URL = 'http://localhost:3000/sign';


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
        
    }).catch(errorMessage => {
        // show error
        errorElement.textContent = errorMessage;
    });
}

signForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    const formData = new FormData(signForm);
    const email = formData.get('email');
    const password = formData.get('password');

    const auth = {
        email,
        password
    };
    postData(AUTH_API_URL, auth, signError, signForm);
});
