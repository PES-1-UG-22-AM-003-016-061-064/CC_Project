{/*
  async function fetchData() {
  const token = document.getElementById('tokenInput').value.trim();
  if (!token) {
    alert('Please enter a valid JWT token.');
    return;
  }

  try {
    const res = await fetch('/parent/dashboard/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Raw response:', res);  // Log raw response object

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Non-OK response body:', errorText);  // Log error response text
      throw new Error('Failed to fetch data. Check your token.');
    }

    const data = await res.json();
    console.log('Parsed JSON:', data);  // Log parsed JSON

    document.getElementById('dashboard').classList.remove('hidden');

    // Populate marks
    const marksList = document.getElementById('marksList');
    marksList.innerHTML = '';
    if (Array.isArray(data.marks)) {
      data.marks.forEach(mark => {
        const li = document.createElement('li');
        li.textContent = `${mark.subject} (${mark.exam}): ${mark.score} / ${mark.outOf}`;
        marksList.appendChild(li);
      });
    }

    // Populate attendance
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';
    if (Array.isArray(data.attendance)) {
      data.attendance.forEach(att => {
        const li = document.createElement('li');
        li.textContent = `${new Date(att.date).toLocaleDateString()}: ${att.status}`;
        attendanceList.appendChild(li);
      });
    }

  } catch (err) {
    console.error(err);
    alert('Error fetching data. Check console for more info.');
  }
}
*/}
async function fetchData() {
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    // Step 1: Login and get JWT token
    const loginRes = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
      const errorText = await loginRes.text();
      console.error('Login failed:', errorText);
      throw new Error('Login failed. Please check your credentials.');
    }

    const loginData = await loginRes.json();
    console.log('Login response:', loginData);

    const token = loginData.token;
    if (!token) {
      throw new Error('No token received from login.');
    }

    // Step 2: Use token to fetch student data
    const dashboardRes = await fetch('/parent/dashboard/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!dashboardRes.ok) {
      const errorText = await dashboardRes.text();
      console.error('Dashboard fetch failed:', errorText);
      throw new Error('Failed to fetch dashboard data.');
    }

    const responseData = await dashboardRes.json();
    console.log('Dashboard response:', responseData);

    if (!responseData.success || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No student data found.');
    }

    const student = responseData.data[0];
    const studentInfo = student.studentInfo;

    // Display Student Info
    document.getElementById('studentName').textContent = `Name: ${studentInfo.name}`;
    document.getElementById('studentEmail').textContent = `Email: ${studentInfo.email}`;
    document.getElementById('studentId').textContent = `Student ID: ${student.studentId}`;

    // Display Marks
    const marksList = document.getElementById('marksList');
    marksList.innerHTML = '';
    student.marks.forEach(mark => {
      const li = document.createElement('li');
      li.textContent = `${mark.subject} (${mark.exam}): ${mark.score} / ${mark.outOf}`;
      marksList.appendChild(li);
    });

    // Display Attendance
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';
    student.attendance.forEach(att => {
      const li = document.createElement('li');
      li.textContent = `${new Date(att.date).toLocaleDateString()}: ${att.status}`;
      attendanceList.appendChild(li);
    });

    // Display PTM
    const ptmList = document.getElementById('ptmList');
    ptmList.innerHTML = '';
    student.ptm.forEach(ptm => {
      const li = document.createElement('li');
      const attendanceStatus = ptm.attended ? 'Attended' : 'Missed';
      li.textContent = `${new Date(ptm.date).toLocaleDateString()}: ${ptm.notes} - ${attendanceStatus}`;
      ptmList.appendChild(li);
    });

    // Show dashboard section
    document.getElementById('dashboard').classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert(err.message || 'An error occurred while fetching data.');
  }
}



