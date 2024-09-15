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
    const lotteryButton = document.getElementById('lottery-button');
    const slotMachine = document.getElementById('slot-machine');
    const chinoImage = document.getElementById('chino-image');

    let firstButton = null;
    let buttonCount = 5;
    let correctSequence = [];
    let startTime = null;
    let timerInterval = null;

    const textArray = ['1', '2', '3', '4', '5', '6', '7'];

    // 1から7の数字に対応するボタンの背景色
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

            // ボタンの背景色を設定
            if (i < colorArray.length) {
                button.style.backgroundColor = colorArray[i];
                button.style.color = 'white';  // ボタンのテキストを見やすくするために文字色を白に
                button.style.border = 'none';  // ボタンの枠を無くしてシンプルに
                button.style.padding = '10px'; // ボタンの余白を追加
                button.style.margin = '5px';   // ボタンの間隔を空ける
                button.style.fontSize = '20px'; // テキストサイズを大きくする
                button.style.borderRadius = '10px'; // ボタンを丸くする
            }

            button.addEventListener('touchstart', handleTouchStart);
            button.addEventListener('touchmove', handleTouchMove);
            button.addEventListener('touchend', handleTouchEnd);

            numberContainer.appendChild(button);
        }
    };

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    };

    const handleTouchMove = (event) => {
        event.preventDefault(); // スクロールを防止する
    };

    const handleTouchEnd = (event) => {
        const touch = event.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        const threshold = 50; // スワイプと判定する最低移動距離

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 横方向のスワイプ
            if (diffX > threshold) {
                // 右にスワイプ
                swapButton(event.target, 'right');
            } else if (diffX < -threshold) {
                // 左にスワイプ
                swapButton(event.target, 'left');
            }
        } else {
            // 縦方向のスワイプ
            if (diffY > threshold) {
                // 下にスワイプ
                swapButton(event.target, 'down');
            } else if (diffY < -threshold) {
                // 上にスワイプ
                swapButton(event.target, 'up');
            }
        }
    };

    const swapButton = (button, direction) => {
        const index = parseInt(button.dataset.index, 10);
        let targetIndex;

        if (direction === 'right' && index % buttonCount < buttonCount - 1) {
            targetIndex = index + 1;
        } else if (direction === 'left' && index % buttonCount > 0) {
            targetIndex = index - 1;
        } else if (direction === 'down' && index + buttonCount < buttonCount * buttonCount) {
            targetIndex = index + buttonCount;
        } else if (direction === 'up' && index - buttonCount >= 0) {
            targetIndex = index - buttonCount;
        }
        
        if (targetIndex !== undefined) {
            const buttons = numberContainer.querySelectorAll('button');
            const targetButton = buttons[targetIndex];
            const tempIndex = button.dataset.index;
            button.dataset.index = targetButton.dataset.index;
            targetButton.dataset.index = tempIndex;

            updateButtonText();
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
            stopTimer();
            numberContainer.style.display = 'none';
            checkButton.style.display = 'none';
            elapsedTimeDisplay.style.display = 'none';

            const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            clearTimeDisplay.textContent = `Clear Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            clearTimeDisplay.style.fontSize = '100px';
            clearTimeDisplay.style.marginBottom = '20px';
            clearTimeDisplay.style.fontWeight = 'bold';

            clearMessage.appendChild(clearTimeDisplay);
            setTimeout(() => {
                clearMessage.style.display = 'flex';
            }, 2000);
        }
    };

    const restartGame = () => {
        clearMessage.style.display = 'none';
        numberContainer.style.display = 'flex';
        checkButton.style.display = 'block';
        result.style.display = 'block';
        elapsedTimeDisplay.style.display = 'block';
        clearTimeDisplay.style.display = 'none';
        chinoImage.style.display = 'none';
        correctSequence = generateRandomSequence(buttonCount);
        renderButtons();
        startTimer();
    };

    const startTimer = () => {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
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

    numberChoiceButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            buttonCount = parseInt(event.target.dataset.number, 10);
            startScreen.style.display = 'none';
            numberContainer.style.display = 'flex';
            checkButton.style.display = 'block';
            result.style.display = 'block';
            elapsedTimeDisplay.style.display = 'block';
            correctSequence = generateRandomSequence(buttonCount);
            renderButtons();
            startTimer();
        });
    });

    lotteryButton.addEventListener('click', startSlotMachine);
    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
});
