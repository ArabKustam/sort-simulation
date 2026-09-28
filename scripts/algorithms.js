/**
 * Sorting Algorithms with Step-by-Step Generators
 * Each generator yields objects describing the current step for visualization
 */

// Algorithm metadata with code and complexity info
export const ALGORITHMS = {
    bubble: {
        name: 'Bubble Sort',
        complexity: 'O(n²)',
        description: 'Простой алгоритм, который многократно проходит по списку, сравнивая соседние элементы и меняя их местами, если они в неправильном порядке.',
        code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Сравниваем соседние элементы
            if (arr[j] > arr[j + 1]) {
                // Меняем местами
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
        generator: bubbleSortGenerator
    },
    
    selection: {
        name: 'Selection Sort',
        complexity: 'O(n²)',
        description: 'Алгоритм находит минимальный элемент в неотсортированной части и перемещает его в начало.',
        code: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        // Находим минимальный элемент
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // Меняем местами с первым неотсортированным
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    return arr;
}`,
        generator: selectionSortGenerator
    },
    
    insertion: {
        name: 'Insertion Sort',
        complexity: 'O(n²)',
        description: 'Алгоритм строит отсортированный массив по одному элементу за раз, вставляя каждый элемент на правильную позицию.',
        code: `function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        // Запоминаем текущий элемент
        let key = arr[i];
        let j = i - 1;
        // Сдвигаем элементы больше key
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        // Вставляем key на правильную позицию
        arr[j + 1] = key;
    }
    return arr;
}`,
        generator: insertionSortGenerator
    },
    
    merge: {
        name: 'Merge Sort',
        complexity: 'O(n log n)',
        description: 'Алгоритм "разделяй и властвуй": делит массив пополам, сортирует части и сливает их.',
        code: `function mergeSort(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        // Сортируем левую половину
        mergeSort(arr, left, mid);
        // Сортируем правую половину
        mergeSort(arr, mid + 1, right);
        // Сливаем отсортированные половины
        merge(arr, left, mid, right);
    }
}

function merge(arr, left, mid, right) {
    // Создаём временные массивы
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    // Сливаем обратно в arr
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    // Копируем оставшиеся элементы
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];
}`,
        generator: mergeSortGenerator
    },
    
    quick: {
        name: 'Quick Sort',
        complexity: 'O(n log n)',
        description: 'Алгоритм выбирает опорный элемент и разделяет массив на элементы меньше и больше опорного.',
        code: `function quickSort(arr, low, high) {
    if (low < high) {
        // Находим позицию опорного элемента
        const pi = partition(arr, low, high);
        // Сортируем элементы до и после опорного
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    // Опорный элемент (последний)
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        // Если элемент меньше опорного
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    // Ставим опорный на правильную позицию
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
        generator: quickSortGenerator
    }
};

// =============================================
// BUBBLE SORT GENERATOR
// =============================================
function* bubbleSortGenerator(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Comparing
            yield {
                type: 'compare',
                indices: [j, j + 1],
                line: 5,
                description: `Сравниваем arr[${j}]=${arr[j]} и arr[${j + 1}]=${arr[j + 1]}`
            };
            
            if (arr[j] > arr[j + 1]) {
                // Swapping
                yield {
                    type: 'swap',
                    indices: [j, j + 1],
                    line: 7,
                    description: `${arr[j]} > ${arr[j + 1]}, меняем местами`
                };
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        
        // Mark as sorted
        yield {
            type: 'sorted',
            indices: [n - i - 1],
            line: 9,
            description: `Элемент arr[${n - i - 1}]=${arr[n - i - 1]} отсортирован`
        };
    }
    
    // Mark first element as sorted
    yield {
        type: 'sorted',
        indices: [0],
        line: 11,
        description: 'Сортировка завершена!'
    };
    
    return arr;
}

// =============================================
// SELECTION SORT GENERATOR
// =============================================
function* selectionSortGenerator(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        yield {
            type: 'pivot',
            indices: [i],
            line: 4,
            description: `Начинаем поиск минимума с позиции ${i}`
        };
        
        for (let j = i + 1; j < n; j++) {
            yield {
                type: 'compare',
                indices: [j, minIdx],
                line: 6,
                description: `Сравниваем arr[${j}]=${arr[j]} с минимумом arr[${minIdx}]=${arr[minIdx]}`
            };
            
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                yield {
                    type: 'pivot',
                    indices: [minIdx],
                    line: 7,
                    description: `Новый минимум: arr[${minIdx}]=${arr[minIdx]}`
                };
            }
        }
        
        if (minIdx !== i) {
            yield {
                type: 'swap',
                indices: [i, minIdx],
                line: 11,
                description: `Меняем arr[${i}]=${arr[i]} с минимумом arr[${minIdx}]=${arr[minIdx]}`
            };
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
        
        yield {
            type: 'sorted',
            indices: [i],
            line: 13,
            description: `Элемент arr[${i}]=${arr[i]} на своём месте`
        };
    }
    
    yield {
        type: 'sorted',
        indices: [n - 1],
        line: 15,
        description: 'Сортировка завершена!'
    };
    
    return arr;
}

