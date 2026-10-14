/**
 * Main entry point - Event listeners and initialization
 */

import { Visualizer } from './visualizer.js';
import { ALGORITHMS, generateRandomArray } from './algorithms.js';

// Initialize visualizer
const visualizer = new Visualizer();

// DOM Elements - Controls
const algorithmSelect = document.getElementById('algorithm-select');
const arraySizeSlider = document.getElementById('array-size');
const sizeValue = document.getElementById('size-value');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnStep = document.getElementById('btn-step');
const btnReset = document.getElementById('btn-reset');

// Algorithm Selection
algorithmSelect.addEventListener('change', (e) => {
    visualizer.setAlgorithm(e.target.value);
    updateButtonStates();
});

// Array Size
arraySizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    sizeValue.textContent = size;
});

arraySizeSlider.addEventListener('change', (e) => {
    const size = parseInt(e.target.value);
    visualizer.generateNewArray(size);
    updateButtonStates();
});

// Speed Control
speedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    speedValue.textContent = speed;
    visualizer.setSpeed(speed);
});

// Play Button
btnPlay.addEventListener('click', () => {
    visualizer.play();
    updateButtonStates(true);
});

// Pause Button
btnPause.addEventListener('click', () => {
    visualizer.pause();
    updateButtonStates(false);
});

// Step Button
btnStep.addEventListener('click', async () => {
    const hasMore = await visualizer.step();
    if (!hasMore) {
        updateButtonStates(false);
    }
});

// Reset Button
btnReset.addEventListener('click', () => {
    visualizer.reset();
    updateButtonStates(false);
});

// Update button states
function updateButtonStates(isPlaying = false) {
    btnPlay.disabled = isPlaying;
    btnPause.disabled = !isPlaying;
    btnStep.disabled = isPlaying;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            e.preventDefault();
            if (visualizer.isPlaying && !visualizer.isPaused) {
                visualizer.pause();
                updateButtonStates(false);
            } else {
                visualizer.play();
                updateButtonStates(true);
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            visualizer.step();
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            visualizer.reset();
            updateButtonStates(false);
            break;
    }
});

// Initial button state
updateButtonStates(false);

console.log('🎨 Sorting Visualizer initialized!');
console.log('Keyboard shortcuts: Space (play/pause), → (step), R (reset)');
// cleanup: minor code tweak
