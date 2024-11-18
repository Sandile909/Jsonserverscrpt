const apiUrl = 'http://localhost:3000';

function register() {
  const username = document.get

ElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => alert(data.message || data.error))
  .catch(error => console.error('Error:', error));
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('data-container').style.display = 'block';
    } else {
      alert(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

function addData() {
  const data = document.getElementById('data-input').value;

  fetch(`${apiUrl}/add-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item: data })
  })
  .then(response => response.json())
  .then(data => alert(data.message || data.error))
  .catch(error => console.error('Error:', error));
}

function getData() {
  fetch(`${apiUrl}/get-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('data-display').innerHTML = JSON.stringify(data.data, null, 2);
  })
  .catch(error => console.error('Error:', error));
}

function clearData() {
  fetch(`${apiUrl}/clear-data`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => alert(data.message || data.error))
  .catch(error => console.error('Error:', error));
}