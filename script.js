document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('number-container');
    const checkButton = document.getElementById('check-button');
    const result = document.getElementById('result');
    const clearMessage = document.getElementById('clear-message');
    const restartButton = document.getElementById('restart-button');
    const startScreen = document.getElementById('start-screen');
    const numberChoiceButtons = document.querySelectorAll('.number-choice');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');
    const clearTimeDisplay = document.createElement('div');
    clearTimeDisplay.id = 'clear-time';
    
    let buttonCount = 5;
    let correctSequence = [];
    let startTime = null;
    let draggedButton = null;
    let startX, startY;  // タッチの開始位置

    const textArray = ['1', '2', '3', '4', '5', '6', '7'];
    
    // ボタンの色
    const colorArray = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

    const generateRandomSequence = (count) => {
        const sequence = [...Array(count).keys()];
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        return sequence;
    };

    const renderButtons = () => {
        numberContainer.innerHTML = '';
        for (let i = 0; i < buttonCount; i++) {
            const button = document.createElement('button');
            button.textContent = textArray[i];
            button.dataset.index = i;
            button.dataset.originalIndex = i;

            // ボタンのスタイルを大きく調整
            button.style.backgroundColor = colorArray[i];
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '40px';  // 大きめのボタン
            button.style.margin = '10px';
            button.style.fontSize = '30px';
            button.style.borderRadius = '10px';
            button.style.position = 'relative';

            button.addEventListener('touchstart', handleTouchStart);
            button.addEventListener('touchmove', handleTouchMove);
            button.addEventListener('touchend', handleTouchEnd);

            numberContainer.appendChild(button);
        }
    };

    // タッチ開始時の処理
    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        draggedButton = event.target;  // ドラッグ中のボタンを保持
        draggedButton.style.transition = 'none';  // 移動中のスムーズな移動
    };

    // タッチ移動中の処理
    const handleTouchMove = (event) => {
        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        // ボタンをドラッグする際に移動を視覚化
        if (draggedButton) {
            draggedButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    };

    // タッチ終了時の処理
    const handleTouchEnd = (event) => {
        if (draggedButton) {
            draggedButton.style.transform = '';  // 移動をリセット
            draggedButton.style.transition = 'transform 0.3s';  // スムーズな戻り動作

            // スワイプによる移動をここで実行
            swapButton(event.target);
        }
        draggedButton = null;
    };

    // ボタンの位置を入れ替える処理
    const swapButton = (button) => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const index = buttons.indexOf(button);
        const targetIndex = (index + 1) % buttons.length;  // とりあえず右のボタンと入れ替える例

        const targetButton = buttons[targetIndex];
        const tempContent = button.textContent;
        button.textContent = targetButton.textContent;
        targetButton.textContent = tempContent;
    };

    // シーケンスを確認する処理
    const checkSequence = () => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const userSequence = buttons.map(button => parseInt(button.textContent, 10) - 1); // 1始まりから0始まりに

        let correctCount = 0;
        buttons.forEach((button, index) => {
            if (parseInt(button.textContent, 10) - 1 === correctSequence[index]) {
                button.style.backgroundColor = 'green';  // 正しい位置のボタンを緑色に
                correctCount++;
            } else {
                button.style.backgroundColor = 'red';  // 間違った位置のボタンを赤色に
            }
        });

        result.textContent = `正しい位置の数: ${correctCount}`;

        if (correctCount === buttonCount) {
            stopTimer();
            clearMessage.style.display = 'block';  // クリアメッセージ表示
        }
    };

    // タイマー関連の処理
    const startTimer = () => {
        startTime = new Date();
        setInterval(updateTimer, 1000);
    };

    const updateTimer = () => {
        if (startTime) {
            const currentTime = new Date();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            elapsedTimeDisplay.textContent = `Elapsed Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    // ゲーム開始処理
    const restartGame = () => {
        clearMessage.style.display = 'none';
        correctSequence = generateRandomSequence(buttonCount);
        renderButtons();
        startTimer();
    };

    numberChoiceButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            buttonCount = parseInt(event.target.dataset.number, 10);
            startScreen.style.display = 'none';
            numberContainer.style.display = 'flex';
            restartGame();
        });
    });

    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
});
