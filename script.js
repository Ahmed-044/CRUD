const baseUrl = 'https://gorest.co.in/public/v2/users';
const token = '427a3d4713d9066473a37f59c005ae1d8fcdb8fc6ec7559bc61b189d780a52dd';

// Fetch users and display in table
async function getUsers() {
  const response = await fetch(baseUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  displayUsers(data);
}

function displayUsers(users) {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.gender}</td>
      <td>${user.status}</td>
      <td class="actions">
        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.gender}', '${user.status}')">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

// Create or update user
async function saveUser(userData, userId) {
  const method = userId ? 'PUT' : 'POST';
  const url = userId ? `${baseUrl}/${userId}` : baseUrl;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  console.log(`${method === 'POST' ? 'Created' : 'Updated'} User:`, data);
  return data;
}

document.getElementById('userForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const userId = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const gender = document.getElementById('gender').value;
  const status = document.getElementById('status').value;

  const userData = {
    name,
    email,
    gender,
    status
  };

  await saveUser(userData, userId ? parseInt(userId) : null);
  getUsers();
  document.getElementById('userForm').reset();
  document.getElementById('submitButton').textContent = 'Create User';
});

// Delete user
async function deleteUser(userId) {
  const response = await fetch(`${baseUrl}/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 204) {
    console.log('Deleted User:', userId);
    getUsers(); // Refresh the user list
  } else {
    console.error('Failed to Delete User:', response.status);
  }
}

// Edit user
function editUser(id, name, email, gender, status) {
  document.getElementById('userId').value = id;
  document.getElementById('name').value = name;
  document.getElementById('email').value = email;
  document.getElementById('gender').value = gender;
  document.getElementById('status').value = status;
  document.getElementById('submitButton').textContent = 'Update User';
}

// Load users on page load
document.addEventListener('DOMContentLoaded', getUsers);
