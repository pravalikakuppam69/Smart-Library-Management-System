const logoutBtn = document.getElementById("logoutBtn");
const adminName = document.getElementById("adminName");

if (adminName) {
    adminName.textContent = localStorage.getItem("libraryAdmin") || "Admin";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("libraryLoggedIn");
        localStorage.removeItem("libraryAdmin");
        window.location.href = "login.html";
    });
}

const themeToggle = document.getElementById("themeToggle");

let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let members = JSON.parse(localStorage.getItem("libraryMembers")) || [];
let transactions = JSON.parse(localStorage.getItem("libraryTransactions")) || [];

const FINE_PER_DAY = 5;

const DEFAULT_BOOKS = [
    { id: "b1", title: "Clean Code", author: "Robert C. Martin", category: "Programming", isbn: "9780132350884", status: "Available", addedDate: "01/07/2026" },
    { id: "b2", title: "The Pragmatic Programmer", author: "Andrew Hunt & David Thomas", category: "Programming", isbn: "9780135957059", status: "Available", addedDate: "01/07/2026" },
    { id: "b3", title: "Database System Concepts", author: "Silberschatz, Korth & Sudarshan", category: "Database", isbn: "9780078022159", status: "Available", addedDate: "03/07/2026" },
    { id: "b4", title: "SQL Performance Explained", author: "Markus Winand", category: "Database", isbn: "9783950307829", status: "Available", addedDate: "03/07/2026" },
    { id: "b5", title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross", category: "Networking", isbn: "9780133594140", status: "Issued", addedDate: "05/07/2026" },
    { id: "b6", title: "TCP/IP Illustrated, Volume 1", author: "W. Richard Stevens", category: "Networking", isbn: "9780201633467", status: "Available", addedDate: "05/07/2026" },
    { id: "b7", title: "Hands-On Machine Learning", author: "Aurelien Geron", category: "AI & ML", isbn: "9781492032649", status: "Issued", addedDate: "10/07/2026" },
    { id: "b8", title: "Deep Learning", author: "Goodfellow, Bengio & Courville", category: "AI & ML", isbn: "9780262035613", status: "Available", addedDate: "10/07/2026" },
    { id: "b9", title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Web Development", isbn: "9781593279509", status: "Available", addedDate: "15/07/2026" },
    { id: "b10", title: "You Don't Know JS Yet", author: "Kyle Simpson", category: "Web Development", isbn: "9781091210099", status: "Available", addedDate: "15/07/2026" },
    { id: "b11", title: "Atomic Habits", author: "James Clear", category: "General", isbn: "9780735211292", status: "Available", addedDate: "20/07/2026" },
    { id: "b12", title: "Sapiens", author: "Yuval Noah Harari", category: "General", isbn: "9780062316097", status: "Available", addedDate: "20/07/2026" }
];

const DEFAULT_MEMBERS = [
    { id: "m1", name: "Ananya Rao", email: "ananya.rao@example.com", phone: "9876543210", joinDate: "01/01/2026" },
    { id: "m2", name: "Rahul Verma", email: "rahul.verma@example.com", phone: "9876500001", joinDate: "15/02/2026" },
    { id: "m3", name: "Priya Sharma", email: "priya.sharma@example.com", phone: "9876500002", joinDate: "03/03/2026" },
    { id: "m4", name: "Arjun Mehta", email: "arjun.mehta@example.com", phone: "9876500003", joinDate: "20/04/2026" },
    { id: "m5", name: "Sneha Iyer", email: "sneha.iyer@example.com", phone: "9876500004", joinDate: "11/06/2026" },
    { id: "m6", name: "Karthik Nair", email: "karthik.nair@example.com", phone: "9876500005", joinDate: "05/08/2026" }
];

const DEFAULT_TRANSACTIONS = [
    { id: "t1", bookId: "b1", memberId: "m1", issueDate: "01/09/2026", dueDate: "15/09/2026", returnDate: "10/09/2026", fine: 0, status: "Returned" },
    { id: "t2", bookId: "b3", memberId: "m2", issueDate: "20/08/2026", dueDate: "03/09/2026", returnDate: "12/09/2026", fine: 45, status: "Returned" },
    { id: "t3", bookId: "b5", memberId: "m3", issueDate: "01/09/2026", dueDate: "08/09/2026", returnDate: "", fine: 0, status: "Issued" },
    { id: "t4", bookId: "b7", memberId: "m4", issueDate: "20/09/2026", dueDate: "20/10/2026", returnDate: "", fine: 0, status: "Issued" },
    { id: "t5", bookId: "b9", memberId: "m5", issueDate: "05/09/2026", dueDate: "19/09/2026", returnDate: "18/09/2026", fine: 0, status: "Returned" },
    { id: "t6", bookId: "b11", memberId: "m6", issueDate: "10/08/2026", dueDate: "24/08/2026", returnDate: "02/09/2026", fine: 45, status: "Returned" }
];

function seedDemoData() {
    const alreadySeeded = localStorage.getItem("libraryDataSeeded") === "true";
    const hasAnyData =
        books.length > 0 || members.length > 0 || transactions.length > 0;

    if (alreadySeeded || hasAnyData) {
        return;
    }

    books = DEFAULT_BOOKS.map(book => ({ ...book }));
    members = DEFAULT_MEMBERS.map(member => ({ ...member }));
    transactions = DEFAULT_TRANSACTIONS.map(transaction => ({ ...transaction }));

    localStorage.setItem("libraryDataSeeded", "true");
    saveData();
}

seedDemoData();

const bookModal = document.getElementById("bookModal");
const memberModal = document.getElementById("memberModal");
const issueModal = document.getElementById("issueModal");
const returnModal = document.getElementById("returnModal");
const fineModal = document.getElementById("fineModal");

const bookForm = document.getElementById("bookForm");
const memberForm = document.getElementById("memberForm");
const issueForm = document.getElementById("issueForm");
const returnForm = document.getElementById("returnForm");

const addBookBtn = document.getElementById("addBookBtn");
const addMemberBtn = document.getElementById("addMemberBtn");
const issueBookBtn = document.getElementById("issueBookBtn");
const returnBookBtn = document.getElementById("returnBookBtn");
const fineBtn = document.getElementById("fineBtn");

const closeBookModal = document.getElementById("closeBookModal");
const closeMemberModal = document.getElementById("closeMemberModal");
const closeIssueModal = document.getElementById("closeIssueModal");
const closeReturnModal = document.getElementById("closeReturnModal");
const closeFineModal = document.getElementById("closeFineModal");

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookCategory = document.getElementById("bookCategory");
const bookISBN = document.getElementById("bookISBN");

const memberName = document.getElementById("memberName");
const memberEmail = document.getElementById("memberEmail");
const memberPhone = document.getElementById("memberPhone");

const issueBookSelect = document.getElementById("issueBookSelect");
const issueMemberSelect = document.getElementById("issueMemberSelect");
const issueDays = document.getElementById("issueDays");

const returnTransactionSelect = document.getElementById("returnTransactionSelect");

const searchBook = document.getElementById("searchBook");
const categoryFilter = document.getElementById("categoryFilter");

const bookTableBody = document.getElementById("bookTableBody");
const memberTableBody = document.getElementById("memberTableBody");
const transactionTableBody = document.getElementById("transactionTableBody");

const noMembersMessage = document.getElementById("noMembersMessage");

const totalBooks = document.getElementById("totalBooks");
const availableBooks = document.getElementById("availableBooks");
const issuedBooks = document.getElementById("issuedBooks");
const totalMembers = document.getElementById("totalMembers");

const heroTotalBooks = document.getElementById("heroTotalBooks");
const heroAvailableBooks = document.getElementById("heroAvailableBooks");
const heroMembers = document.getElementById("heroMembers");

const totalFineAmount = document.getElementById("totalFineAmount");
const fineRecords = document.getElementById("fineRecords");
const overdueBooks = document.getElementById("overdueBooks");

const categoryChart = document.getElementById("categoryChart");
const popularBooks = document.getElementById("popularBooks");
const recentActivity = document.getElementById("recentActivity");

function saveData() {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
    localStorage.setItem("libraryMembers", JSON.stringify(members));
    localStorage.setItem("libraryTransactions", JSON.stringify(transactions));
}

function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function parseDate(dateString) {
    const parts = dateString.split("/");

    if (parts.length !== 3) {
        return null;
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    return new Date(year, month, day);
}

function isOverdue(transaction) {
    if (!transaction || transaction.status !== "Issued") {
        return false;
    }

    const dueDate = parseDate(transaction.dueDate);

    if (!dueDate) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}

function calculateFine(transaction) {
    if (!transaction || !transaction.dueDate) {
        return 0;
    }

    const dueDate = parseDate(transaction.dueDate);

    if (!dueDate) {
        return 0;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const difference = today - dueDate;

    if (difference <= 0) {
        return 0;
    }

    return Math.floor(difference / (1000 * 60 * 60 * 24)) * FINE_PER_DAY;
}

const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(element, endValue, options = {}) {
    if (!element) {
        return;
    }

    const prefix = options.prefix || "";
    const suffix = options.suffix || "";
    const duration = options.duration || 600;
    const startValue = Number(element.dataset.rawValue || 0);

    if (prefersReducedMotion || startValue === endValue) {
        element.textContent = `${prefix}${endValue}${suffix}`;
        element.dataset.rawValue = endValue;
        return;
    }

    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(
            startValue + (endValue - startValue) * eased
        );

        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            element.dataset.rawValue = endValue;
        }
    }

    requestAnimationFrame(tick);
}

function updateDashboard() {
    const total = books.length;
    const available = books.filter(book => book.status === "Available").length;
    const issued = books.filter(book => book.status === "Issued").length;
    const memberCount = members.length;

    animateCount(totalBooks, total);
    animateCount(availableBooks, available);
    animateCount(issuedBooks, issued);
    animateCount(totalMembers, memberCount);
    animateCount(heroTotalBooks, total);
    animateCount(heroAvailableBooks, available);
    animateCount(heroMembers, memberCount);

    updateAnalytics();
}

function renderBooks(filteredBooks = books) {
    if (!bookTableBody) {
        return;
    }

    bookTableBody.innerHTML = "";

    if (filteredBooks.length === 0) {
        bookTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No books found
                </td>
            </tr>
        `;
        return;
    }

    filteredBooks.forEach((book, index) => {
        const row = document.createElement("tr");
        row.style.setProperty("--i", index);

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(book.title)}</strong>
            </td>
            <td>${escapeHTML(book.author)}</td>
            <td>${escapeHTML(book.category)}</td>
            <td>${escapeHTML(book.isbn)}</td>
            <td>
                <span class="status-badge ${book.status === "Available" ? "available" : "issued"}">
                    ${escapeHTML(book.status)}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="editBook('${book.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>
                </div>
            </td>
        `;

        bookTableBody.appendChild(row);
    });
}

function renderMembers() {
    if (!memberTableBody) {
        return;
    }

    memberTableBody.innerHTML = "";

    if (members.length === 0) {
        if (noMembersMessage) {
            noMembersMessage.style.display = "block";
        }
        return;
    }

    if (noMembersMessage) {
        noMembersMessage.style.display = "none";
    }

    members.forEach((member, index) => {
        const issuedCount = transactions.filter(
            transaction =>
                transaction.memberId === member.id &&
                transaction.status === "Issued"
        ).length;

        const row = document.createElement("tr");
        row.style.setProperty("--i", index);

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(member.name)}</strong>
            </td>
            <td>${escapeHTML(member.email)}</td>
            <td>${escapeHTML(member.phone)}</td>
            <td>${issuedCount}</td>
            <td>${escapeHTML(member.joinDate || "-")}</td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="editMember('${member.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteMember('${member.id}')">Delete</button>
                </div>
            </td>
        `;

        memberTableBody.appendChild(row);
    });
}

function renderTransactions() {
    if (!transactionTableBody) {
        return;
    }

    transactionTableBody.innerHTML = "";

    if (transactions.length === 0) {
        transactionTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No transactions found
                </td>
            </tr>
        `;
        return;
    }

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction, index) => {
        const book = books.find(item => item.id === transaction.bookId);
        const member = members.find(item => item.id === transaction.memberId);

        const currentFine =
            transaction.status === "Issued"
                ? calculateFine(transaction)
                : Number(transaction.fine || 0);

        const row = document.createElement("tr");
        row.style.setProperty("--i", index);

        row.innerHTML = `
            <td>${escapeHTML(book ? book.title : "Deleted Book")}</td>
            <td>${escapeHTML(member ? member.name : "Deleted Member")}</td>
            <td>${escapeHTML(transaction.issueDate)}</td>
            <td>${escapeHTML(transaction.dueDate)}</td>
            <td>${escapeHTML(transaction.returnDate || "-")}</td>
            <td>₹${currentFine}</td>
            <td>
                <span class="status-badge ${
                    transaction.status === "Issued" ? "issued" : "returned"
                }">
                    ${escapeHTML(transaction.status)}
                </span>
            </td>
            <td>
                ${
                    transaction.status === "Issued"
                        ? `<button class="return-action-btn" onclick="openReturnForTransaction('${transaction.id}')">Return</button>`
                        : `<span class="completed-label">Completed</span>`
                }
            </td>
        `;

        transactionTableBody.appendChild(row);
    });
}

