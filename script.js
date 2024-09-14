document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('number-container');
    const checkButton = document.getElementById('check-button');
    const result = document.getElementById('result');
    const clearMessage = document.getElementById('clear-message');
    const restartButton = document.getElementById('restart-button');
    const chinoImage = document.getElementById('chino-image');

    let firstButton = null; // 最初にタップされたボタン

    // ランダムな並び順を生成
    const generateRandomSequence = () => {
        const sequence = [...Array(5).keys()].map(n => n + 1);
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
        for (let i = 1; i <= 5; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.value = i;
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
            const tempValue = clickedButton.dataset.value;
            clickedButton.dataset.value = firstButton.dataset.value;
            firstButton.dataset.value = tempValue;

            updateButtonText();

            firstButton = null; // リセット
        }
    };

    const updateButtonText = () => {
        const buttons = numberContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.textContent = button.dataset.value;
        });
    };

    const checkSequence = () => {
        const buttons = Array.from(numberContainer.querySelectorAll('button'));
        const userSequence = buttons.map(button => parseInt(button.dataset.value, 10));
        const correctCount = userSequence.reduce((count, value, index) => {
            return count + (value === correctSequence[index] ? 1 : 0);
        }, 0);
        
        if (correctCount === 5) {
            // ゲームクリア時の処理
            numberContainer.style.display = 'none';
            checkButton.style.display = 'none';
            result.style.display = 'none';
            clearMessage.style.display = 'flex'; // 画像を表示する
        } else {
            result.textContent = `正しい位置にある数字の数: ${correctCount}`;
        }
    };

    const restartGame = () => {
        clearMessage.style.display = 'none';
        numberContainer.style.display = 'flex';
        checkButton.style.display = 'block';
        result.style.display = 'block';
        correctSequence = generateRandomSequence();
        renderButtons();
    };

    renderButtons();

    checkButton.addEventListener('click', checkSequence);
    restartButton.addEventListener('click', restartGame);
});
