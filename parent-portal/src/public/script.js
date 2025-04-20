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

    const responseData = await res.json();
    console.log('Parsed JSON:', responseData);  // Log parsed JSON

    // Ensure response data is in expected format
    if (!responseData.success || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No data found.');
    }

    const student = responseData.data[0];  // Extract the first (and only) student data
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
    alert('Error fetching data. Check console for more info.');
  }
}



