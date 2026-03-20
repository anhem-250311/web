// Kiểm tra xem đã có dữ liệu users trong localStorage chưa
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Chuyển đổi giữa form đăng nhập và đăng ký
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
}

// Xử lý đăng ký
const register = document.getElementById('register');
if (register) {
    register.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Lấy danh sách users từ localStorage
        let users = JSON.parse(localStorage.getItem('users'));

        // Kiểm tra username đã tồn tại chưa
        if (users.some(user => user.username === username)) {
            alert('Tên đăng nhập đã tồn tại!');
            return;
        }

        // Thêm user mới
        users.push({
            username: username,
            email: email,
            password: password,
            data: [] // Mảng dữ liệu riêng của user
        });

        // Lưu lại vào localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký thành công! Vui lòng đăng nhập.');

        // Chuyển về form đăng nhập
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';

        // Reset form
        register.reset();
    });
}

// Xử lý đăng nhập
const login = document.getElementById('login');
if (login) {
    login.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Lấy danh sách users
        let users = JSON.parse(localStorage.getItem('users'));

        // Tìm user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Lưu thông tin user đang đăng nhập
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));

            // Chuyển đến dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        }

        // Reset form
        login.reset();
    });
}

// Xử lý dashboard
if (window.location.pathname.includes('dashboard.html')) {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'index.html';
    }

    // Hiển thị thông tin user
    document.getElementById('userDisplay').textContent = currentUser.username;

    // Hiển thị thông tin chi tiết
    const userDetails = document.getElementById('userDetails');
    userDetails.innerHTML = `
    <p><strong>Tên đăng nhập:</strong> ${currentUser.username}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
    `;

    // Lấy dữ liệu của user
    let users = JSON.parse(localStorage.getItem('users'));
    let userIndex = users.findIndex(u => u.username === currentUser.username);

    // Hiển thị dữ liệu đã lưu
    displayUserData(users[userIndex].data);

    // Xử lý lưu dữ liệu
    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userData = document.getElementById('userData').value;

        if (userData.trim()) {
            // Cập nhật users
            users = JSON.parse(localStorage.getItem('users'));
            userIndex = users.findIndex(u => u.username === currentUser.username);

            // Thêm dữ liệu mới
            users[userIndex].data.push({
                id: Date.now(),
                                       content: userData,
                                       timestamp: new Date().toLocaleString()
            });

            // Lưu lại
            localStorage.setItem('users', JSON.stringify(users));

            // Hiển thị lại dữ liệu
            displayUserData(users[userIndex].data);

            // Reset form
            document.getElementById('userData').value = '';
        }
    });

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Hàm hiển thị dữ liệu user
function displayUserData(data) {
    const savedData = document.getElementById('savedData');

    if (data.length === 0) {
        savedData.innerHTML = '<p>Chưa có dữ liệu nào được lưu.</p>';
        return;
    }

    let html = '<h3>Dữ liệu đã lưu:</h3>';
    data.forEach(item => {
        html += `
        <div class="data-item" data-id="${item.id}">
        <div>
        <p><strong>Nội dung:</strong> ${item.content}</p>
        <p><small>${item.timestamp}</small></p>
        </div>
        <button class="delete-btn" onclick="deleteData(${item.id})">Xóa</button>
        </div>
        `;
    });

    savedData.innerHTML = html;
}

// Hàm xóa dữ liệu
function deleteData(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    // Lọc bỏ dữ liệu cần xóa
    users[userIndex].data = users[userIndex].data.filter(item => item.id !== id);

    // Lưu lại
    localStorage.setItem('users', JSON.stringify(users));

    // Hiển thị lại
    displayUserData(users[userIndex].data);
}
