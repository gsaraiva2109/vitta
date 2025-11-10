
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load a shared array of machine data for creation/updates
const machinesData = new SharedArray('Machines', function () {
  return JSON.parse(open('../data/machines.json')).machines;
});

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // simulate ramp-up of traffic from 1 to 10 virtual users
    { duration: '1m', target: 10 },  // stay at 10 virtual users for 1 minute
    { duration: '20s', target: 0 },  // ramp-down to 0 virtual users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000/api';
  let authToken = '';
  let machineId = '';

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

  // 2. Get all machines
  let getAllRes = http.get(`${BASE_URL}/maquinas`, authHeaders);
  check(getAllRes, { 'get all machines status is 200': (r) => r.status === 200 });
  check(getAllRes, { 'response is array': (r) => Array.isArray(r.json()) });
  sleep(1);

  // 3. Create a new machine
  const newMachine = machinesData[0]; // Use first item from shared data
  let createRes = http.post(`${BASE_URL}/maquinas`, JSON.stringify(newMachine), authHeaders);
  check(createRes, { 'create machine status is 201': (r) => r.status === 201 });
  machineId = createRes.json('id');
  check(machineId, { 'machine ID is returned': (id) => id !== null && id !== '' });
  sleep(1);

  // 4. Update the created machine
  const updatedMachine = { ...newMachine, nome: `Updated ${newMachine.nome}` };
  let updateRes = http.put(`${BASE_URL}/maquinas/${machineId}`, JSON.stringify(updatedMachine), authHeaders);
  check(updateRes, { 'update machine status is 200': (r) => r.status === 200 });
  sleep(1);

  // 5. Get the updated machine by ID
  let getByIdRes = http.get(`${BASE_URL}/maquinas/${machineId}`, authHeaders);
  check(getByIdRes, { 'get by id status is 200': (r) => r.status === 200 });
  check(getByIdRes, { 'updated machine name matches': (r) => r.json('nome') === updatedMachine.nome });
  sleep(1);

  // 6. Delete the created machine
  let deleteRes = http.del(`${BASE_URL}/maquinas/${machineId}`, null, authHeaders);
  check(deleteRes, { 'delete machine status is 204': (r) => r.status === 204 });
  sleep(1);
}
