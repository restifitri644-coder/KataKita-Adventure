// =====================
// DATA SOAL
// =====================
const questions = [
    { q: "1. Saat berolahraga, sebaiknya (pakai) sepatu. Kata dalam kurung seharusnya mendapatkan imbuhan...", a: ["me-", "me-kan", "di-", "di-kan"], correct: 0 },
    { q: "2. Penulisan waktu pukul lima lebih tiga puluh menit adalah...", a: ["05,30", "05.30", "05;30", "05:30"], correct: 1 },
    { q: "3. Tanaman cabai yang terserang hama sedang ... dengan insektisida.", a: ["disemprot", "ditaburi", "diobati", "disiram"], correct: 0 },
    { q: "4. Petani berangkat ke sawah pada...", a: ["malam hari", "siang hari", "sore hari", "pagi hari"], correct: 3 },
    {
        q: "5. Penulisan kalimat langsung yang benar adalah...",
        a: [
            'Pak Udin berkata: "Kami puas berbelanja di KUD".',
            'Pak Udin berkata; "Kami puas berbelanja di KUD".',
            'Pak Udin berkata. "Kami puas berbelanja di KUD".',
            'Pak Udin berkata, "Kami puas berbelanja di KUD".'
        ],
        correct: 3
    },
    { q: "6. Makna kata alamiah adalah...", a: ["bersifat alami", "bersifat apa adanya", "bersifat ilmu", "bersifat ilmiah"], correct: 0 },
    { q: "7. Jalan di depan rumahku belum ... juga.", a: ["diratakan", "digali", "dirombak", "diperbaiki"], correct: 3 },
    { q: "8. Pagi ini begitu ..., matahari bersinar hangat.", a: ["mendung", "dingin", "cerah", "sejuk"], correct: 2 },
    { q: "9. Menabung di bank lebih aman ... menguntungkan.", a: ["sedangkan", "dan", "tetapi", "karena"], correct: 1 },
    { q: "10. Antonim kata mahal adalah...", a: ["murah", "eksklusif", "mewah", "minim"], correct: 0 },
    { q: "11. Tini memasukkan uangnya ... celengan.", a: ["untuk", "dari", "ke", "di"], correct: 2 },
    { q: "12. Sinonim kata menabung adalah...", a: ["meminjam uang", "menerima uang", "menyimpan uang", "memberi uang"], correct: 2 },
    { q: "13. Muda menabung, tua...", a: ["beruntung", "bahagia", "tak sengsara", "tak bingung"], correct: 0 },
    { q: "14. Ibu membeli sayuran ... pasar.", a: ["pada", "dari", "di", "ke"], correct: 2 },
    {
        q: "15. Kalimat yang memiliki keterangan tempat adalah...",
        a: [
            "Ibu pergi ke pasar",
            "Ibu pergi dengan kakak",
            "Ibu mencuci baju",
            "Ibu memotong bawang dengan pisau"
        ],
        correct: 0
    }
];

// =====================
// VARIABEL GAME
// =====================
let index = 0;
let score = 0;
let player = "";

// TIMER
let timeLeft = 15;
let timerInterval;

// =====================
// AMBIL ELEMEN HTML
// =====================
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");

const soundBenar = document.getElementById("soundBenar");
const soundSalah = document.getElementById("soundSalah");
const soundSelesai = document.getElementById("soundSelesai");

// =====================
// MULAI GAME
// =====================
function startGame() {
    const nameInput = document.getElementById("playerName").value;
    if (nameInput === "") {
        alert("Masukkan nama pemain terlebih dahulu!");
        return;
    }

    player = nameInput;
    index = 0;
    score = 0;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    loadQuestion();
}

// =====================
// LOAD SOAL
// =====================
function loadQuestion() {
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";

    questionEl.textContent = questions[index].q;
    progressEl.textContent = `Soal ${index + 1} dari ${questions.length}`;

    questions[index].a.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = () => checkAnswer(i);
        answersEl.appendChild(btn);
    });

    startTimer();
}

// =====================
// TIMER
// =====================
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerEl.textContent = `⏱️ Waktu: ${timeLeft} detik`;
    timerEl.style.color = "#F44336";

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱️ Waktu: ${timeLeft} detik`;

        if (timeLeft <= 3) {
            timerEl.style.color = "red";
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            feedbackEl.textContent = "⏰ Waktu Habis!";
            feedbackEl.style.color = "orange";
            soundSalah.play();

            index++;
            if (index < questions.length) {
                setTimeout(loadQuestion, 1200);
            } else {
                setTimeout(endGame, 1200);
            }
        }
    }, 1000);
}

// =====================
// CEK JAWABAN
// =====================
function checkAnswer(i) {
    clearInterval(timerInterval);

    if (i === questions[index].correct) {
        score += 10;
        feedbackEl.textContent = "✅ Jawaban Benar!";
        feedbackEl.style.color = "green";
        soundBenar.play();
    } else {
        feedbackEl.textContent = "❌ Jawaban Salah!";
        feedbackEl.style.color = "red";
        soundSalah.play();
    }

    index++;
    if (index < questions.length) {
        setTimeout(loadQuestion, 1200);
    } else {
        setTimeout(endGame, 1200);
    }
}

// =====================
// AKHIR GAME + SIMPAN RANKING
// =====================
function endGame() {
    soundSelesai.play();

    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");

    document.getElementById("finalScore").textContent =
        `Nama Pemain: ${player} | Skor: ${score}`;

    saveScore(player, score);
    showRanking();
}

// =====================
// SIMPAN SKOR (LOCAL STORAGE)
// =====================
function saveScore(name, score) {
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ name, score });

    ranking.sort((a, b) => b.score - a.score);

    localStorage.setItem("ranking", JSON.stringify(ranking));
}

// =====================
// TAMPILKAN RANKING
// =====================
function showRanking() {
    const list = document.getElementById("playerList");
    list.innerHTML = "";

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.name} - ${player.score}`;
        list.appendChild(li);
    });
}

// =====================
// RESET RANKING
// =====================
function resetRanking() {
    if (confirm("Yakin ingin menghapus semua daftar pemain?")) {
        localStorage.removeItem("ranking");
        document.getElementById("playerList").innerHTML = "";
    }
}