function populateIssueForm() {
    if (!issueBookSelect || !issueMemberSelect) {
        return;
    }

    issueBookSelect.innerHTML = `<option value="">Select Book</option>`;

    books
        .filter(book => book.status === "Available")
        .forEach(book => {
            const option = document.createElement("option");
            option.value = book.id;
            option.textContent = `${book.title} - ${book.author}`;
            issueBookSelect.appendChild(option);
        });

    issueMemberSelect.innerHTML = `<option value="">Select Member</option>`;

    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = `${member.name} - ${member.email}`;
        issueMemberSelect.appendChild(option);
    });
}

function populateReturnForm() {
    if (!returnTransactionSelect) {
        return;
    }

    returnTransactionSelect.innerHTML =
        `<option value="">Select Transaction</option>`;

    transactions
        .filter(transaction => transaction.status === "Issued")
        .forEach(transaction => {
            const book = books.find(item => item.id === transaction.bookId);
            const member = members.find(item => item.id === transaction.memberId);

            const option = document.createElement("option");

            option.value = transaction.id;
            option.textContent =
                `${book ? book.title : "Book"} - ${member ? member.name : "Member"}`;

            returnTransactionSelect.appendChild(option);
        });
}

function updateAnalytics() {
    updateCategoryChart();
    updateFineSummary();
    updatePopularBooks();
    updateRecentActivity();
}

