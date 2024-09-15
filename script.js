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
    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1']; // 異なる鮮やかな色

    const numberColors = {
        '1': '#FF6347', // トマトレッド
        '2': '#4682B4', // スチールブルー
        '3': '#32CD32', // ライムグリーン
        '4': '#FFD700', // ゴールド
        '5': '#FF69B4', // ホットピンク
        '6': '#8A2BE2', // ブルーバイオレット
        '7': '#00CED1'  // ダークターコイズ
    };

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
            const number = textArray[i];
            button.textContent = number;
            button.dataset.index = i;
            button.dataset.originalIndex = i;
            button.style.backgroundColor = numberColors[number];
            button.style.color = '#FFF'; // ボタンの文字色を白に設定
            button.style.border = 'none';
            button.style.borderRadius = '8px'; // 角を丸める
            button.style.padding = '15px'; // ボタンのサイズを調整
            button.style.margin = '5px'; // ボタン間の間隔を調整
            button.style.fontSize = '18px'; // フォントサイズを設定
            button.style.cursor = 'pointer'; // マウスカーソルをポインターに設定
            button.addEventListener('touchstart', handleTouchStart); // スワイプ操作のためのイベントリスナー
            button.addEventListener('touchend', handleTouchEnd);
            numberContainer.appendChild(button);
        }
    };

    const handleButtonClick = (event) => {
        const clickedButton = event.target;

        if (!firstButton) {
            firstButton = clickedButton;
        } else {
            const tempIndex = clickedButton.dataset.index;
            clickedButton.dataset.index = firstButton.dataset.index;
            firstButton.dataset.index = tempIndex;

            updateButtonText();
            firstButton = null;
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

    const startSlotMachine = () => {
        slotMachine.style.display = 'block';
        const slotInterval = 100;
        const duration = 3000;
        const endTime = Date.now() + duration;

        const spin = () => {
            if (Date.now() < endTime) {
                slotMachine.textContent = `${Math.floor(Math.random() * 7) + 1} | ${Math.floor(Math.random() * 7) + 1} | ${Math.floor(Math.random() * 7) + 1}`;
                setTimeout(spin, slotInterval);
            } else {
                const isWinner = Math.random() < 1 / 3; // 1/3 の確率で当たり
                if (isWinner) {
                    slotMachine.textContent = '7 | 7 | 7';
                    setTimeout(() => {
                        alert('おめでとう！');
                        window.location.href = 'chinonono.jpg'; // 遷移する
                    }, 500);
                } else {
                    slotMachine.textContent = '失敗';
                    setTimeout(() => {
                        alert('残念！また挑戦してみてください。');
                        slotMachine.style.display = 'none'; // スロットを隠す
                    }, 500);
                }
            }
        };
        spin();
    };

    const handleTouchStart = (event) => {
        const button = event.target;
        button.classList.add('lift');
    };

    const handleTouchEnd = (event) => {
        const button = event.target;
        button.classList.remove('lift');
        handleButtonClick(event);
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
