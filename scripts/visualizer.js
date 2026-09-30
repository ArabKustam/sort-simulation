/**
 * Visualizer class for rendering sorting animations and code highlighting
 */

import { ALGORITHMS, generateRandomArray } from './algorithms.js';

export class Visualizer {
    constructor() {
        // DOM Elements
        this.arrayContainer = document.getElementById('array-container');
        this.codeDisplay = document.getElementById('code-display').querySelector('code');
        this.stepDescription = document.getElementById('step-description');
        this.algorithmName = document.getElementById('algorithm-name');
        this.complexityDisplay = document.getElementById('algorithm-complexity');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');

        // State
        this.array = [];
        this.originalArray = [];
        this.generator = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 50;
        this.animationId = null;
        this.currentAlgorithm = 'bubble';
        this.sortedIndices = new Set();

        // Stats
        this.comparisons = 0;
        this.swaps = 0;

        // Initialize
        this.init();
    }

    init() {
        this.setAlgorithm('bubble');
        this.generateNewArray(20);
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
            const highlightedLine = this.highlightSyntax(line);
            return `<span class="code-line" data-line="${index + 1}">${highlightedLine}</span>`;
        }).join('\n');

        this.codeDisplay.innerHTML = highlighted;
    }

    highlightSyntax(line) {
        // Escape HTML
        let result = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Comments
        result = result.replace(/(\/\/.*)$/gm, '<span class="comment">$1</span>');

        // Keywords
        const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'break', 'continue'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            result = result.replace(regex, '<span class="keyword">$1</span>');
        });

        // Numbers
        result = result.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

        // Strings
        result = result.replace(/(['"`])([^'"`]*)\1/g, '<span class="string">$1$2$1</span>');

        // Function calls
        result = result.replace(/(\w+)(?=\()/g, '<span class="function">$1</span>');

        return result;
    }

    generateNewArray(size) {
        this.array = generateRandomArray(size);
        this.originalArray = [...this.array];
        this.renderBars();
        this.reset();
    }

    renderBars() {
        this.arrayContainer.innerHTML = '';
        const maxValue = Math.max(...this.array);

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.dataset.value = value;
            bar.dataset.index = index;

            if (this.sortedIndices.has(index)) {
                bar.classList.add('bar--sorted');
            }

            this.arrayContainer.appendChild(bar);
        });
    }

    updateBars(step) {
        const bars = this.arrayContainer.querySelectorAll('.bar');
        const maxValue = Math.max(...this.array);

        // Reset all bar states except sorted
        bars.forEach((bar, index) => {
            bar.className = 'bar';
            bar.style.height = `${(this.array[index] / maxValue) * 100}%`;
            bar.dataset.value = this.array[index];

            if (this.sortedIndices.has(index)) {
                bar.classList.add('bar--sorted');
            }
        });

        // Apply current step highlighting
        if (step) {
            const { type, indices } = step;

            indices.forEach(idx => {
                if (idx >= 0 && idx < bars.length) {
                    bars[idx].classList.remove('bar--sorted');

                    switch (type) {
                        case 'compare':
                            bars[idx].classList.add('bar--comparing');
                            break;
                        case 'swap':
                            bars[idx].classList.add('bar--swapping');
                            this.swaps++;
                            break;
                        case 'sorted':
                            bars[idx].classList.add('bar--sorted');
                            this.sortedIndices.add(idx);
                            break;
                        case 'pivot':
                            bars[idx].classList.add('bar--pivot');
                            break;
                    }
                }
            });

            if (type === 'compare') {
                this.comparisons++;
            }

            this.updateStats();
        }
    }

    highlightCodeLine(lineNumber) {
        const lines = this.codeDisplay.querySelectorAll('.code-line');

        lines.forEach(line => {
            line.classList.remove('code-line--active');
        });

        if (lineNumber > 0 && lineNumber <= lines.length) {
            const activeLine = lines[lineNumber - 1];
            activeLine.classList.add('code-line--active');

            // Scroll to active line
            activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateDescription(text) {
        this.stepDescription.textContent = text;
    }

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
        this.renderBars();
        this.updateDescription('Нажмите "Запуск" или "Шаг" для начала');

        // Reset code highlighting
        const lines = this.codeDisplay.querySelectorAll('.code-line');
        lines.forEach(line => line.classList.remove('code-line--active'));
    }

    initGenerator() {
        if (!this.generator) {
            const algo = ALGORITHMS[this.currentAlgorithm];
            // Pass reference to this.array so generator modifies it directly
            this.generator = algo.generator(this.array);
        }
    }

    async step() {
        this.initGenerator();

        const result = this.generator.next();

        if (result.done) {
            this.isPlaying = false;
            this.updateDescription('✅ Сортировка завершена!');
            return false;
        }

        const stepData = result.value;

        // Array is modified by the generator directly via reference
        this.updateBars(stepData);
        this.highlightCodeLine(stepData.line);
        this.updateDescription(stepData.description);

        return true;
    }

    async play() {
        if (this.isPlaying && !this.isPaused) return;

        this.initGenerator();
        this.isPlaying = true;
        this.isPaused = false;

        const animate = async () => {
            if (!this.isPlaying || this.isPaused) return;

            const hasMore = await this.step();

            if (hasMore && this.isPlaying && !this.isPaused) {
                this.animationId = setTimeout(animate, this.speed);
            } else {
                this.isPlaying = false;
            }
        };

        animate();
    }

    pause() {
        this.isPaused = true;
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }

    setSpeed(ms) {
        this.speed = ms;
    }
}
 