function updateCategoryChart() {
    if (!categoryChart) {
        return;
    }

    const categories = [
        "Programming",
        "Database",
        "Networking",
        "AI & ML",
        "Web Development",
        "General"
    ];

    categoryChart.innerHTML = "";

    const categoryCounts = {};

    categories.forEach(category => {
        categoryCounts[category] = 0;
    });

    books.forEach(book => {
        if (categoryCounts[book.category] !== undefined) {
            categoryCounts[book.category]++;
        }
    });

    const maxCount = Math.max(...Object.values(categoryCounts), 1);

    categories.forEach(category => {
        const count = categoryCounts[category];
        const percentage = (count / maxCount) * 100;

        const item = document.createElement("div");
        item.className = "chart-item";

        item.innerHTML = `
            <div class="chart-label">
                <span>${escapeHTML(category)}</span>
                <strong>${count}</strong>
            </div>
            <div class="chart-bar">
                <div class="chart-fill" style="width: ${percentage}%"></div>
            </div>
        `;

        categoryChart.appendChild(item);
    });
}

function updateFineSummary() {
    if (!totalFineAmount || !fineRecords || !overdueBooks) {
        return;
    }

    const recordedFine = transactions.reduce(
        (total, transaction) =>
            total + Number(transaction.fine || 0),
        0
    );

    const activeOverdueFine = transactions.reduce(
        (total, transaction) => {
            if (
                transaction.status === "Issued" &&
                isOverdue(transaction)
            ) {
                return total + calculateFine(transaction);
            }

            return total;
        },
        0
    );

    const totalFine = recordedFine + activeOverdueFine;

    const overdue = transactions.filter(
        transaction =>
            transaction.status === "Issued" &&
            isOverdue(transaction)
    ).length;

    const records = transactions.filter(
        transaction =>
            Number(transaction.fine || 0) > 0 ||
            (
                transaction.status === "Issued" &&
                isOverdue(transaction)
            )
    ).length;

    animateCount(totalFineAmount, totalFine, { prefix: "₹" });
    animateCount(fineRecords, records);
    animateCount(overdueBooks, overdue);
}

