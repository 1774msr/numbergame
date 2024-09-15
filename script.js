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
    let draggedButton = null;
    let startTouchX = 0;

    const textArray = ['1', '2', '3', '4', '5', '6', '7'];
    const colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2'];

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
            button.style.backgroundColor = colors[i]; // 色を設定
            button.addEventListener('touchstart', handleTouchStart);
            button.addEventListener('touchmove', handleTouchMove);
            button.addEventListener('touchend', handleTouchEnd);
            numberContainer.appendChild(button);
        }
    };

    const handleTouchStart = (event) => {
        draggedButton = event.target;
        draggedButton.classList.add('dragging');
        startTouchX = event.touches[0].clientX;
    };

    const handleTouchMove = (event) => {
        const touch = event.touches[0];
        const dx = touch.clientX - startTouchX;
        if (Math.abs(dx) > 20) { // スワイプの閾値
            if (draggedButton) {
                const nextButton = findAdjacentButton(draggedButton, dx > 0 ? 'right' : 'left');
                if (nextButton) {
                    swapButtons(draggedButton, nextButton);
                    startTouchX = touch.clientX; // スワイプのスピードを調整
                }
            }
        }
    };

    const handleTouchEnd = () => {
        if (draggedButton) {
            draggedButton.classList.remove('dragging');
            draggedButton = null;
        }
    };

    const findAdjacentButton = (button, direction) => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const index = buttons.indexOf(button);
        if (direction === 'right' && index < buttons.length - 1) {
            return buttons[index + 1];
        } else if (direction === 'left' && index > 0) {
            return buttons[index - 1];
        }
        return null;
    };

    const swapButtons = (button1, button2) => {
        const tempIndex = button1.dataset.index;
        button1.dataset.index = button2.dataset.index;
        button2.dataset.index = tempIndex;
        updateButtonText();
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

           




