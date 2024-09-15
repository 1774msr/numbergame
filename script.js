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
    
    let firstButton = null;
    let buttonCount = 5;
    let correctSequence = [];
    let startTime = null;
    let timerInterval = null;

    const textArray = ['1', '2', '3', '4', '5', '6', '7'];

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
            button.addEventListener('click', handleButtonClick);
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
            clearTimeDisplay.style.fontSize = '36px';
            clearTimeDisplay.style.marginTop = '20px';

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

    const startLottery = () => {
        const slotCount = 3; // 3桁のスロット
        let slots = [0, 0, 0]; // スロットの初期値
        let counter = 0;

        const spinSlot = () => {
            slots = slots.map(() => Math.floor(Math.random() * 7) + 1);
            console.log('Current Slots:', slots.join(' ')); // スロットの現在の値をコンソールに表示
        };

        const interval = setInterval(() => {
            counter++;
            spinSlot();
            if (counter >= 20) {
                clearInterval(interval);
                if (slots.every(slot => slot === 7)) {
                    alert('おめでとう！');
                    window.location.href = 'chinonono.jpg'; // 遷移先の画像
                } else {
                    alert('残念！');
                }
            }
        }, 100); // スロットの回転を100msごとに更新
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

    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
    lotteryButton.addEventListener('click', startLottery);
});




















