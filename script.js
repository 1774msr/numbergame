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
    let checkButtonClickCount = 0;

    const textArray = ['1', '2', '3', '4', '5', '6', '7'];
    const colorArray = ['#FF5733', '#33FF57', '#3357FF', '#F733FF', '#FF33A6', '#33F7FF', '#F7FF33'];

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
            button.style.backgroundColor = colorArray[i];
            button.classList.add('draggable');
            button.addEventListener('touchstart', handleTouchStart);
            button.addEventListener('touchmove', handleTouchMove);
            button.addEventListener('touchend', handleTouchEnd);
            numberContainer.appendChild(button);
        }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        firstButton = event.target;
        firstButton.style.zIndex = '10'; // 前面に表示する
        firstButton.style.transform = 'scale(1.1)'; // 持ち上げている感じを出す
        firstButton.classList.add('dragging'); // ドラッグ中のクラスを追加
    };

    const handleTouchMove = (event) => {
        if (!firstButton) return;
        const touch = event.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        firstButton.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
    };

    const handleTouchEnd = (event) => {
        if (!firstButton) return;

        const buttons = numberContainer.querySelectorAll('button');
        const targetButton = Array.from(buttons).find(button => 
            button !== firstButton && isTouchInsideButton(event.changedTouches[0], button)
        );

        if (targetButton) {
            const firstIndex = parseInt(firstButton.dataset.index, 10);
            const targetIndex = parseInt(targetButton.dataset.index, 10);

            firstButton.dataset.index = targetIndex;
            targetButton.dataset.index = firstIndex;

            updateButtonText();
        }

        firstButton.style.transform = 'scale(1)'; // 元のサイズに戻す
        firstButton.style.zIndex = ''; // z-indexをリセット
        firstButton.classList.remove('dragging'); // ドラッグ中のクラスを削除
        firstButton = null;
    };

    const isTouchInsideButton = (touch, button) => {
        const rect = button.getBoundingClientRect();
        return (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        );
    };

    const updateButtonText = () => {
        const buttons = numberContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.textContent = textArray[parseInt(button.dataset.index, 10)];
            button.style.backgroundColor = colorArray[parseInt(button.dataset.index, 10)];
        });
    };

    const checkSequence = () => {
        checkButtonClickCount++;
        if (checkButtonClickCount === 5) {
            const confirmation = confirm('障がい者？');
            if (confirmation) {
                alert('残念ですが、女子中学生と遊ぶことは現実的に不可能です。チノちゃんのまんすじは、この世に必ず存在しますが、我々がそれを観測するためには、シンギュラリティが必要です');
            } else {
                return;
            }
            checkButtonClickCount = 0;
        }

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

