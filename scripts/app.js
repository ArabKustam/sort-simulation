/**
 * Sorting Visualizer - All-in-one script
 */

// =============================================
// ALGORITHMS DATA (Python code)
// =============================================

const ALGORITHMS = {
    bubble: {
        name: 'Bubble Sort',
        complexity: 'O(n²)',
        description: 'Простой алгоритм: проходим по списку, сравнивая соседние элементы.',
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            # Сравниваем соседние элементы
            if arr[j] > arr[j + 1]:
                # Меняем местами
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
    },

    selection: {
        name: 'Selection Sort',
        complexity: 'O(n²)',
        description: 'Находит минимальный элемент и перемещает его в начало.',
        code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        # Находим минимальный элемент
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Меняем местами
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },

    insertion: {
        name: 'Insertion Sort',
        complexity: 'O(n²)',
        description: 'Вставляет каждый элемент на правильную позицию.',
        code: `def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        # Запоминаем текущий элемент
        key = arr[i]
        j = i - 1
        # Сдвигаем элементы больше key
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        # Вставляем key
        arr[j + 1] = key
    return arr`
    },

    merge: {
        name: 'Merge Sort',
        complexity: 'O(n log n)',
        description: 'Делит массив пополам, сортирует части и сливает.',
        code: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        # Рекурсивно сортируем
        merge_sort(left)
        merge_sort(right)
        # Сливаем
        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1`
    },

    quick: {
        name: 'Quick Sort',
        complexity: 'O(n log n)',
        description: 'Выбирает опорный элемент и разделяет массив.',
        code: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    # Опорный элемент (последний)
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
    }
};

// =============================================
// GENERATOR FUNCTIONS (for step-by-step)
// =============================================

function* bubbleSortGenerator(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield { type: 'compare', indices: [j, j + 1], line: 5, description: `Сравниваем arr[${j}]=${arr[j]} и arr[${j + 1}]=${arr[j + 1]}` };
            if (arr[j] > arr[j + 1]) {
                yield { type: 'swap', indices: [j, j + 1], line: 7, description: `${arr[j]} > ${arr[j + 1]}, меняем местами` };
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        yield { type: 'sorted', indices: [n - i - 1], line: 8, description: `Элемент arr[${n - i - 1}] отсортирован` };
    }
    yield { type: 'sorted', indices: [0], line: 9, description: 'Сортировка завершена!' };
}

function* selectionSortGenerator(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        yield { type: 'pivot', indices: [i], line: 4, description: `Ищем минимум с позиции ${i}` };
        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [j, minIdx], line: 6, description: `Сравниваем arr[${j}]=${arr[j]} с мин. arr[${minIdx}]=${arr[minIdx]}` };
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            yield { type: 'swap', indices: [i, minIdx], line: 9, description: `Меняем arr[${i}]=${arr[i]} с arr[${minIdx}]=${arr[minIdx]}` };
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
        yield { type: 'sorted', indices: [i], line: 10, description: `Элемент arr[${i}] на месте` };
    }
    yield { type: 'sorted', indices: [n - 1], line: 11, description: 'Сортировка завершена!' };
}

function* insertionSortGenerator(arr) {
    const n = arr.length;
    yield { type: 'sorted', indices: [0], line: 2, description: 'Первый элемент отсортирован' };
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        yield { type: 'pivot', indices: [i], line: 4, description: `Берём элемент arr[${i}]=${key}` };
        while (j >= 0 && arr[j] > key) {
            yield { type: 'compare', indices: [j, j + 1], line: 6, description: `arr[${j}]=${arr[j]} > ${key}, сдвигаем` };
            arr[j + 1] = arr[j];
            yield { type: 'swap', indices: [j, j + 1], line: 7, description: `Сдвигаем arr[${j}]` };
            j--;
        }
        arr[j + 1] = key;
        yield { type: 'sorted', indices: Array.from({ length: i + 1 }, (_, idx) => idx), line: 9, description: `Вставили ${key}` };
    }
}

function* mergeSortGenerator(arr) {
    function* helper(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            yield { type: 'compare', indices: [left, mid], line: 3, description: `Делим: [${left}...${mid}]` };
            yield* helper(left, mid);
            yield { type: 'compare', indices: [mid + 1, right], line: 5, description: `Делим: [${mid + 1}...${right}]` };
            yield* helper(mid + 1, right);
            yield* merge(left, mid, right);
        }
    }
    function* merge(left, mid, right) {
        const L = arr.slice(left, mid + 1);
        const R = arr.slice(mid + 1, right + 1);
        yield { type: 'pivot', indices: Array.from({ length: right - left + 1 }, (_, i) => left + i), line: 9, description: `Сливаем [${left}...${right}]` };
        let i = 0, j = 0, k = left;
        while (i < L.length && j < R.length) {
            yield { type: 'compare', indices: [k], line: 11, description: `Сравниваем L[${i}]=${L[i]} и R[${j}]=${R[j]}` };
            arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        }
        while (i < L.length) { arr[k++] = L[i++]; }
        while (j < R.length) { arr[k++] = R[j++]; }
    }
    yield* helper(0, arr.length - 1);
    yield { type: 'sorted', indices: Array.from({ length: arr.length }, (_, i) => i), line: 16, description: 'Сортировка завершена!' };
}

function* quickSortGenerator(arr) {
    function* helper(low, high) {
        if (low < high) {
            const pi = yield* partition(low, high);
            yield { type: 'sorted', indices: [pi], line: 4, description: `Опорный ${arr[pi]} на месте` };
            yield* helper(low, pi - 1);
            yield* helper(pi + 1, high);
        } else if (low === high && low >= 0) {
            yield { type: 'sorted', indices: [low], line: 5, description: `Элемент ${arr[low]} отсортирован` };
        }
    }
    function* partition(low, high) {
        const pivot = arr[high];
        yield { type: 'pivot', indices: [high], line: 9, description: `Опорный: arr[${high}]=${pivot}` };
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield { type: 'compare', indices: [j, high], line: 11, description: `Сравниваем arr[${j}]=${arr[j]} с ${pivot}` };
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    yield { type: 'swap', indices: [i, j], line: 13, description: `Меняем arr[${i}] и arr[${j}]` };
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
            }
        }
        if (i + 1 !== high) {
            yield { type: 'swap', indices: [i + 1, high], line: 14, description: `Ставим опорный на ${i + 1}` };
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        }
        return i + 1;
    }
    yield* helper(0, arr.length - 1);
    yield { type: 'sorted', indices: Array.from({ length: arr.length }, (_, i) => i), line: 15, description: 'Сортировка завершена!' };
}

const GENERATORS = {
    bubble: bubbleSortGenerator,
    selection: selectionSortGenerator,
    insertion: insertionSortGenerator,
    merge: mergeSortGenerator,
    quick: quickSortGenerator
};

// =============================================
// VISUALIZER CLASS
// =============================================

class Visualizer {
    constructor() {
        this.arrayContainer = document.getElementById('array-container');
        this.codeDisplay = document.getElementById('code-display').querySelector('code');
        this.stepDescription = document.getElementById('step-description');
        this.algorithmName = document.getElementById('algorithm-name');
        this.complexityDisplay = document.getElementById('algorithm-complexity');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');

        this.array = [];
        this.originalArray = [];
        this.generator = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 50;
        this.animationId = null;
        this.currentAlgorithm = 'bubble';
        this.sortedIndices = new Set();
        this.comparisons = 0;
        this.swaps = 0;
        this.viewMode = 'bars'; // 'bars' or 'numbers'

        this.init();
    }

    init() {
        this.setAlgorithm('bubble');
        this.generateNewArray(15);
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.renderArray();
    }

    setAlgorithm(algorithmKey) {
        this.currentAlgorithm = algorithmKey;
        const algo = ALGORITHMS[algorithmKey];
        this.algorithmName.textContent = algo.name;
        this.complexityDisplay.innerHTML = `Сложность: <strong>${algo.complexity}</strong>`;
        this.renderCode(algo.code);
        this.reset();
    }

    renderCode(code) {
        const lines = code.split('\n');
        const highlighted = lines.map((line, index) => {
            const hl = this.highlightPython(line);
            return `<span class="code-line" data-line="${index + 1}">${hl}</span>`;
        }).join('\n');
        this.codeDisplay.innerHTML = highlighted;
    }

    highlightPython(line) {
        let result = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        result = result.replace(/(#.*)$/gm, '<span class="comment">$1</span>');
        const keywords = ['def', 'for', 'in', 'if', 'else', 'elif', 'while', 'return', 'range', 'len', 'and', 'or', 'not', 'True', 'False'];
        keywords.forEach(kw => {
            result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="keyword">$1</span>');
        });
        result = result.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        result = result.replace(/(\w+)(?=\()/g, '<span class="function">$1</span>');
        return result;
    }

    generateNewArray(size) {
        this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
        this.originalArray = [...this.array];
        this.renderArray();
        this.reset();
    }

    renderArray() {
        this.arrayContainer.innerHTML = '';
        const maxValue = Math.max(...this.array);

        this.array.forEach((value, index) => {
            const el = document.createElement('div');

            if (this.viewMode === 'bars') {
                el.className = 'bar';
                el.style.height = `${(value / maxValue) * 100}%`;
                const span = document.createElement('span');
                span.className = 'bar__value';
                span.textContent = value;
                el.appendChild(span);
            } else {
                el.className = 'num-box';
                el.textContent = value;
            }

            el.dataset.value = value;
            el.dataset.index = index;

            if (this.sortedIndices.has(index)) {
                el.classList.add(this.viewMode === 'bars' ? 'bar--sorted' : 'num-box--sorted');
            }

            this.arrayContainer.appendChild(el);
        });
    }

    updateArray(step) {
        const elements = this.arrayContainer.querySelectorAll(this.viewMode === 'bars' ? '.bar' : '.num-box');
        const maxValue = Math.max(...this.array);
        const prefix = this.viewMode === 'bars' ? 'bar' : 'num-box';

        elements.forEach((el, index) => {
            el.className = prefix;
            el.dataset.value = this.array[index];

            if (this.viewMode === 'bars') {
                el.style.height = `${(this.array[index] / maxValue) * 100}%`;
                let span = el.querySelector('.bar__value');
                if (!span) {
                    span = document.createElement('span');
                    span.className = 'bar__value';
                    el.appendChild(span);
                }
                span.textContent = this.array[index];
            } else {
                el.textContent = this.array[index];
            }

            if (this.sortedIndices.has(index)) {
                el.classList.add(`${prefix}--sorted`);
            }
        });

        if (step) {
            const { type, indices } = step;
            indices.forEach(idx => {
                if (idx >= 0 && idx < elements.length) {
                    elements[idx].classList.remove(`${prefix}--sorted`);
                    switch (type) {
                        case 'compare': elements[idx].classList.add(`${prefix}--comparing`); break;
                        case 'swap': elements[idx].classList.add(`${prefix}--swapping`); break;
                        case 'sorted':
                            elements[idx].classList.add(`${prefix}--sorted`);
                            this.sortedIndices.add(idx);
                            break;
                        case 'pivot': elements[idx].classList.add(`${prefix}--pivot`); break;
                    }
                }
            });
            if (type === 'compare') this.comparisons++;
            if (type === 'swap') this.swaps++;
            this.updateStats();
        }
    }

    highlightCodeLine(lineNumber) {
        const lines = this.codeDisplay.querySelectorAll('.code-line');
        lines.forEach(line => line.classList.remove('code-line--active'));
        if (lineNumber > 0 && lineNumber <= lines.length) {
            const active = lines[lineNumber - 1];
            active.classList.add('code-line--active');
            active.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateDescription(text) { this.stepDescription.textContent = text; }
    updateStats() {
        this.comparisonsDisplay.textContent = this.comparisons;
        this.swapsDisplay.textContent = this.swaps;
    }

    reset() {
        this.stop();
        this.array = [...this.originalArray];
        this.generator = null;
        this.sortedIndices.clear();
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStats();
        this.renderArray();
        this.updateDescription('Нажмите "Запуск" или "Шаг" для начала');
        const lines = this.codeDisplay.querySelectorAll('.code-line');
        lines.forEach(line => line.classList.remove('code-line--active'));
    }

    initGenerator() {
        if (!this.generator) {
            this.generator = GENERATORS[this.currentAlgorithm](this.array);
        }
    }

    step() {
        this.initGenerator();
        const result = this.generator.next();
        if (result.done) {
            this.isPlaying = false;
            this.updateDescription('✅ Сортировка завершена!');
            return false;
        }
        const stepData = result.value;
        this.updateArray(stepData);
        this.highlightCodeLine(stepData.line);
        this.updateDescription(stepData.description);
        return true;
    }

    play() {
        if (this.isPlaying && !this.isPaused) return;
        this.initGenerator();
        this.isPlaying = true;
        this.isPaused = false;
        const animate = () => {
            if (!this.isPlaying || this.isPaused) return;
            const hasMore = this.step();
            if (hasMore && this.isPlaying && !this.isPaused) {
                this.animationId = setTimeout(animate, this.speed);
            } else {
                this.isPlaying = false;
                updateButtonStates(false);
            }
        };
        animate();
    }

    pause() {
        this.isPaused = true;
        if (this.animationId) clearTimeout(this.animationId);
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.animationId) clearTimeout(this.animationId);
    }

    setSpeed(ms) { this.speed = ms; }
}

// =============================================
// INITIALIZATION
// =============================================

let visualizer;

document.addEventListener('DOMContentLoaded', () => {
    visualizer = new Visualizer();

    document.getElementById('algorithm-select').addEventListener('change', e => {
        visualizer.setAlgorithm(e.target.value);
        updateButtonStates(false);
    });

    document.getElementById('view-mode').addEventListener('change', e => {
        visualizer.setViewMode(e.target.value);
    });

    document.getElementById('array-size').addEventListener('input', e => {
        document.getElementById('size-value').textContent = e.target.value;
    });
    document.getElementById('array-size').addEventListener('change', e => {
        visualizer.generateNewArray(parseInt(e.target.value));
        updateButtonStates(false);
    });

    document.getElementById('speed').addEventListener('input', e => {
        document.getElementById('speed-value').textContent = e.target.value;
        visualizer.setSpeed(parseInt(e.target.value));
    });

    document.getElementById('btn-play').addEventListener('click', () => {
        visualizer.play();
        updateButtonStates(true);
    });
    document.getElementById('btn-pause').addEventListener('click', () => {
        visualizer.pause();
        updateButtonStates(false);
    });
    document.getElementById('btn-step').addEventListener('click', () => {
        if (!visualizer.step()) updateButtonStates(false);
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
        visualizer.reset();
        updateButtonStates(false);
    });

    document.addEventListener('keydown', e => {
        if (e.key === ' ') {
            e.preventDefault();
            if (visualizer.isPlaying && !visualizer.isPaused) {
                visualizer.pause();
                updateButtonStates(false);
            } else {
                visualizer.play();
                updateButtonStates(true);
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            visualizer.step();
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            visualizer.reset();
            updateButtonStates(false);
        }
    });

    console.log('🎨 Sorting Visualizer ready!');
});

function updateButtonStates(isPlaying) {
    document.getElementById('btn-play').disabled = isPlaying;
    document.getElementById('btn-pause').disabled = !isPlaying;
    document.getElementById('btn-step').disabled = isPlaying;
}
