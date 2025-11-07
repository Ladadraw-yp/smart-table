import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules); 

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => { // Перебираем по именам
        elements[elementName].append( // В каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // Формируем массив имён значений опций
            .map(name => {
            // @todo: создать и вернуть тег опции
            const option = document.createElement('option');
            option.value = name;        
            option.textContent = name;  
            return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        // Проверяем, есть ли действие и это кнопка очистки
        if (action && action.name === 'clear') {
            // Находим родительский контейнер (label.filter-wrapper)
            const parent = action.closest('.filter-wrapper');

            if (parent) {
                // Ищем поле ввода рядом с кнопкой
                const input = parent.querySelector('input');

                if (input) {
                // Очищаем поле ввода
                input.value = '';

                // Узнаём имя поля из data-field кнопки
                const fieldName = action.dataset.field;

                // Если такое поле есть в state — очищаем и его
                if (fieldName && state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        //return data;
        return data.filter(row => compare(row, state)); 
    }
}