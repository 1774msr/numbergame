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
    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2', '#FF4500', '#00BFFF']; // 異なる色

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

    let initialTouch = null;

    const handleTouchStart = (event) => {
        initialTouch = event.touches[0];
        const button = event.target;
        button.classList.add('lift');
    };

    const handleTouchMove = (event) => {
        if (!initialTouch) return;

        const touch = event.touches[0];
        const button = event.target;

        // ボタンをドラッグするための位置を設定
        button.style.position = 'absolute';
        button.style.left = `${touch.pageX - button.clientWidth / 2}px`;
        button.style.top = `${touch.pageY - button.clientHeight / 2}px`;
    };

    const handleTouchEnd = (event) => {
        const button = event.target;
        button.classList.remove('lift');
        button.style.position = '';
        button.style.left = '';
        button.style.top = '';

        // ボタンがドロップされた位置に合わせてデータを更新
        const dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        if (dropTarget && dropTarget !== button && dropTarget.parentElement === numberContainer) {
            const buttonIndex = parseInt(button.dataset.index, 10);
            const dropTargetIndex = parseInt(dropTarget.dataset.index, 10);
            [button.dataset.index, dropTarget.dataset.index] = [dropTarget.dataset.index, button.dataset.index];
            [button.textContent, dropTarget.textContent] = [dropTarget.textContent, button.textContent];
        }
    };

    const checkSequence = () => {
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


