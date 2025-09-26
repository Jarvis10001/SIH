const jwt = require('jsonwebtoken');

// Decode the JWT token without verification to see its contents
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2M3MmE5M2UxNDNiNTA1Y2MyMDRjZSIsInN0dWRlbnRJZCI6IlNUVTAyMSIsImVtYWlsIjoicmFqdUBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInllYXIiOjMsImJyYW5jaCI6IkNvbXB1dGVyIFNjaWVuY2UgRW5naW5lZXJpbmciLCJpYXQiOjE3NTgyMjk0NzEsImV4cCI6MTc1ODgzNDI3MSwiYXVkIjoic2loLWZyb250ZW5kIiwiaXNzIjoic2loLWJhY2tlbmQifQ.5eJxjNqitYo3nlWLzSm2Lh7NP2AiosdhbblaILRHyxI";

const decoded = jwt.decode(token);
console.log('JWT Token Contents:');
console.log(JSON.stringify(decoded, null, 2));