function updatePopularBooks() {
    if (!popularBooks) {
        return;
    }

    popularBooks.innerHTML = "";

    if (transactions.length === 0) {
        popularBooks.innerHTML = `
            <div class="empty-analytics">
                No book issue data available
            </div>
        `;
        return;
    }

    const bookCounts = {};

    transactions.forEach(transaction => {
        bookCounts[transaction.bookId] =
            (bookCounts[transaction.bookId] || 0) + 1;
    });

    const popular = Object.entries(bookCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    popular.forEach(([bookId, count]) => {
        const book = books.find(item => item.id === bookId);

        if (!book) {
            return;
        }

        const item = document.createElement("div");
        item.className = "popular-book-item";

        item.innerHTML = `
            <div>
                <strong>${escapeHTML(book.title)}</strong>
                <span>${escapeHTML(book.category)}</span>
            </div>
            <b>${count}</b>
        `;

        popularBooks.appendChild(item);
    });
}

function updateRecentActivity() {
    if (!recentActivity) {
        return;
    }

    recentActivity.innerHTML = "";

    if (transactions.length === 0) {
        recentActivity.innerHTML = `
            <div class="empty-analytics">
                No recent activity
            </div>
        `;
        return;
    }

    const recent = [...transactions].reverse().slice(0, 5);

    recent.forEach(transaction => {
        const book = books.find(item => item.id === transaction.bookId);
        const member = members.find(item => item.id === transaction.memberId);

        const item = document.createElement("div");
        item.className = "activity-item";

        item.innerHTML = `
            <div class="activity-icon">
                ${transaction.status === "Issued" ? "📖" : "↩️"}
            </div>
            <div>
                <strong>${escapeHTML(
                    transaction.status === "Issued"
                        ? "Book Issued"
                        : "Book Returned"
                )}</strong>
                <span>
                    ${escapeHTML(book ? book.title : "Book")} ·
                    ${escapeHTML(member ? member.name : "Member")}
                </span>
            </div>
        `;

        recentActivity.appendChild(item);
    });
}

if (addBookBtn) {
    addBookBtn.addEventListener("click", () => {
        bookForm.reset();
        bookForm.dataset.editId = "";
        bookModal.classList.add("active");
    });
}

if (closeBookModal) {
    closeBookModal.addEventListener("click", () => {
        bookModal.classList.remove("active");
    });
}

if (bookForm) {
    bookForm.addEventListener("submit", event => {
        event.preventDefault();

        const editId = bookForm.dataset.editId;

        const title = bookTitle.value.trim();
        const author = bookAuthor.value.trim();
        const category = bookCategory.value;
        const isbn = bookISBN.value.trim();

        if (editId) {
            const book = books.find(item => item.id === editId);

            if (book) {
                book.title = title;
                book.author = author;
                book.category = category;
                book.isbn = isbn;
            }
        } else {
            books.push({
                id: generateId(),
                title,
                author,
                category,
                isbn,
                status: "Available",
                addedDate: formatDate(new Date())
            });
        }

        saveData();
        renderBooks();
        updateDashboard();
        bookModal.classList.remove("active");
        bookForm.reset();
    });
}

window.editBook = function(id) {
    const book = books.find(item => item.id === id);

    if (!book) {
        return;
    }

    bookTitle.value = book.title;
    bookAuthor.value = book.author;
    bookCategory.value = book.category;
    bookISBN.value = book.isbn;

    bookForm.dataset.editId = id;
    bookModal.classList.add("active");
};

window.deleteBook = function(id) {
    const book = books.find(item => item.id === id);

    if (!book) {
        return;
    }

    const hasActiveTransaction = transactions.some(
        transaction =>
            transaction.bookId === id &&
            transaction.status === "Issued"
    );

    if (hasActiveTransaction) {
        alert("This book is currently issued and cannot be deleted.");
        return;
    }

    if (!confirm(`Delete "${book.title}"?`)) {
        return;
    }

    books = books.filter(item => item.id !== id);

    saveData();
    renderBooks();
    updateDashboard();
};

if (addMemberBtn) {
    addMemberBtn.addEventListener("click", () => {
        memberForm.reset();
        memberForm.dataset.editId = "";
        memberModal.classList.add("active");
    });
}

if (closeMemberModal) {
    closeMemberModal.addEventListener("click", () => {
        memberModal.classList.remove("active");
    });
}

if (memberForm) {
    memberForm.addEventListener("submit", event => {
        event.preventDefault();

        const editId = memberForm.dataset.editId;

        const name = memberName.value.trim();
        const email = memberEmail.value.trim();
        const phone = memberPhone.value.trim();

        if (editId) {
            const member = members.find(item => item.id === editId);

            if (member) {
                member.name = name;
                member.email = email;
                member.phone = phone;
            }
        } else {
            members.push({
                id: generateId(),
                name,
                email,
                phone,
                joinDate: formatDate(new Date())
            });
        }

        saveData();
        renderMembers();
        updateDashboard();
        memberModal.classList.remove("active");
        memberForm.reset();
    });
}

window.editMember = function(id) {
    const member = members.find(item => item.id === id);

    if (!member) {
        return;
    }

    memberName.value = member.name;
    memberEmail.value = member.email;
    memberPhone.value = member.phone;

    memberForm.dataset.editId = id;
    memberModal.classList.add("active");
};

window.deleteMember = function(id) {
    const member = members.find(item => item.id === id);

    if (!member) {
        return;
    }

    const hasActiveTransaction = transactions.some(
        transaction =>
            transaction.memberId === id &&
            transaction.status === "Issued"
    );

    if (hasActiveTransaction) {
        alert("This member has an active book and cannot be deleted.");
        return;
    }

    if (!confirm(`Delete "${member.name}"?`)) {
        return;
    }

    members = members.filter(item => item.id !== id);

    saveData();
    renderMembers();
    updateDashboard();
};

if (issueBookBtn) {
    issueBookBtn.addEventListener("click", () => {
        populateIssueForm();

        if (books.filter(book => book.status === "Available").length === 0) {
            alert("No books are currently available.");
            return;
        }

        if (members.length === 0) {
            alert("Please add a member first.");
            return;
        }

        issueForm.reset();
        issueModal.classList.add("active");
    });
}

if (closeIssueModal) {
    closeIssueModal.addEventListener("click", () => {
        issueModal.classList.remove("active");
    });
}

if (issueForm) {
    issueForm.addEventListener("submit", event => {
        event.preventDefault();

        const bookId = issueBookSelect.value;
        const memberId = issueMemberSelect.value;
        const days = Number(issueDays.value);

        if (!bookId || !memberId || !days) {
            return;
        }

        const book = books.find(item => item.id === bookId);

        if (!book || book.status !== "Available") {
            alert("This book is not available.");
            return;
        }

        const issueDate = new Date();
        const dueDate = new Date();

        dueDate.setDate(issueDate.getDate() + days);

        book.status = "Issued";

        transactions.push({
            id: generateId(),
            bookId,
            memberId,
            issueDate: formatDate(issueDate),
            dueDate: formatDate(dueDate),
            returnDate: "",
            fine: 0,
            status: "Issued"
        });

        saveData();

        renderBooks();
        renderTransactions();
        updateDashboard();

        issueModal.classList.remove("active");
        issueForm.reset();
    });
}

if (returnBookBtn) {
    returnBookBtn.addEventListener("click", () => {
        populateReturnForm();

        const activeTransactions = transactions.filter(
            transaction => transaction.status === "Issued"
        );

        if (activeTransactions.length === 0) {
            alert("There are no issued books to return.");
            return;
        }

        returnForm.reset();
        returnModal.classList.add("active");
    });
}

if (closeReturnModal) {
    closeReturnModal.addEventListener("click", () => {
        returnModal.classList.remove("active");
    });
}

window.openReturnForTransaction = function(id) {
    populateReturnForm();

    if (returnTransactionSelect) {
        returnTransactionSelect.value = id;
    }

    returnModal.classList.add("active");
};

if (returnForm) {
    returnForm.addEventListener("submit", event => {
        event.preventDefault();

        const transactionId = returnTransactionSelect.value;

        const transaction = transactions.find(
            item => item.id === transactionId
        );

        if (!transaction) {
            return;
        }

        const book = books.find(item => item.id === transaction.bookId);

        const returnDate = new Date();
        const dueDate = parseDate(transaction.dueDate);

        let fine = 0;

        if (dueDate) {
            returnDate.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);

            const difference = returnDate - dueDate;

            if (difference > 0) {
                fine =
                    Math.floor(
                        difference / (1000 * 60 * 60 * 24)
                    ) * FINE_PER_DAY;
            }
        }

        transaction.status = "Returned";
        transaction.returnDate = formatDate(returnDate);
        transaction.fine = fine;

        if (book) {
            book.status = "Available";
        }

        saveData();

        renderBooks();
        renderTransactions();
        updateDashboard();

        returnModal.classList.remove("active");

        if (fine > 0) {
            alert(`Book returned successfully. Fine: ₹${fine}`);
        } else {
            alert("Book returned successfully. No fine.");
        }
    });
}

