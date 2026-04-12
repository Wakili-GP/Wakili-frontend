import axios from 'axios';
axios.post('http://localhost:5174/api/lawyer/onboarding/education', new FormData(), { validateStatus: () => true }).then(r => console.log(r.status, r.data)).catch(e => console.error(e.message));