// =============================================
// INSERTION SORT GENERATOR
// =============================================
function* insertionSortGenerator(arr) {
    const n = arr.length;
    
    yield {
        type: 'sorted',
        indices: [0],
        line: 2,
        description: 'Первый элемент считается отсортированным'
    };
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        yield {
            type: 'pivot',
            indices: [i],
            line: 4,
            description: `Берём элемент arr[${i}]=${key} для вставки`
        };
        
        while (j >= 0 && arr[j] > key) {
            yield {
                type: 'compare',
                indices: [j, j + 1],
                line: 7,
                description: `arr[${j}]=${arr[j]} > ${key}, сдвигаем вправо`
            };
            
            arr[j + 1] = arr[j];
            
            yield {
                type: 'swap',
                indices: [j, j + 1],
                line: 8,
                description: `Сдвигаем arr[${j}]=${arr[j]} на позицию ${j + 1}`
            };
            
            j--;
        }
        
        arr[j + 1] = key;
        
        yield {
            type: 'sorted',
            indices: Array.from({ length: i + 1 }, (_, idx) => idx),
            line: 11,
            description: `Вставляем ${key} на позицию ${j + 1}`
        };
    }
    
    return arr;
}

// =============================================
// MERGE SORT GENERATOR
// =============================================
function* mergeSortGenerator(arr) {
    yield* mergeSortHelper(arr, 0, arr.length - 1);
    
    // Mark all as sorted
    yield {
        type: 'sorted',
        indices: Array.from({ length: arr.length }, (_, i) => i),
        line: 24,
        description: 'Сортировка завершена!'
    };
    
    return arr;
}

function* mergeSortHelper(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        yield {
            type: 'compare',
            indices: [left, mid],
            line: 3,
            description: `Делим массив: левая часть [${left}...${mid}]`
        };
        
        yield* mergeSortHelper(arr, left, mid);
        
        yield {
            type: 'compare',
            indices: [mid + 1, right],
            line: 5,
            description: `Делим массив: правая часть [${mid + 1}...${right}]`
        };
        
        yield* mergeSortHelper(arr, mid + 1, right);
        
        yield* merge(arr, left, mid, right);
    }
}

function* merge(arr, left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    
    yield {
        type: 'pivot',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        line: 13,
        description: `Сливаем части [${left}...${mid}] и [${mid + 1}...${right}]`
    };
    
    let i = 0, j = 0, k = left;
    
    while (i < L.length && j < R.length) {
        yield {
            type: 'compare',
            indices: [left + i, mid + 1 + j],
            line: 18,
            description: `Сравниваем L[${i}]=${L[i]} и R[${j}]=${R[j]}`
        };
        
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            yield {
                type: 'swap',
                indices: [k],
                line: 19,
                description: `Берём ${L[i]} из левой части`
            };
            i++;
        } else {
            arr[k] = R[j];
            yield {
                type: 'swap',
                indices: [k],
                line: 21,
                description: `Берём ${R[j]} из правой части`
            };
            j++;
        }
        k++;
    }
    
    while (i < L.length) {
        arr[k] = L[i];
        yield {
            type: 'swap',
            indices: [k],
            line: 24,
            description: `Копируем остаток: ${L[i]}`
        };
        i++;
        k++;
    }
    
    while (j < R.length) {
        arr[k] = R[j];
        yield {
            type: 'swap',
            indices: [k],
            line: 25,
            description: `Копируем остаток: ${R[j]}`
        };
        j++;
        k++;
    }
}

// =============================================
// QUICK SORT GENERATOR
// =============================================
function* quickSortGenerator(arr) {
    yield* quickSortHelper(arr, 0, arr.length - 1);
    
    // Mark all as sorted
    yield {
        type: 'sorted',
        indices: Array.from({ length: arr.length }, (_, i) => i),
        line: 17,
        description: 'Сортировка завершена!'
    };
    
    return arr;
}

function* quickSortHelper(arr, low, high) {
    if (low < high) {
        const { pi, steps } = yield* partition(arr, low, high);
        
        yield {
            type: 'sorted',
            indices: [pi],
            line: 4,
            description: `Опорный элемент ${arr[pi]} на позиции ${pi}`
        };
        
        yield* quickSortHelper(arr, low, pi - 1);
        yield* quickSortHelper(arr, pi + 1, high);
    } else if (low === high) {
        yield {
            type: 'sorted',
            indices: [low],
            line: 6,
            description: `Элемент ${arr[low]} отсортирован`
        };
    }
}

function* partition(arr, low, high) {
    const pivot = arr[high];
    
    yield {
        type: 'pivot',
        indices: [high],
        line: 11,
        description: `Опорный элемент: arr[${high}]=${pivot}`
    };
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        yield {
            type: 'compare',
            indices: [j, high],
            line: 14,
            description: `Сравниваем arr[${j}]=${arr[j]} с опорным ${pivot}`
        };
        
        if (arr[j] < pivot) {
            i++;
            if (i !== j) {
                yield {
                    type: 'swap',
                    indices: [i, j],
                    line: 16,
                    description: `${arr[j]} < ${pivot}, меняем arr[${i}] и arr[${j}]`
                };
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
    
    if (i + 1 !== high) {
        yield {
            type: 'swap',
            indices: [i + 1, high],
            line: 19,
            description: `Ставим опорный ${pivot} на позицию ${i + 1}`
        };
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }
    
    return { pi: i + 1 };
}

// Generate a random array
export function generateRandomArray(size, min = 5, max = 100) {
    return Array.from({ length: size }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}
// cleanup: minor code tweak
