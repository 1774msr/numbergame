document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const numberContainer = document.getElementById('number-container');
    const checkButton = document.getElementById('check-button');
    const result = document.getElementById('result');
    const elapsedTime = document.getElementById('elapsed-time');
    const clearMessage = document.getElementById('clear-message');
    const restartButton = document.getElementById('restart-button');
    const chinoImage = document.getElementById('chino-image');

    let firstButton = null; // 最初にタップされたボタン
    let timer;
    let seconds = 0;

    // 「C h i n o」対応の配列
    const textArray = ['C', 'h', 'i', 'n', 'o'];

    // ランダムな並び順を生成
    const generateRandomSequence = () => {
        const sequence = [...Array(5).keys()];
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        return sequence;
    };

    let correctSequence = generateRandomSequence();

    // ボタンを生成して表示
    const renderButtons = () => {
        numberContainer.innerHTML = '';
        for (let i = 0; i < correctSequence.length; i++) {
            const button = document.createElement('button');
            button.textContent = textArray[i];
            button.dataset.index = i;
            button.addEventListener('click', handleButtonClick);
            numberContainer.appendChild(button);
        }
    };

    // ボタンがクリックされたときの処理
    const handleButtonClick = (event) => {
        const clickedButton = event.target;

        if (!firstButton) {
            // 最初のボタンが選択された場合
            firstButton = clickedButton;
        } else {
            // 2つ目のボタンが選択された場合
            const tempIndex = clickedButton.dataset.index;
            clickedButton.dataset.index = firstButton.dataset.index;
            firstButton.dataset.index = tempIndex;

            updateButtonText();

            firstButton = null; // リセット
        }
    };

    const updateButtonText = () => {
        const buttons = numberContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.textContent = textArray[button.dataset.index];
        });
    };

    const checkSequence = () => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const userSequence = buttons.map(button => parseInt(button.dataset.index, 10));
        const correctCount = userSequence.reduce((count, value, index) => {
            return count + (value === correctSequence[index] ? 1 : 0);
        }, 0);
        
        if (correctCount === correctSequence.length) {
            // ゲームクリア時の処理
            clearInterval(timer); // タイマー停止
            numberContainer.style.display = 'none';
            checkButton.style.display = 'none';
            result.style.display = 'none';
            elapsedTime.style.display = 'none';
            clearMessage.style.display = 'flex'; // 画像を表示する

            // クリアタイムの表示
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('clear-time').textContent = `Clear Time: ${minutes}:${secs}`;
        } else {
            result.textContent = `正しい位置にある文字の数: ${correctCount}`;
        }
    };

    const startTimer = () => {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            elapsedTime.textContent = `Elapsed Time: ${minutes}:${secs}`;
        }, 1000);
    };

    const restartGame = () => {
        clearMessage.style.display = 'none';
        numberContainer.style.display = 'flex';
        checkButton.style.display = 'block';
        result.style.display = 'block';
        elapsedTime.style.display = 'block';
        startScreen.style.display = 'none'; // 数字選択画面を非表示にする
        correctSequence = generateRandomSequence();
        renderButtons();
        seconds = 0;
        startTimer(); // タイマー再スタート
    };

    // 数字の数を選んだときの処理
    document.querySelectorAll('.number-choice').forEach(button => {
        button.addEventListener('click', (event) => {
            const number = parseInt(event.target.dataset.number, 10);
            correctSequence = generateRandomSequence();
            renderButtons();
            startScreen.style.display = 'none'; // 数字選択画面を非表示にする
            numberContainer.style.display = 'flex';
            checkButton.style.display = 'block';
            result.style.display = 'block';
            elapsedTime.style.display = 'block';
            startTimer(); // タイマー開始
        });
    });

    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
});











