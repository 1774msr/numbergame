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
            button.addEventListener('touchstart', handleTouchStart);
            button.addEventListener('touchmove', handleTouchMove);
            button.addEventListener('touchend', handleTouchEnd);
            numberContainer.appendChild(button);
        }
    };

    let currentButton = null;
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event) => {
        currentButton = event.target;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        if (currentButton) {
            const dx = event.touches[0].clientX - startX;
            const dy = event.touches[0].clientY - startY;
            currentButton.style.transform = `translate(${dx}px, ${dy}px)`;
        }
    };

    const handleTouchEnd = (event) => {
        if (currentButton) {
            const dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            if (dropTarget && dropTarget !== currentButton && dropTarget.parentElement === numberContainer) {
                const buttonIndex = parseInt(currentButton.dataset.index, 10);
                const dropTargetIndex = parseInt(dropTarget.dataset.index, 10);
                [currentButton.dataset.index, dropTarget.dataset.index] = [dropTarget.dataset.index, currentButton.dataset.index];
                [currentButton.textContent, dropTarget.textContent] = [dropTarget.textContent, currentButton.textContent];
            }
            currentButton.style.transform = '';
            currentButton = null;
        }
    };

    const checkSequence = () => {
        checkButtonClickCount++;
        if (checkButtonClickCount >= 5) {
            checkButtonClickCount = 0;
            const confirmation = confirm("障がい者？");
            if (confirmation) {
                alert("残念ですが、女子中学生と遊ぶことは現実的に不可能です。\nチノちゃんのまんすじは、この世に必ず存在しますが、我々がそれを観測するためには、シンギュラリティが必要です");
                return;
            }
        }

        const currentSequence = Array.from(numberContainer.children)
            .map(button => parseInt(button.dataset.index, 10));
        if (JSON.stringify(currentSequence) === JSON.stringify(correctSequence)) {
            const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            result.textContent = '正解！';
            clearTimeDisplay.textContent = `クリアタイム: ${elapsedTime}秒`;
            clearMessage.style.display = 'flex';
            chinoImage.style.display = 'block';
            clearMessage.appendChild(clearTimeDisplay);
            clearMessage.style.zIndex = '10';
            clearMessage.style.opacity = '1';
            clearMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            clearMessage.style.display = 'flex';
            clearMessage.style.alignItems = 'center';
            clearMessage.style.justifyContent = 'center';
            clearMessage.style.textAlign = 'center';
        } else {
            result.textContent = 'もう一度やり直してください。';
        }
    };

    const startGame = (number) => {
        buttonCount = number;
        correctSequence = generateRandomSequence(buttonCount);
        renderButtons();
        startTime = Date.now();
        elapsedTimeDisplay.textContent = '計測開始: ' + new Date().toLocaleTimeString();
        startScreen.style.display = 'none';
        numberContainer.style.display = 'flex';
        checkButton.style.display = 'block';
        clearMessage.style.display = 'none';
    };

    numberChoiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = parseInt(button.dataset.number, 10);
            startGame(number);
        });
    });

    lotteryButton.addEventListener('click', () => {
        const number = parseInt(document.querySelector('.number-choice[data-number]').dataset.number, 10);
        startGame(number);
    });

    checkButton.addEventListener('click', checkSequence);

    restartButton.addEventListener('click', () => {
        location.reload();
    });

    // スロットマシンのサンプル表示
    slotMachine.textContent = 'スロットマシン: 1234';

});
