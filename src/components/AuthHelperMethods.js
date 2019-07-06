import backendApi from '../apis/backendApi';

export default class AuthHelperMethods {    
    
    // User registration

    register = async (username, email, password) => {
        
        // Get a token from api server using the post api
        const data = "name="+username+"&email="+email+"&password="+password;
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const res = await backendApi.post(`/customers`,data, config).then(response => {
            return response.data;
          }).catch(error => {
            return error;
          });
        
        return Promise.resolve(res);      
    }

    // User authentication

    login = async (email, password) => {
        
        // Get a token from api server using the post api
        const data = "email="+email+"&password="+password;
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const response = await backendApi.post(`/customers/login`,data, config).then(response => {
            return response.data;
          }).catch(error => {
            return error;
          });
        
        return Promise.resolve(response);      
    }

    loggedIn = () => {
        const token = this.getToken() // Getting token from localstorage
        console.log('Token from local storage', token);
        return !!token  // handwaiving here , can check for Token expiry
    }

    // Storing tokens
    
    setToken = (idToken) => {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
        console.log('Token set in local Storage');
    }

    getToken = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        console.log('Token removed from local Storage');
    }

    
    fetch = (url, options) => {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus = (response) => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

}