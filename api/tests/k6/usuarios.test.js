
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const usersData = new SharedArray('Users', function () {
  return JSON.parse(open('../data/users.json')).users;
});

export let options = {
  stages: [
    { duration: '30s', target: 5 }, // simulate ramp-up of traffic from 1 to 5 virtual users
    { duration: '1m', target: 5 },  // stay at 5 virtual users for 1 minute
    { duration: '20s', target: 0 },  // ramp-down to 0 virtual users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000/api';
  let authToken = '';
  let userId = '';

  // 1. Login to get an auth token
  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    matricula: 'admin',
    senha: 'admin',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, { 'login status is 200': (r) => r.status === 200 });
  authToken = loginRes.json('token');
  check(authToken, { 'auth token is not empty': (token) => token !== null && token !== '' });

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };

  sleep(1);

  // 2. Get all users
  let getAllRes = http.get(`${BASE_URL}/usuarios`, authHeaders);
  check(getAllRes, { 'get all users status is 200': (r) => r.status === 200 });
  check(getAllRes, { 'response is array': (r) => Array.isArray(r.json()) });
  sleep(1);

  // 3. Create a new user
  const newUser = usersData[0]; // Use first item from shared data
  let createRes = http.post(`${BASE_URL}/usuarios`, JSON.stringify(newUser), authHeaders);
  check(createRes, { 'create user status is 201': (r) => r.status === 201 });
  userId = createRes.json('id');
  check(userId, { 'user ID is returned': (id) => id !== null && id !== '' });
  sleep(1);

  // 4. Update the created user
  const updatedUser = { ...newUser, nome: `Updated ${newUser.nome}` };
  let updateRes = http.put(`${BASE_URL}/usuarios/${userId}`, JSON.stringify(updatedUser), authHeaders);
  check(updateRes, { 'update user status is 200': (r) => r.status === 200 });
  sleep(1);

  // 5. Get the updated user by ID
  let getByIdRes = http.get(`${BASE_URL}/usuarios/${userId}`, authHeaders);
  check(getByIdRes, { 'get by id status is 200': (r) => r.status === 200 });
  check(getByIdRes, { 'updated user name matches': (r) => r.json('nome') === updatedUser.nome });
  sleep(1);

  // 6. Delete the created user
  let deleteRes = http.del(`${BASE_URL}/usuarios/${userId}`, null, authHeaders);
  check(deleteRes, { 'delete user status is 204': (r) => r.status === 204 });
  sleep(1);
}
