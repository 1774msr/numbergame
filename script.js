document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('number-container');
    const checkButton = document.getElementById('check-button');
    const result = document.getElementById('result');

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
            button.draggable = true;
            button.dataset.value = i;
            button.addEventListener('dragstart', handleDragStart);
            button.addEventListener('dragover', handleDragOver);
            button.addEventListener('drop', handleDrop);
            numberContainer.appendChild(button);
        }
    };

    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', event.target.dataset.value);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const draggedValue = event.dataTransfer.getData('text/plain');
        const droppedButton = event.target;

        if (droppedButton.tagName === 'BUTTON') {
            const draggedButton = document.querySelector(`button[data-value="${draggedValue}"]`);
            const tempValue = droppedButton.dataset.value;
            droppedButton.dataset.value = draggedValue;
            draggedButton.dataset.value = tempValue;

            updateButtonText();
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
        result.textContent = `正しい位置にある数字の数: ${correctCount}`;
    };

    renderButtons();

    checkButton.addEventListener('click', checkSequence);
});