if (fineBtn) {
    fineBtn.addEventListener("click", () => {
        updateFineSummaryDetails();
        fineModal.classList.add("active");
    });
}

if (closeFineModal) {
    closeFineModal.addEventListener("click", () => {
        fineModal.classList.remove("active");
    });
}

function updateFineSummaryDetails() {
    const fineDetails = document.getElementById("fineDetails");

    if (!fineDetails) {
        return;
    }

    fineDetails.innerHTML = "";

    const fineTransactions = transactions.filter(transaction => {
        return (
            Number(transaction.fine || 0) > 0 ||
            (
                transaction.status === "Issued" &&
                isOverdue(transaction)
            )
        );
    });

    if (fineTransactions.length === 0) {
        fineDetails.innerHTML = `
            <div class="empty-state">
                No fines or overdue books.
            </div>
        `;
        return;
    }

    fineTransactions.forEach(transaction => {
        const book = books.find(item => item.id === transaction.bookId);
        const member = members.find(item => item.id === transaction.memberId);

        const fine =
            transaction.status === "Issued"
                ? calculateFine(transaction)
                : Number(transaction.fine || 0);

        const item = document.createElement("div");
        item.className = "fine-detail-item";

        item.innerHTML = `
            <div>
                <strong>${escapeHTML(book ? book.title : "Book")}</strong>
                <span>${escapeHTML(member ? member.name : "Member")}</span>
            </div>
            <strong>₹${fine}</strong>
        `;

        fineDetails.appendChild(item);
    });
}

if (searchBook) {
    searchBook.addEventListener("input", filterBooks);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterBooks);
}

function filterBooks() {
    const searchValue = searchBook
        ? searchBook.value.toLowerCase().trim()
        : "";

    const categoryValue = categoryFilter
        ? categoryFilter.value
        : "";

    const filtered = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchValue) ||
            book.author.toLowerCase().includes(searchValue) ||
            book.isbn.toLowerCase().includes(searchValue);

        const matchesCategory =
            !categoryValue ||
            categoryValue === "all" ||
            book.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    renderBooks(filtered);
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

if (themeToggle) {
    const savedTheme = localStorage.getItem("libraryTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "libraryTheme",
            isDark ? "dark" : "light"
        );

        themeToggle.textContent = isDark ? "☀️" : "🌙";

        themeToggle.classList.remove("spin");
        void themeToggle.offsetWidth;
        themeToggle.classList.add("spin");
    });
}

renderBooks();
renderMembers();
renderTransactions();
populateIssueForm();
populateReturnForm();
updateDashboard();