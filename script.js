document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('number-container');
    const checkButton = document.getElementById('check-button');
    const result = document.getElementById('result');
    const clearMessage = document.getElementById('clear-message');
    const restartButton = document.getElementById('restart-button');
    const startScreen = document.getElementById('start-screen');
    const numberChoiceButtons = document.querySelectorAll('.number-choice');
    const elapsedTimeDisplay = document.getElementById('elapsed-time'); // 経過時間表示用の要素
    const clearTimeDisplay = document.createElement('div'); // クリア時間表示用の要素
    clearTimeDisplay.id = 'clear-time';

    let firstButton = null; // 最初にタップされたボタン
    let buttonCount = 5; // デフォルトのボタン数
    let correctSequence = []; // 正しいシーケンス
    let startTime = null; // ゲーム開始時刻
    let timerInterval = null; // タイマーのインターバルID

    // 数字の配列を生成
    const textArray = ['1', '2', '3', '4', '5', '6', '7'];

    // ランダムな並び順を生成
    const generateRandomSequence = (count) => {
        const sequence = [...Array(count).keys()];
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        return sequence;
    };

    // ボタンを生成して表示
    const renderButtons = () => {
        numberContainer.innerHTML = '';
        for (let i = 0; i < buttonCount; i++) {
            const button = document.createElement('button');
            button.textContent = textArray[i];
            button.dataset.index = i;
            button.dataset.originalIndex = i; // 元のインデックスを保存
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
            button.textContent = textArray[parseInt(button.dataset.index, 10)];
        });
    };

    const checkSequence = () => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const userSequence = buttons.map(button => parseInt(button.dataset.index, 10));
        const correctCount = userSequence.reduce((count, value, index) => {
            return count + (value === correctSequence[index] ? 1 : 0);
        }, 0);

        result.textContent = `正しい位置にある数字の数: ${correctCount}`;

        if (correctCount === buttonCount) {
            // ゲームクリア時の処理
            stopTimer(); // タイマーを停止
            numberContainer.style.display = 'none';
            checkButton.style.display = 'none';
            elapsedTimeDisplay.style.display = 'none'; // 経過時間を非表示

            // クリア時間を表示
            const elapsedSeconds = Math.floor((new Date() - startTime) / 1000); // 秒単位
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            clearTimeDisplay.textContent = `Clear Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            clearTimeDisplay.style.fontSize = '36px'; // フォントサイズを大きくする
            clearTimeDisplay.style.marginTop = '20px'; // 上部マージンを追加

            clearMessage.appendChild(clearTimeDisplay); // クリア時間表示をクリアメッセージに追加
            setTimeout(() => {
                clearMessage.style.display = 'flex'; // 画像とクリア時間を表示
            }, 2000); // 2秒後にクリア画面を表示
        }
    };

    const restartGame = () => {
        clearMessage.style.display = 'none';
        numberContainer.style.display = 'flex';
        checkButton.style.display = 'block';
        result.style.display = 'block';
        elapsedTimeDisplay.style.display = 'block'; // 経過時間を再表示
        clearTimeDisplay.style.display = 'none'; // クリア時間を非表示にする
        correctSequence = generateRandomSequence(buttonCount);
        renderButtons();
        startTimer(); // タイマーをスタート
    };

    const startTimer = () => {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000); // 1秒ごとにタイマー更新
    };

    const updateTimer = () => {
        if (startTime) {
            const currentTime = new Date();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000); // 秒単位
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            elapsedTimeDisplay.textContent = `Elapsed Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    // 数字の数を選ぶ処理
    numberChoiceButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            buttonCount = parseInt(event.target.dataset.number, 10);
            startScreen.style.display = 'none'; // 数字選択画面を非表示
            numberContainer.style.display = 'flex'; // ゲームエリアを表示
            checkButton.style.display = 'block'; // 確認ボタンを表示
            result.style.display = 'block'; // 結果表示エリアを表示
            elapsedTimeDisplay.style.display = 'block'; // 経過時間表示を表示
            correctSequence = generateRandomSequence(buttonCount); // 新しいシーケンスを生成
            renderButtons(); // ボタンを再描画
            startTimer(); // タイマーをスタート
        });
    });

    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
});









